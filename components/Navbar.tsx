import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  let user = null;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-extrabold text-base text-brand-900 group-hover:text-brand-700 transition" dir="ltr">
              Career<span className="text-accent-600">Verify</span>
            </div>
            <div className="text-[10px] text-slate-500 -mt-0.5">
              موثّق · شفّاف · مسؤول
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4 text-sm">
          <Link
            href="/mentors"
            className="px-3 py-2 rounded-md text-slate-700 hover:text-brand-800 hover:bg-slate-100 transition"
          >
            المرشدون
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md text-slate-700 hover:text-brand-800 hover:bg-slate-100 transition"
            >
              لوحتي
            </Link>
          )}
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-slate-700 hover:text-brand-800 hover:bg-slate-100 transition"
              >
                دخول
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-brand-800 text-white hover:bg-brand-700 transition font-medium"
              >
                تسجيل
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
