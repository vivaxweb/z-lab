import { notFound } from 'next/navigation';
import { toolsRegistry, getToolBySlug } from '@/lib/tools-registry';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ToolRenderer } from '@/components/tools/ToolRenderer';
import type { Metadata } from 'next';

// ── Static Site Generation ────────────────────────────────────────────────────
// Tell Next.js to pre-render a static page for every tool at build time.
export function generateStaticParams() {
  return toolsRegistry.map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: `${tool.title} — Z Lab`,
    description: tool.shortDescription,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.title} — Z Lab`,
      description: tool.shortDescription,
      type: 'website',
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) notFound();

  return (
    <ToolPageTemplate
      tool={tool}
      seoContent={
        <div>
          <h2>About {tool.title}</h2>
          <p>
            {tool.title} is a free, privacy-first browser tool that runs entirely on your
            device. No files are ever uploaded to any server — all processing happens locally
            using modern browser APIs.
          </p>
          <h3>How it works</h3>
          <p>
            Simply upload your file, adjust the settings, and click the process button. Your
            result will be ready to download instantly — no account, no waiting, no data
            leaving your device.
          </p>
          <h3>Is it really private?</h3>
          <p>
            Yes. Z Lab tools use only browser-native APIs (Canvas API, Web Crypto API,
            pdf-lib). There is no backend, no server, and no analytics on the files you
            process. Your data stays yours.
          </p>
        </div>
      }
    >
      <ToolRenderer tool={tool} />
    </ToolPageTemplate>
  );
}
