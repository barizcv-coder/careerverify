"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Star, Lock } from "lucide-react";

export default function ReviewForm({
  sessionId,
  mentorId,
}: {
  sessionId: string;
  mentorId: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (comment.trim().length < 10) {
      setError("المراجعة قصيرة جداً — اكتب 10 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("يجب تسجيل الدخول.");
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.from("reviews").insert({
      session_id: sessionId,
      mentee_id: user.id,
      mentor_id: mentorId,
      rating,
      comment: comment.trim(),
    });

    setLoading(false);
    if (err) {
      setError(`تعذّر إرسال المراجعة: ${err.message}`);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1.5 rounded-md bg-accent-600 hover:bg-accent-700 text-white font-medium transition"
      >
        اكتب مراجعة
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="w-full border-2 border-accent-200 rounded-lg p-4 bg-accent-50/30 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-accent-700" />
          اكتب مراجعة (لا يمكن تعديلها أو حذفها بعد الإرسال)
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-slate-500 hover:text-slate-800"
        >
          إلغاء
        </button>
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-1">التقييم</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = n <= (hover || rating);
            return (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                aria-label={`${n} نجوم`}
              >
                <Star
                  className={`h-6 w-6 transition ${
                    filled
                      ? "fill-amber-500 text-amber-500"
                      : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
          <span className="text-xs text-slate-600 mr-2">{rating} / 5</span>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-600 mb-1">
          تعليقك (لن يُحذف أبداً)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={800}
          placeholder="اشرح تجربتك مع المرشد بصدق..."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        <div className="text-xs text-slate-400 mt-1 text-left">
          {comment.length} / 800
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent-600 hover:bg-accent-700 disabled:bg-slate-400 text-white text-sm font-medium py-2 rounded-lg transition"
      >
        {loading ? "جاري الإرسال..." : "إرسال المراجعة (دائماً)"}
      </button>
    </form>
  );
}
