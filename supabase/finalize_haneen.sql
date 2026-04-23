-- =================================================================
-- ربط حساب أ. حنين حجار المصادق عليه ببياناتها كمرشدة
-- =================================================================
-- هذا الملف:
-- 1) يؤكّد إيميل حنين تلقائياً (حتى لو email confirmations مفعّلة)
-- 2) يدمج البروفايل المصادَق مع بيانات المرشدة الكاملة (bio, specialty, الخ)
-- 3) يحذف الـ profile الوهمي القديم
-- =================================================================


-- 1) تأكيد إيميل حنين (يخلّيها تقدر تسجّل دخول)

update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'haneen.hajjar@gmail.com';


-- 2) نسخ بيانات المرشدة الكاملة من الـ seed إلى الحساب المصادَق عليه

update public.profiles
set
  full_name          = 'أ. حنين حجار',
  specialty          = 'english_fluency',
  bio                = 'متخصصة في اللغة الإنجليزية المهنية والـ IELTS Speaking. أدرّب الكفاءات السعودية على اجتياز مقابلات العمل بالإنجليزية، تقديم العروض التقديمية بثقة، والتعامل باحترافية مع الشركات الأوروبية والعالمية في بيئات العمل متعدّدة الجنسيات.',
  price_per_hour     = 220,
  is_verified        = true,
  verification_stage = 4,
  success_count      = 65,
  success_stories    = E'اجتياز IELTS بدرجة 8.0+ للانتقال إلى أوروبا (2024)\nمهندس أول في شركة ألمانية بعد تدريب مقابلات إنجليزية (2024)\nباحث دكتوراه في أكسفورد بعد تحسين Speaking (2023)\nمدير مشاريع في شركة سويدية متعدّدة الجنسيات (2024)\nاجتياز مقابلة تنفيذية بالإنجليزية مع مديرين أوروبيين (2023)',
  avatar_url         = '/mentors/haneen.png'
where id = (
  select id from auth.users where email = 'haneen.hajjar@gmail.com' limit 1
);


-- 3) حذف الـ profile القديم (الوهمي الذي ليس له حساب auth)

delete from public.profiles
where full_name = 'أ. حنين حجار'
  and id not in (select id from auth.users);


-- تم ✅
-- تحقّق: select full_name, specialty, is_verified from public.profiles where role = 'mentor';
