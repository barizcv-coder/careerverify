-- =================================================================
-- منصة الإرشاد المهني والأكاديمي - Database Schema
-- CCS 3382 - Software Engineering - الجامعة الإسلامية بالمدينة
-- =================================================================
-- يمكن تشغيل هذا الملف أكثر من مرة (idempotent)
-- شغّله في: Supabase Dashboard → SQL Editor → New Query → Run
-- =================================================================


-- ================ 1) الجداول ================

-- الملفات الشخصية (يمتد من auth.users)
-- ملاحظة: id يُعبّأ تلقائياً من trigger لكل مستخدم جديد،
-- أو يدوياً عند إضافة بيانات وهمية (seed)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null check (role in ('mentee', 'mentor', 'admin')),
  specialty text check (
    specialty is null or specialty in
      ('cv_building', 'interview_prep', 'career_mapping', 'industry_transition')
  ),
  bio text,
  price_per_hour numeric,
  is_verified boolean default false,
  alias_mode boolean default false,
  success_count int default 0,
  success_stories text,  -- Success Portfolio: إنجازات المرشد (سطر لكل إنجاز)
  verification_stage int default 0,  -- 0=new, 1=docs, 2=refs, 3=sample, 4=verified
  avatar_url text,
  created_at timestamptz default now()
);

-- الجلسات
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  mentee_id uuid references public.profiles(id) on delete cascade not null,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('60min', '15min_trial')),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'live', 'completed', 'cancelled', 'failed')),
  scheduled_time timestamptz not null,
  recording_url text,
  created_at timestamptz default now()
);

-- المراجعات (غير قابلة للحذف - الميزة الأساسية!)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null unique,
  mentee_id uuid references public.profiles(id) on delete cascade not null,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  is_deletable boolean default false not null check (is_deletable = false),
  created_at timestamptz default now()
);

-- المدفوعات
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade unique not null,
  amount numeric not null,
  commission_rate numeric default 0.175,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_ref text,
  created_at timestamptz default now()
);


-- ================ 2) فهارس للسرعة ================

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_specialty on public.profiles(specialty);
create index if not exists idx_sessions_mentee on public.sessions(mentee_id);
create index if not exists idx_sessions_mentor on public.sessions(mentor_id);
create index if not exists idx_reviews_mentor on public.reviews(mentor_id);


-- ================ 3) تفعيل Row Level Security ================

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.reviews  enable row level security;
alter table public.payments enable row level security;


-- ================ 4) سياسات profiles ================

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);


-- ================ 5) سياسات sessions ================

drop policy if exists "sessions_select_participant" on public.sessions;
create policy "sessions_select_participant" on public.sessions
  for select using (auth.uid() = mentee_id or auth.uid() = mentor_id);

drop policy if exists "sessions_insert_mentee" on public.sessions;
create policy "sessions_insert_mentee" on public.sessions
  for insert with check (auth.uid() = mentee_id);

drop policy if exists "sessions_update_participant" on public.sessions;
create policy "sessions_update_participant" on public.sessions
  for update using (auth.uid() = mentee_id or auth.uid() = mentor_id);


-- ================ 6) سياسات reviews (الميزة الأساسية!) ================
-- الكل يقرأ - الطالب فقط ينشئ - محد يعدّل - محد يحذف

drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all" on public.reviews
  for select using (true);

drop policy if exists "reviews_insert_mentee" on public.reviews;
create policy "reviews_insert_mentee" on public.reviews
  for insert with check (auth.uid() = mentee_id);

-- ⚠️ لا يوجد policy للـ UPDATE - المراجعات غير قابلة للتعديل
-- ⚠️ لا يوجد policy للـ DELETE - المراجعات غير قابلة للحذف


-- ================ 7) سياسات payments ================

drop policy if exists "payments_select_participant" on public.payments;
create policy "payments_select_participant" on public.payments
  for select using (
    exists (
      select 1 from public.sessions s
      where s.id = session_id
        and (s.mentee_id = auth.uid() or s.mentor_id = auth.uid())
    )
  );

drop policy if exists "payments_insert_mentee" on public.payments;
create policy "payments_insert_mentee" on public.payments
  for insert with check (
    exists (
      select 1 from public.sessions s
      where s.id = session_id and s.mentee_id = auth.uid()
    )
  );


-- ================ 8) Trigger: إنشاء profile تلقائياً عند التسجيل ================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    coalesce(new.raw_user_meta_data->>'role', 'mentee')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ================ تم ✅ ================
-- الخطوة التالية: شغّل ملف seed.sql لإضافة المرشدين الوهميين
