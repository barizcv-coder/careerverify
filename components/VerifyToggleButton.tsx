"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VerifyToggleButton({
  mentorId,
  isVerified,
}: {
  mentorId: string;
  isVerified: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        is_verified: !isVerified,
        verification_stage: !isVerified ? 4 : 0,
      })
      .eq("id", mentorId);
    setLoading(false);
    if (!error) router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-60 ${
        isVerified
          ? "bg-red-50 text-red-700 hover:bg-red-100"
          : "bg-accent-600 text-white hover:bg-accent-700"
      }`}
    >
      {loading ? "..." : isVerified ? "إلغاء التوثيق" : "منح شارة التوثيق"}
    </button>
  );
}
