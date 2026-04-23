"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"mentee" | "mentor">("mentee");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-800 text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-900">تسجيل حساب جديد</h1>
            <p className="text-xs text-slate-500">ابدأ رحلتك في الإرشاد المهني</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              الاسم الكامل
            </label>
            <input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="مثال: عبدالرحمن السالم"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              required
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-left"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              كلمة المرور
            </label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="6 أحرف على الأقل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              نوع الحساب
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("mentee")}
                className={`border rounded-lg px-4 py-3 text-sm font-medium transition ${
                  role === "mentee"
                    ? "border-brand-600 bg-brand-50 text-brand-900"
                    : "border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                طالب (Mentee)
              </button>
              <button
                type="button"
                onClick={() => setRole("mentor")}
                className={`border rounded-lg px-4 py-3 text-sm font-medium transition ${
                  role === "mentor"
                    ? "border-brand-600 bg-brand-50 text-brand-900"
                    : "border-slate-300 text-slate-700 hover:border-slate-400"
                }`}
              >
                مرشد (Mentor)
              </button>
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
            className="w-full bg-brand-800 hover:bg-brand-700 disabled:bg-slate-400 text-white py-2.5 rounded-lg font-medium transition"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </button>

          <p className="text-sm text-center text-slate-600 pt-2">
            لديك حساب؟{" "}
            <Link href="/login" className="text-brand-700 font-medium hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function translateError(msg: string): string {
  if (msg.includes("already registered") || msg.includes("already been registered"))
    return "هذا البريد مسجّل مسبقاً. جرّب تسجيل الدخول.";
  if (msg.includes("Password should be at least"))
    return "كلمة المرور قصيرة — 6 أحرف على الأقل.";
  if (msg.includes("Invalid email"))
    return "صيغة البريد الإلكتروني غير صحيحة.";
  return msg;
}
