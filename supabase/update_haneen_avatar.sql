-- تحديث صورة أ. حنين حجار إلى الصورة الحقيقية
update public.profiles
set avatar_url = '/mentors/haneen.png'
where full_name = 'أ. حنين حجار';

-- تحقّق: select full_name, avatar_url from public.profiles where role = 'mentor';
