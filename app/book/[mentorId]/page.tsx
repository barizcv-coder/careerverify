import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingForm from "./BookingForm";
import { SPECIALTY_LABELS, type Profile } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: { mentorId: string };
  searchParams: { type?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/book/${params.mentorId}`);
  }

  const { data: mentor } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.mentorId)
    .eq("role", "mentor")
    .single();

  if (!mentor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          المرشد غير موجود
        </h1>
        <p className="text-slate-600">تأكّد من الرابط أو رجّع لقائمة المرشدين.</p>
      </div>
    );
  }

  const typedMentor = mentor as Profile;
  const initialType =
    searchParams.type === "15min_trial" ? "15min_trial" : "60min";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 mb-1">
        حجز جلسة
      </h1>
      <p className="text-slate-600 mb-6">
        ستحجز مع{" "}
        <strong className="text-brand-800">{typedMentor.full_name}</strong>
        {typedMentor.is_verified && (
          <span className="inline-flex items-center gap-1 mr-2 px-2 py-0.5 rounded-full bg-accent-600/10 text-accent-700 text-xs font-medium">
            <ShieldCheck className="h-3 w-3" />
            موثّق
          </span>
        )}
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <BookingForm
          mentorId={typedMentor.id}
          mentorName={typedMentor.full_name}
          pricePerHour={typedMentor.price_per_hour ?? 0}
          specialty={
            typedMentor.specialty ? SPECIALTY_LABELS[typedMentor.specialty] : ""
          }
          initialType={initialType}
        />
      </div>

      <p className="text-xs text-center text-slate-500 mt-4">
        💡 هذا MVP للعرض الجامعي — الدفع الحقيقي لم يُفعَّل بعد. الحجز ينشئ
        جلسة بحالة "قيد الانتظار".
      </p>
    </div>
  );
}
