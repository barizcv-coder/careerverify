-- استرجاع صورة أ. حنين حجار إلى الرمز الحرفي (الأفاتار الأصلي)
update public.profiles
set avatar_url = 'https://api.dicebear.com/7.x/initials/svg?seed=HH&backgroundColor=ea580c'
where full_name = 'أ. حنين حجار';

-- تحقّق: select full_name, avatar_url from public.profiles where full_name = 'أ. حنين حجار';
