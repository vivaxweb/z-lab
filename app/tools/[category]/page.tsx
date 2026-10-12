import Link from 'next/link';
import {
  CATEGORIES,
  CATEGORY_INFO,
  resolveCategory,
  getToolsByCategory,
  getToolBySlug,
} from '@/lib/tools-registry';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const resolved = resolveCategory(category);
  const info = CATEGORY_INFO[resolved];
  return {
    title: `${info.name} — Z Lab`,
    description: info.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const resolved = resolveCategory(category);
  const info = CATEGORY_INFO[resolved];
  const tools = getToolsByCategory(resolved);
  const featuredTool = getToolBySlug(info.featuredSlug);

  return (
    <main className="min-h-screen bg-mindmate-canvas py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* ── Breadcrumb & Back Link ───────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm text-neutral-700 hover:text-neutral-900 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Home</span>
              </Link>
            </li>
            <li aria-hidden="true" className="text-neutral-300">/</li>
            <li aria-current="page" className="font-bold text-neutral-800">
              {info.name}
            </li>
          </ol>
        </nav>

        {/* ── Category Header Card ─────────────────────────────────────────── */}
        <header className="mindmate-card p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-neutral-900 shadow-sm"
              style={{ backgroundColor: info.accentColor }}
            >
              {info.shortTitle} Hub
            </span>
            <span className="bg-neutral-100 text-xs font-bold px-3 py-1 rounded-full text-neutral-600">
              {tools.length} Tools
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1B24] tracking-tight">
            {info.name}
          </h1>

          <p className="text-sm sm:text-base font-bold text-neutral-500">
            {info.tagline}
          </p>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl font-medium">
            {info.description} All computations run privately inside browser memory without uploading any bytes to remote cloud servers.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-bold text-neutral-700">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 border border-emerald-200/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% In-Browser RAM
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-amber-800 border border-amber-200/60">
              <Zap className="h-3.5 w-3.5 text-amber-600" /> 0ms Server Lag
            </span>
          </div>
        </header>

        {/* ── Flagship Spotlight (Sunset Gradient Card from Screen 2) ──────── */}
        {featuredTool && (
          <section className="rounded-3xl bg-mindmate-sunset p-6 sm:p-7 shadow-sm text-[#1E1B24]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-black/60">
                  ★ Flagship Utility
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  {featuredTool.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-800 font-medium max-w-xl">
                  {featuredTool.shortDescription}
                </p>
              </div>

              <Link
                href={`/tools/${featuredTool.category}/${featuredTool.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-black text-neutral-900 shadow-sm hover:bg-neutral-50 transition shrink-0"
              >
                <span>Launch {featuredTool.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* ── Category Tools Grid ─────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
            <span>All {info.name} Utilities ({tools.length})</span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Client-Side Execution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.category}/${tool.slug}`}
                className="group relative flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(100,50,130,0.05)] border border-black/[0.04] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(100,50,130,0.09)] transition-all"
              >
                <div className="space-y-2">
                  <span
                    className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-neutral-900 shadow-sm"
                    style={{ backgroundColor: info.accentColor }}
                  >
                    {info.shortTitle}
                  </span>

                  <h3 className="text-base font-extrabold text-[#1E1B24] group-hover:text-purple-700 transition">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed line-clamp-2">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-400 group-hover:text-neutral-900 transition">
                  <span>Open tool</span>
                  <ArrowRight className="h-3.5 w-3.5 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
