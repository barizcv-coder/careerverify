import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "CareerVerify | منصة الإرشاد المهني الموثّقة",
  description:
    "CareerVerify — Verified · Transparent · Accountable. أول منصة إرشاد مهني في السعودية يُوثَّق فيها كل مرشد وتُسجَّل فيها كل مراجعة بشكل دائم.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
            <strong className="text-brand-900">CareerVerify</strong> — مشروع
            طلابي · الجامعة الإسلامية بالمدينة المنورة · CCS 3382 Software
            Engineering
          </div>
        </footer>
      </body>
    </html>
  );
}
