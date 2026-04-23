import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  SPECIALTY_LABELS,
  VERIFICATION_STAGES,
  type Profile,
  type Review,
} from "@/lib/types";
import {
  ShieldCheck,
  Star,
  Trophy,
  Lock,
  Check,
  CircleDashed,
  Building2,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MentorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: mentor } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .eq("role", "mentor")
    .single();

  if (!mentor) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("mentor_id", params.id)
    .order("created_at", { ascending: false });

  const typedMentor = mentor as Profile;
  const typedReviews = (reviews ?? []) as Review[];
  const successes = parseSuccesses(typedMentor.success_stories);
  const avgRating =
    typedReviews.length > 0
      ? typedReviews.reduce((s, r) => s + r.rating, 0) / typedReviews.length
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header card */}
      <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {typedMentor.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typedMentor.avatar_url}
              alt={typedMentor.full_name}
              className="h-24 w-24 rounded-full bg-slate-100 object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-3xl">
              {typedMentor.full_name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900">
                {typedMentor.full_name}
              </h1>
              {typedMentor.is_verified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-600 text-white text-xs font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  موثّق
                </span>
              )}
            </div>

            {typedMentor.specialty && (
              <p className="text-slate-600 mb-3">
                {SPECIALTY_LABELS[typedMentor.specialty]}
              </p>
            )}

            <div className="flex items-center flex-wrap gap-4 text-sm">
              {avgRating != null ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-bold text-slate-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    ({typedReviews.length} مراجعة)
                  </span>
                </div>
              ) : (
                <div className="text-slate-500">لا توجد مراجعات بعد</div>
              )}
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-600" />
                <span className="font-bold text-slate-900">
                  {typedMentor.success_count}
                </span>
                <span className="text-slate-500">نجاح موثّق</span>
              </div>
            </div>
          </div>

          {typedMentor.price_per_hour != null && (
            <div className="text-left">
              <div className="text-3xl font-extrabold text-brand-800" dir="ltr">
                {typedMentor.price_per_hour} ﷼
              </div>
              <div className="text-xs text-slate-500">للساعة الكاملة</div>
            </div>
          )}
        </div>

        {typedMentor.bio && (
          <p className="mt-5 text-slate-700 leading-relaxed">{typedMentor.bio}</p>
        )}

        {/* Booking buttons */}
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <Link
            href={`/book/${typedMentor.id}?type=60min`}
            className="flex items-center justify-center gap-2 bg-brand-800 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition"
          >
            <Clock className="h-4 w-4" />
            احجز جلسة 60 دقيقة
          </Link>
          <Link
            href={`/book/${typedMentor.id}?type=15min_trial`}
            className="flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-700 text-white font-semibold py-3 rounded-lg transition"
          >
            <Clock className="h-4 w-4" />
            احجز تجربة 15 دقيقة
          </Link>
        </div>
      </article>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Verification stages */}
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-accent-700" />
            <h2 className="font-bold text-lg text-slate-900">
              مراحل التوثيق
            </h2>
          </div>
          <ol className="space-y-3">
            {VERIFICATION_STAGES.map((s) => {
              const done = typedMentor.verification_stage >= s.n;
              return (
                <li key={s.n} className="flex items-center gap-3">
                  {done ? (
                    <div className="h-7 w-7 rounded-full bg-accent-600 text-white flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center shrink-0">
                      <CircleDashed className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`text-sm ${
                      done ? "text-slate-900 font-medium" : "text-slate-500"
                    }`}
                  >
                    {s.label}
                  </div>
                </li>
              );
            })}
          </ol>
          {!typedMentor.is_verified && (
            <p className="mt-4 text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900">
              ⚠️ هذا المرشد لم يكتمل توثيقه بعد. جلساته متاحة لكن بدون شارة
              "موثّق".
            </p>
          )}
        </section>

        {/* Success Portfolio */}
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-amber-600" />
            <h2 className="font-bold text-lg text-slate-900">
              Success Portfolio
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            أين وظّف هذا المرشد عملاءه السابقين — سجل دائم عام.
          </p>
          {successes.length > 0 ? (
            <ul className="space-y-2.5">
              {successes.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm"
                >
                  <Building2 className="h-4 w-4 text-brand-700 shrink-0" />
                  <span className="text-slate-800">{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">لا توجد نجاحات مسجّلة بعد.</p>
          )}
        </section>
      </div>

      {/* Non-deletable banner */}
      <div className="mt-6 bg-gradient-to-l from-accent-600 to-accent-700 text-white rounded-xl p-5 flex items-start gap-3">
        <Lock className="h-6 w-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold mb-1">
            🔒 المراجعات غير قابلة للحذف — ضمان الشفافية الكامل
          </h3>
          <p className="text-sm text-accent-50 leading-relaxed">
            كل مراجعة تُكتب هنا تبقى للأبد. المرشد لا يقدر يحذفها، لا يعدّلها،
            ولا يخفيها — القاعدة مفروضة على مستوى قاعدة البيانات (PostgreSQL
            RLS)، مو مجرد قاعدة تطبيق ممكن تنفصل.
          </p>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold text-lg text-slate-900 mb-4">
          مراجعات العملاء ({typedReviews.length})
        </h2>

        {typedReviews.length === 0 ? (
          <p className="text-sm text-slate-500">
            ما في مراجعات بعد. كن أول من يجرّب.
          </p>
        ) : (
          <ul className="space-y-4">
            {typedReviews.map((r) => (
              <li
                key={r.id}
                className="border-b border-slate-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating
                          ? "fill-amber-500 text-amber-500"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-500 mr-2">
                    {new Date(r.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {r.comment}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function parseSuccesses(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
