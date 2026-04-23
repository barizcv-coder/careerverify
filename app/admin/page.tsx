import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  SPECIALTY_LABELS,
  type Profile,
} from "@/lib/types";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import VerifyToggleButton from "@/components/VerifyToggleButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: me } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || (me as Profile).role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ShieldAlert className="h-14 w-14 text-red-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          الوصول مرفوض
        </h1>
        <p className="text-slate-600">
          هذه الصفحة للأدمن فقط. حوّل دورك من Supabase Dashboard:
        </p>
        <code className="block mt-4 text-xs bg-slate-100 rounded-lg p-3 text-left" dir="ltr">
          update public.profiles set role = &apos;admin&apos; where id = &apos;{user.id}&apos;;
        </code>
      </div>
    );
  }

  const { data: mentors } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "mentor")
    .order("is_verified", { ascending: true });

  const typed = (mentors ?? []) as Profile[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-brand-900 mb-1">
        لوحة الأدمن — توثيق المرشدين
      </h1>
      <p className="text-slate-600 mb-6">
        Verification Officer: راجع المرشدين وفعّل شارة "موثّق" بعد الفحص.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
        {typed.map((m) => (
          <div
            key={m.id}
            className="p-4 flex items-center gap-4 flex-wrap"
          >
            {m.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.avatar_url}
                alt=""
                className="h-12 w-12 rounded-full bg-slate-100 object-cover shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0">
                {m.full_name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900">{m.full_name}</h3>
                {m.is_verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-600/10 text-accent-700 text-xs font-medium">
                    <ShieldCheck className="h-3 w-3" />
                    موثّق
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                    <ShieldAlert className="h-3 w-3" />
                    غير موثّق
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {m.specialty ? SPECIALTY_LABELS[m.specialty] : "—"} · المرحلة{" "}
                {m.verification_stage}/4
              </p>
            </div>

            <VerifyToggleButton mentorId={m.id} isVerified={m.is_verified} />
          </div>
        ))}

        {typed.length === 0 && (
          <div className="p-10 text-center text-slate-500 text-sm">
            لا توجد حسابات مرشدين بعد.
          </div>
        )}
      </div>
    </div>
  );
}
