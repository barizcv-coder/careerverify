import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  SPECIALTY_LABELS,
  type Profile,
  type SessionRow,
  type Review,
} from "@/lib/types";
import {
  Calendar,
  ShieldCheck,
  Clock,
  UserCircle,
  Lock,
  Star,
} from "lucide-react";
import MarkCompletedButton from "@/components/MarkCompletedButton";
import ReviewForm from "@/components/ReviewForm";

export const dynamic = "force-dynamic";

type SessionWithPeople = SessionRow & {
  mentor: Profile | null;
  mentee: Profile | null;
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: sessions } = await supabase
    .from("sessions")
    .select(
      `*,
      mentor:profiles!sessions_mentor_id_fkey(*),
      mentee:profiles!sessions_mentee_id_fkey(*)`
    )
    .or(`mentee_id.eq.${user.id},mentor_id.eq.${user.id}`)
    .order("scheduled_time", { ascending: false });

  const { data: myReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("mentee_id", user.id);

  const profile = myProfile as Profile | null;
  const typedSessions = (sessions ?? []) as unknown as SessionWithPeople[];
  const reviewedSessionIds = new Set(
    (myReviews ?? []).map((r: Review) => r.session_id)
  );

  const role = profile?.role ?? "mentee";
  const isMentor = role === "mentor";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Greeting */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xl">
            {(profile?.full_name ?? user.email ?? "?").charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold text-brand-900 truncate">
              أهلاً، {profile?.full_name ?? "مستخدم جديد"}
            </h1>
            <p className="text-sm text-slate-600 flex items-center gap-1 flex-wrap">
              <UserCircle className="h-4 w-4" />
              {roleLabel(role)}
              {profile?.is_verified && (
                <span className="inline-flex items-center gap-1 mr-2 px-2 py-0.5 rounded-full bg-accent-600/10 text-accent-700 text-xs font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  موثّق
                </span>
              )}
            </p>
          </div>
        </div>

        {isMentor && !profile?.is_verified && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <strong>حسابك كمرشد غير موثّق بعد.</strong> سيراجع Verification
              Officer شهاداتك قبل ظهور الشارة. حالياً تستطيع استقبال الحجوزات،
              لكن بدون شارة "موثّق".
            </div>
          </div>
        )}
      </section>

      {/* Sessions */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="h-5 w-5 text-brand-700" />
          <h2 className="text-xl font-bold text-slate-900">جلساتي</h2>
          <span className="mr-auto text-sm text-slate-500">
            {typedSessions.length} جلسة
          </span>
        </div>

        {typedSessions.length === 0 ? (
          <div className="text-center py-10 text-slate-600">
            <p className="mb-4">ما عندك جلسات بعد.</p>
            {!isMentor && (
              <Link
                href="/mentors"
                className="inline-block px-5 py-2.5 rounded-lg bg-brand-800 text-white hover:bg-brand-700 transition font-medium"
              >
                تصفّح المرشدين
              </Link>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {typedSessions.map((s) => {
              const otherParty = isMentor ? s.mentee : s.mentor;
              const canReview =
                !isMentor &&
                s.status === "completed" &&
                !reviewedSessionIds.has(s.id);

              return (
                <li
                  key={s.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-brand-300 transition"
                >
                  <div className="flex items-start gap-3">
                    {otherParty?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={otherParty.avatar_url}
                        alt=""
                        className="h-11 w-11 rounded-full bg-slate-100 object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0">
                        {(otherParty?.full_name ?? "؟").charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
                        <h3 className="font-semibold text-slate-900">
                          {isMentor ? "مع الطالب" : "مع المرشد"}:{" "}
                          {otherParty?.full_name ?? "—"}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[s.status]
                          }`}
                        >
                          {STATUS_LABELS[s.status]}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 flex items-center flex-wrap gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {s.type === "60min" ? "60 دقيقة" : "15 دقيقة تجربة"}
                        </span>
                        <span>
                          {new Date(s.scheduled_time).toLocaleString("ar-SA", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        {otherParty?.specialty && (
                          <span>
                            {SPECIALTY_LABELS[otherParty.specialty]}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center flex-wrap gap-2">
                        {s.status === "pending" && (
                          <MarkCompletedButton
                            sessionId={s.id}
                            label="تأكيد الجلسة (Mock)"
                            nextStatus="confirmed"
                          />
                        )}
                        {(s.status === "confirmed" || s.status === "live") && (
                          <MarkCompletedButton
                            sessionId={s.id}
                            label="وضع كمكتملة"
                            nextStatus="completed"
                          />
                        )}
                        {canReview && (
                          <ReviewFormToggle
                            sessionId={s.id}
                            mentorId={s.mentor_id}
                          />
                        )}
                        {!isMentor &&
                          s.status === "completed" &&
                          reviewedSessionIds.has(s.id) && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Lock className="h-3 w-3" />
                              راجعت هذه الجلسة (لا يمكن التعديل)
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* My reviews */}
      {!isMentor && myReviews && myReviews.length > 0 && (
        <section className="mt-6 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">مراجعاتي</h2>
            <span className="mr-auto inline-flex items-center gap-1 text-xs text-slate-500">
              <Lock className="h-3 w-3" />
              غير قابلة للحذف
            </span>
          </div>
          <ul className="space-y-3">
            {(myReviews as Review[]).map((r) => (
              <li
                key={r.id}
                className="border border-slate-200 rounded-lg p-3 text-sm"
              >
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
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
                <p className="text-slate-700">{r.comment}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function roleLabel(r: string) {
  if (r === "mentor") return "مرشد";
  if (r === "admin") return "أدمن";
  return "طالب (Mentee)";
}

function ReviewFormToggle({
  sessionId,
  mentorId,
}: {
  sessionId: string;
  mentorId: string;
}) {
  return <ReviewForm sessionId={sessionId} mentorId={mentorId} />;
}
