-- =================================================================
-- بيانات وهمية للعرض - 4 مرشدين
-- شغّله في: Supabase Dashboard → SQL Editor → New Query → Run
-- =================================================================
-- يمكن تشغيله مرة واحدة فقط (وإلا ستتكرر البيانات)
-- لإعادة التشغيل، احذف المرشدين الحاليين أولاً:
--   delete from public.profiles where role = 'mentor' and full_name in
--     ('د. أحمد الشمري', 'أ. فاطمة الزهراني', 'م. خالد العتيبي', 'د. نورة القحطاني');
-- =================================================================

insert into public.profiles
  (full_name, role, specialty, bio, price_per_hour, is_verified, verification_stage, success_count, success_stories, avatar_url)
values
  ('د. أحمد الشمري', 'mentor', 'interview_prep',
    'خبير بـ 10 سنوات في تدريب المقابلات التقنية، ساعدت 200+ مهندس على التوظيف في شركات كبرى مثل Amazon و STC.',
    150, true, 4, 47,
    E'مهندس برمجيات @ Amazon (2024)\nمحلل بيانات @ STC (2024)\nمطوّر iOS @ Careem (2023)\nمهندس DevOps @ SABIC (2023)',
    'https://api.dicebear.com/7.x/initials/svg?seed=AS&backgroundColor=1e40af&fontSize=40&fontWeight=700'),

  ('أ. فاطمة الزهراني', 'mentor', 'cv_building',
    'متخصصة في كتابة السير الذاتية للخريجين الجدد. خلفية 8 سنوات في الموارد البشرية في شركات سعودية رائدة.',
    100, true, 4, 89,
    E'مسؤولة تسويق @ ARAMCO (2024)\nمحلل أعمال @ stc pay (2024)\nمهندس مدني @ NEOM (2023)\nمعلّمة @ Ministry of Education (2024)',
    'https://api.dicebear.com/7.x/initials/svg?seed=FZ&backgroundColor=059669&fontSize=40&fontWeight=700'),

  ('م. خالد العتيبي', 'mentor', 'career_mapping',
    'مهندس برمجيات سابقاً (12 سنة خبرة)، الآن مرشد مهني للطلاب في مجال التقنية والهندسة. خبرة في Google و Careem.',
    200, true, 4, 32,
    E'مهندس بيانات @ Google (2024)\nمهندس ML @ Careem (2024)\nمؤسس شركة ناشئة (2023)\nمدير منتج @ Jahez (2023)',
    'https://api.dicebear.com/7.x/initials/svg?seed=KA&backgroundColor=b91c1c&fontSize=40&fontWeight=700'),

  ('د. نورة القحطاني', 'mentor', 'industry_transition',
    'ساعدت 50+ شخص في التحول من مجال لآخر. تخصصها الانتقال من المجالات التقليدية إلى القطاع التقني.',
    175, false, 2, 12,
    E'محلل أعمال @ Monsha''at (2024)\nمدير منتج @ Tamara (2024)\nمطوّر برمجيات @ HRSD (2023)',
    'https://api.dicebear.com/7.x/initials/svg?seed=NQ&backgroundColor=7c3aed&fontSize=40&fontWeight=700');

-- تم ✅ - تفقّد البيانات: select full_name, specialty, is_verified from public.profiles where role = 'mentor';
