import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Sparkles,
  Search,
  Eye,
  Calendar,
  Star,
  GraduationCap,
  Trophy,
  Repeat,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span dir="ltr">CareerVerify</span>
            <span>— أول منصة إرشاد مهني موثّقة في السعودية</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-brand-900 leading-tight mb-5">
            اختر مرشدك المهني <br className="hidden sm:block" />
            <span className="text-accent-600">بثقة كاملة، لا بحدس</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-3">
            كل مرشد في <strong>CareerVerify</strong> مُوثّق رسمياً قبل ظهوره،
            وكل مراجعة تبقى للأبد — لا تُحذف، لا تُعدّل، ولا تُخفى.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Verified · Transparent · Accountable
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/mentors"
              className="px-6 py-3 rounded-lg bg-brand-800 text-white hover:bg-brand-700 transition font-semibold shadow-sm"
            >
              تصفّح المرشدين الموثّقين
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-800 hover:border-brand-600 hover:text-brand-800 transition font-semibold"
            >
              أنشئ حسابك مجاناً
            </Link>
          </div>
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <Stat value="82%" label="من الخريجين يفتقدون دليل نجاح للمرشد" />
          <Stat value="260K+" label="مستخدم مستهدف سنوياً في السعودية" />
          <Stat value="SAR 200M+" label="حجم السوق المقدّر (2026)" />
          <Stat value="0" label="منافس موثّق حالياً في السوق" />
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-brand-900 mb-3">
            المشكلة: الإرشاد المهني بلا محاسبة
          </h2>
          <p className="text-slate-600">
            أي شخص يقدر يسمّي نفسه "مرشد مهني" — بلا أي تحقّق، بلا أي رقابة،
            وبلا أي عواقب على التضليل.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <ProblemCard
            icon={X}
            title="صفر توثيق للمؤهلات"
            text="لا توجد جهة تتحقق من شهادات وخبرات المرشد قبل ما يبدأ يأخذ فلوس العملاء."
          />
          <ProblemCard
            icon={AlertTriangle}
            title="مراجعات مُلاعَب بها"
            text="المرشدون على LinkedIn والسوشل ميديا يحذفون المراجعات السلبية ويبنون سمعة وهمية."
          />
          <ProblemCard
            icon={X}
            title="لا تتبّع للنتائج"
            text="ما عندك طريقة تشوف وين وظّف المرشد عملاءه السابقين — لا ملف نجاح، لا سجل، لا محاسبة."
          />
        </div>
      </section>

      {/* ============ SOLUTION — 4-STEP JOURNEY ============ */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-brand-900 mb-3">
              الحل: رحلة من 4 خطوات
            </h2>
            <p className="text-slate-600">
              من الثقة غير الرسمية إلى المحاسبة المهنية القائمة على الأدلة.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <JourneyStep
              num={1}
              icon={Search}
              title="اكتشف"
              text="فلتر حسب التخصص الدقيق: سيرة ذاتية، مقابلات، تخطيط مهني، تحوّل مهني، إنجليزية مهنية."
            />
            <JourneyStep
              num={2}
              icon={Eye}
              title="قيّم"
              text="شوف شهادات المرشد الموثّقة + ملف نجاحات عملائه السابقين."
            />
            <JourneyStep
              num={3}
              icon={Calendar}
              title="احجز والتقِ"
              text="احجز واحضر جلسة 1-on-1 بأمان عبر المنصة."
            />
            <JourneyStep
              num={4}
              icon={Star}
              title="قيّم وسجّل"
              text="مراجعتك مُسجّلة للأبد — المرشد لا يقدر يحذفها ولا يعدّلها."
            />
          </div>
        </div>
      </section>

      {/* ============ CORE GUARANTEES ============ */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-brand-900 mb-3">
            الضمانات الأساسية
          </h2>
          <p className="text-slate-600">
            أربعة التزامات تقنية ومُعلَنة — لا تُباع بباقة، لا تُعطَّل بضغط.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <GuaranteeCard
            icon={Lock}
            color="bg-accent-600"
            title="مراجعات غير قابلة للحذف"
            text="كل مراجعة تُختَم بالوقت وتُقفَل عند الإرسال. حتى الأدمن ما يقدر يحذفها — القاعدة مفروضة على مستوى قاعدة البيانات، لا على مستوى التطبيق."
          />
          <GuaranteeCard
            icon={ShieldCheck}
            color="bg-brand-800"
            title="شارة التوثيق متعددة المراحل"
            text="كل مرشد يمر بـ: (1) فحص الشهادات، (2) مراجع عملاء سابقين، (3) جلسة عيّنة، (4) مصادقة Verification Officer قبل ما تظهر الشارة."
          />
          <GuaranteeCard
            icon={Trophy}
            color="bg-amber-600"
            title="Success Portfolio عام"
            text="كل مرشد يعرض سجل نجاحاته: أين وظّف طلابه، كم عميل نجح، ومتى — سجل دائم يتراكم مع الوقت."
          />
          <GuaranteeCard
            icon={Sparkles}
            color="bg-brand-600"
            title="فلترة دقيقة بالتخصص"
            text="ما فيه 'مرشد عام' — كل مرشد متخصص بمجال واحد محدد (سيرة، مقابلات، تخطيط، تحوّل) ومُقيَّم فيه."
          />
        </div>
      </section>

      {/* ============ PERSONAS ============ */}
      <section className="bg-brand-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold mb-3">
              لمَن CareerVerify؟
            </h2>
            <p className="text-brand-100">
              ثلاث شخصيات رئيسية في سوق عمل السعودية 2026.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <PersonaCard
              icon={GraduationCap}
              title="الخريج التائه"
              need="تخطيط مهني"
              price="~150 ﷼ / جلسة"
              size="~80,000 خريج سنوياً"
            />
            <PersonaCard
              icon={Trophy}
              title="المتقدّم التنافسي"
              need="تمارين مقابلات + سيرة ذاتية"
              price="200 – 250 ﷼ / جلسة"
              size="~120,000 متقدّم سنوياً"
            />
            <PersonaCard
              icon={Repeat}
              title="المُغيّر المهني"
              need="إرشاد التحوّل الصناعي"
              price="250 – 300 ﷼ / جلسة"
              size="~60,000 محترف سنوياً"
            />
          </div>
        </div>
      </section>

      {/* ============ COMPETITIVE TABLE ============ */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-brand-900 mb-3">
            لماذا CareerVerify؟
          </h2>
          <p className="text-slate-600">
            قارن ما نقدمه مع المنافسين الحاليين.
          </p>
        </div>

        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="text-right p-4 font-bold text-slate-900">الميزة</th>
                <th className="p-4 font-bold text-brand-800 bg-brand-50">
                  <span dir="ltr">CareerVerify</span>
                </th>
                <th className="p-4 font-medium text-slate-600">LinkedIn</th>
                <th className="p-4 font-medium text-slate-600">Labayh</th>
                <th className="p-4 font-medium text-slate-600">السوشل ميديا</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow
                feature="توثيق الشهادات"
                us="إلزامي"
                linkedin="❌"
                labayh="صحة نفسية فقط"
                social="❌"
              />
              <CompareRow
                feature="مراجعات غير قابلة للحذف"
                us="نعم"
                linkedin="❌"
                labayh="—"
                social="❌"
              />
              <CompareRow
                feature="Success Portfolio"
                us="سجل كامل"
                linkedin="❌"
                labayh="❌"
                social="❌"
              />
              <CompareRow
                feature="تركيز مهني 100%"
                us="نعم"
                linkedin="شبكة عامة"
                labayh="❌"
                social="غير رسمي"
              />
              <CompareRow
                feature="فلترة بالتخصص"
                us="متقدّمة"
                linkedin="بحث أساسي"
                labayh="❌"
                social="❌"
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-gradient-to-l from-brand-800 to-brand-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            ابدأ رحلتك المهنية بثقة
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
            انضم لأكثر من 200 خريج استفادوا من جلسات مع مرشدين موثّقين عبر{" "}
            <span dir="ltr">CareerVerify</span>.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/signup"
              className="px-7 py-3 rounded-lg bg-white text-brand-800 hover:bg-brand-50 transition font-bold"
            >
              أنشئ حسابك الآن
            </Link>
            <Link
              href="/mentors"
              className="px-7 py-3 rounded-lg border-2 border-white/70 text-white hover:bg-white/10 transition font-bold"
            >
              اكتشف المرشدين
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============ Sub-components ============ */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="text-2xl sm:text-3xl font-extrabold text-brand-800 mb-1"
        dir="ltr"
      >
        {value}
      </div>
      <div className="text-xs sm:text-sm text-slate-600 leading-tight">
        {label}
      </div>
    </div>
  );
}

function ProblemCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-6 hover:shadow-sm transition">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600 mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function JourneyStep({
  num,
  icon: Icon,
  title,
  text,
}: {
  num: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 relative">
      <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm">
        {num}
      </div>
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700 mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function GuaranteeCard({
  icon: Icon,
  color,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${color} text-white mb-4`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function PersonaCard({
  icon: Icon,
  title,
  need,
  price,
  size,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  need: string;
  price: string;
  size: string;
}) {
  return (
    <div className="bg-brand-800/40 border border-brand-700 rounded-xl p-6 backdrop-blur">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      <dl className="text-sm space-y-2 text-brand-100">
        <div className="flex justify-between gap-2">
          <dt className="opacity-75">الحاجة:</dt>
          <dd className="text-left font-medium text-white">{need}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="opacity-75">السعر:</dt>
          <dd className="text-left font-medium text-white" dir="ltr">
            {price}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="opacity-75">الحجم:</dt>
          <dd className="text-left font-medium text-white">{size}</dd>
        </div>
      </dl>
    </div>
  );
}

function CompareRow({
  feature,
  us,
  linkedin,
  labayh,
  social,
}: {
  feature: string;
  us: string;
  linkedin: string;
  labayh: string;
  social: string;
}) {
  return (
    <tr className="border-b border-slate-200 last:border-0">
      <td className="p-4 font-medium text-slate-900">{feature}</td>
      <td className="p-4 text-center bg-brand-50 text-accent-700 font-bold">
        <div className="inline-flex items-center gap-1">
          <Check className="h-4 w-4" />
          {us}
        </div>
      </td>
      <td className="p-4 text-center text-slate-600">{linkedin}</td>
      <td className="p-4 text-center text-slate-600">{labayh}</td>
      <td className="p-4 text-center text-slate-600">{social}</td>
    </tr>
  );
}
