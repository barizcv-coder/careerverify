import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SPECIALTY_LABELS, type Profile, type Specialty } from "@/lib/types";
import { ShieldCheck, Star, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const SPECIALTIES: Array<{ value: Specialty | "all"; label: string }> = [
  { value: "all", label: "الكل" },
  { value: "cv_building", label: SPECIALTY_LABELS.cv_building },
  { value: "interview_prep", label: SPECIALTY_LABELS.interview_prep },
  { value: "career_mapping", label: SPECIALTY_LABELS.career_mapping },
  { value: "industry_transition", label: SPECIALTY_LABELS.industry_transition },
];

const PRICES = [
  { value: "all", label: "أي سعر" },
  { value: "lt100", label: "أقل من 100 ﷼" },
  { value: "100-200", label: "100 - 200 ﷼" },
  { value: "gt200", label: "أكثر من 200 ﷼" },
];

export default async function MentorsPage({
  searchParams,
}: {
  searchParams: { specialty?: string; price?: string };
}) {
  const specialty = searchParams.specialty ?? "all";
  const price = searchParams.price ?? "all";

  const supabase = createClient();
  let query = supabase.from("profiles").select("*").eq("role", "mentor");

  if (specialty !== "all") query = query.eq("specialty", specialty);
  if (price === "lt100") query = query.lt("price_per_hour", 100);
  if (price === "100-200")
    query = query.gte("price_per_hour", 100).lte("price_per_hour", 200);
  if (price === "gt200") query = query.gt("price_per_hour", 200);

  const { data: mentors, error } = await query.order("is_verified", {
    ascending: false,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-brand-900 mb-2">
          جميع المرشدين
        </h1>
        <p className="text-slate-600">
          اختر المرشد المناسب حسب تخصصك واحجز جلستك الآن.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar filters */}
        <aside className="bg-white border border-slate-200 rounded-xl p-5 h-fit lg:sticky lg:top-20">
          <h2 className="font-bold text-slate-900 mb-3">التخصص</h2>
          <div className="space-y-1.5 mb-6">
            {SPECIALTIES.map((s) => {
              const href = buildHref({ specialty: s.value, price });
              const active = s.value === specialty;
              return (
                <Link
                  key={s.value}
                  href={href}
                  className={`block px-3 py-2 rounded-md text-sm transition ${
                    active
                      ? "bg-brand-800 text-white font-medium"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>

          <h2 className="font-bold text-slate-900 mb-3">السعر</h2>
          <div className="space-y-1.5">
            {PRICES.map((p) => {
              const href = buildHref({ specialty, price: p.value });
              const active = p.value === price;
              return (
                <Link
                  key={p.value}
                  href={href}
                  className={`block px-3 py-2 rounded-md text-sm transition ${
                    active
                      ? "bg-brand-800 text-white font-medium"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Grid */}
        <section>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm mb-4">
              حدث خطأ في جلب البيانات: {error.message}
              <div className="mt-2 text-xs text-red-700">
                تأكّد من تشغيل ملف <code>schema.sql</code> في Supabase.
              </div>
            </div>
          )}

          {!error && (!mentors || mentors.length === 0) && (
            <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-600">
              ما في مرشدين بهذه الفلاتر. جرّب فلاتر ثانية.
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {mentors?.map((m: Profile) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function buildHref({ specialty, price }: { specialty: string; price: string }) {
  const sp = new URLSearchParams();
  if (specialty && specialty !== "all") sp.set("specialty", specialty);
  if (price && price !== "all") sp.set("price", price);
  const q = sp.toString();
  return q ? `/mentors?${q}` : "/mentors";
}

function MentorCard({ mentor }: { mentor: Profile }) {
  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-brand-300 transition">
      <div className="flex items-start gap-4 mb-4">
        {mentor.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mentor.avatar_url}
            alt={mentor.full_name}
            className="h-14 w-14 rounded-full bg-slate-100 object-cover shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0">
            {mentor.full_name.charAt(0)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-slate-900 truncate">
              {mentor.full_name}
            </h3>
            {mentor.is_verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-600/10 text-accent-700 text-xs font-medium">
                <ShieldCheck className="h-3 w-3" />
                موثق
              </span>
            )}
          </div>
          {mentor.specialty && (
            <p className="text-sm text-slate-600 mt-0.5">
              {SPECIALTY_LABELS[mentor.specialty]}
            </p>
          )}
        </div>
      </div>

      {mentor.bio && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {mentor.bio}
        </p>
      )}

      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-1 text-amber-600">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span className="font-medium text-slate-800">
            {mentor.success_count}
          </span>
          <span className="text-slate-500 text-xs">نجاح</span>
        </div>
        {mentor.price_per_hour != null && (
          <div className="font-bold text-brand-800">
            {mentor.price_per_hour} ﷼
            <span className="text-xs text-slate-500 font-normal"> / ساعة</span>
          </div>
        )}
      </div>

      <Link
        href={`/mentors/${mentor.id}`}
        className="flex items-center justify-center gap-1 w-full bg-brand-50 hover:bg-brand-100 text-brand-800 font-medium py-2 rounded-lg transition text-sm"
      >
        شوف التفاصيل
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </article>
  );
}
