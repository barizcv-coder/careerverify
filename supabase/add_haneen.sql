-- =================================================================
-- إضافة تخصص "الإنجليزية المهنية" + المرشدة أ. حنين حجار
-- =================================================================
-- شغّل هذا في: Supabase Dashboard → SQL Editor → New Query → Run
-- =================================================================


-- 1) تحديث الـ CHECK constraint ليقبل التخصص الجديد

alter table public.profiles drop constraint if exists profiles_specialty_check;

alter table public.profiles add constraint profiles_specialty_check
  check (specialty is null or specialty in
    ('cv_building', 'interview_prep', 'career_mapping', 'industry_transition', 'english_fluency'));


-- 2) إضافة أ. حنين حجار

insert into public.profiles (
  full_name,
  role,
  specialty,
  bio,
  price_per_hour,
  is_verified,
  verification_stage,
  success_count,
  success_stories,
  avatar_url
) values (
  'أ. حنين حجار',
  'mentor',
  'english_fluency',
  'متخصصة في اللغة الإنجليزية المهنية والـ IELTS Speaking. أدرّب الكفاءات السعودية على اجتياز مقابلات العمل بالإنجليزية، تقديم العروض التقديمية بثقة، والتعامل باحترافية مع الشركات الأوروبية والعالمية في بيئات العمل متعدّدة الجنسيات.',
  220,
  true,
  4,
  65,
  E'اجتياز IELTS بدرجة 8.0+ للانتقال إلى أوروبا (2024)\nمهندس أول في شركة ألمانية بعد تدريب مقابلات إنجليزية (2024)\nباحث دكتوراه في أكسفورد بعد تحسين Speaking (2023)\nمدير مشاريع في شركة سويدية متعدّدة الجنسيات (2024)\nاجتياز مقابلة تنفيذية بالإنجليزية مع مديرين أوروبيين (2023)',
  'https://api.dicebear.com/7.x/initials/svg?seed=HH&backgroundColor=ea580c'
);


-- تم ✅
-- تحقّق: select full_name, specialty from public.profiles where role = 'mentor';
