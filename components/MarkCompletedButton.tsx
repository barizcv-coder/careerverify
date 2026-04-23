"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MarkCompletedButton({
  sessionId,
  label,
  nextStatus,
}: {
  sessionId: string;
  label: string;
  nextStatus: "confirmed" | "completed";
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    const { error } = await supabase
      .from("sessions")
      .update({ status: nextStatus })
      .eq("id", sessionId);
    setLoading(false);
    if (!error) router.refresh();
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-md bg-brand-50 hover:bg-brand-100 text-brand-800 font-medium disabled:opacity-60 transition"
    >
      {loading ? "..." : label}
    </button>
  );
}
