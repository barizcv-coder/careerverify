"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Clock, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BookingForm({
  mentorId,
  mentorName,
  pricePerHour,
  specialty,
  initialType,
}: {
  mentorId: string;
  mentorName: string;
  pricePerHour: number;
  specialty: string;
  initialType: "60min" | "15min_trial";
}) {
  const router = useRouter();
  const supabase = createClient();

  const [type, setType] = useState<"60min" | "15min_trial">(initialType);
  const [date, setDate] = useState<string>(defaultDate());
  const [time, setTime] = useState<string>("10:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const price = type === "60min" ? pricePerHour : 0; // تجربة مجانية
  const commissionRate = 0.175;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=/book/${mentorId}`);
      return;
    }

    const scheduled = new Date(`${date}T${time}:00`).toISOString();

    const { data: session, error: sErr } = await supabase
      .from("sessions")
      .insert({
        mentee_id: user.id,
        mentor_id: mentorId,
        type,
        scheduled_time: scheduled,
        status: "pending",
      })
      .select()
      .single();

    if (sErr || !session) {
      setError(`تعذّر إنشاء الجلسة: ${sErr?.message ?? "خطأ غير معروف"}`);
      setLoading(false);
      return;
    }

    if (price > 0) {
      const { error: pErr } = await supabase.from("payments").insert({
        session_id: session.id,
        amount: price,
        commission_rate: commissionRate,
        status: "pending",
      });
      if (pErr) {
        setError(`تعذّر إنشاء سجل الدفع: ${pErr.message}`);
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 text-accent-600 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-900 mb-1">
          تم إنشاء الحجز ✓
        </h3>
        <p className="text-sm text-slate-600">
          جاري توجيهك إلى لوحة التحكم...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          نوع الجلسة
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType("60min")}
            className={`flex flex-col items-start gap-1 p-4 rounded-lg border-2 text-right transition ${
              type === "60min"
                ? "border-brand-600 bg-brand-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Clock className="h-4 w-4" />
              جلسة كاملة
            </span>
            <span className="text-xs text-slate-500">60 دقيقة</span>
            <span className="text-sm font-bold text-brand-800 mt-1" dir="ltr">
              {pricePerHour} ﷼
            </span>
          </button>
          <button
            type="button"
            onClick={() => setType("15min_trial")}
            className={`flex flex-col items-start gap-1 p-4 rounded-lg border-2 text-right transition ${
              type === "15min_trial"
                ? "border-accent-600 bg-accent-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Clock className="h-4 w-4" />
              تجربة مجانية
            </span>
            <span className="text-xs text-slate-500">15 دقيقة</span>
            <span className="text-sm font-bold text-accent-700 mt-1">
              مجاناً
            </span>
          </button>
        </div>
      </div>

      {/* Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            التاريخ
          </label>
          <input
            required
            type="date"
            value={date}
            min={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            الوقت
          </label>
          <input
            required
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-600">المرشد:</span>
          <span className="font-medium text-slate-900">{mentorName}</span>
        </div>
        {specialty && (
          <div className="flex justify-between">
            <span className="text-slate-600">التخصص:</span>
            <span className="font-medium text-slate-900">{specialty}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600">المدة:</span>
          <span className="font-medium text-slate-900">
            {type === "60min" ? "60 دقيقة" : "15 دقيقة (تجربة)"}
          </span>
        </div>
        <div className="flex justify-between border-t border-slate-300 pt-2 mt-2">
          <span className="font-bold text-slate-900">المبلغ:</span>
          <span className="font-bold text-brand-800" dir="ltr">
            {price > 0 ? `${price} ﷼` : "مجاني"}
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-brand-800 hover:bg-brand-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition"
      >
        <Calendar className="h-4 w-4" />
        {loading ? "جاري الحجز..." : "تأكيد الحجز"}
      </button>
    </form>
  );
}

function todayIso() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}
function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
}
