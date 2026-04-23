export type Role = "mentee" | "mentor" | "admin";

export type Specialty =
  | "cv_building"
  | "interview_prep"
  | "career_mapping"
  | "industry_transition";

export type SessionType = "60min" | "15min_trial";

export type SessionStatus =
  | "pending"
  | "confirmed"
  | "live"
  | "completed"
  | "cancelled"
  | "failed";

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  specialty: Specialty | null;
  bio: string | null;
  price_per_hour: number | null;
  is_verified: boolean;
  alias_mode: boolean;
  success_count: number;
  success_stories: string | null;
  verification_stage: number;
  avatar_url: string | null;
  created_at: string;
};

export const VERIFICATION_STAGES: Array<{ n: number; label: string }> = [
  { n: 1, label: "فحص الشهادات" },
  { n: 2, label: "مراجع العملاء" },
  { n: 3, label: "جلسة عيّنة" },
  { n: 4, label: "مصادقة Verification Officer" },
];

export type SessionRow = {
  id: string;
  mentee_id: string;
  mentor_id: string;
  type: SessionType;
  status: SessionStatus;
  scheduled_time: string;
  created_at: string;
};

export type Review = {
  id: string;
  session_id: string;
  mentee_id: string;
  mentor_id: string;
  rating: number;
  comment: string;
  is_deletable: boolean;
  created_at: string;
};

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  cv_building: "كتابة السيرة الذاتية",
  interview_prep: "الاستعداد للمقابلات",
  career_mapping: "التخطيط المهني",
  industry_transition: "التحوّل المهني",
};

export const STATUS_LABELS: Record<SessionStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكدة",
  live: "جارية الآن",
  completed: "مكتملة",
  cancelled: "ملغاة",
  failed: "فشلت",
};

export const STATUS_COLORS: Record<SessionStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  live: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-200 text-slate-700",
  cancelled: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
};
