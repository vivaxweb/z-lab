'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Bold, Italic, Heading1, Heading2, Code, Quote, List } from 'lucide-react';
import { downloadBlob } from '@/lib/download-utils';

const DEFAULT_MARKDOWN = `# Welcome to Z Lab Markdown

Z Lab gives you a **privacy-first** toolkit that runs entirely in your browser.

## Features
- *Zero server uploads* — Your notes never leave your computer
- Realtime side-by-side preview
- Export directly to \`.md\` file

> "Privacy is not an afterthought; it is a fundamental architecture."

### Code Example
\`\`\`javascript
const privacyFirst = true;
console.log("No data transmitted!");
\`\`\`
`;

export function MarkdownPreviewerTool() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Lightweight client-side Markdown to HTML converter
  const renderedHtml = useMemo(() => {
    let html = markdown
      // Escape HTML entities to prevent XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-green-400 p-3 rounded-lg overflow-x-auto text-xs my-2 font-mono"><code>$1</code></pre>');

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-xs font-mono">$1</code>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2 text-gray-900">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-5 mb-2 text-gray-900 border-b pb-1">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold mt-6 mb-3 text-gray-900 border-b pb-1">$1</h1>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-3 italic text-gray-600 my-2">$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

    // Unordered lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-gray-700">$1</li>');

    // Paragraphs / line breaks
    html = html.replace(/\n\n/g, '<p class="my-2 text-gray-700 leading-relaxed"></p>');
    html = html.replace(/\n/g, '<br />');

    return html;
  }, [markdown]);

  const insertSnippet = (before: string, after: string = '') => {
    setMarkdown((prev) => `${prev}\n${before}${after}`);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    downloadBlob(blob, 'document.md');
  };

  return (
    <div className="space-y-4">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertSnippet('**Bold Text**')}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('*Italic Text*')}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('# Heading 1')}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('## Heading 2')}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('```\ncode block\n```')}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('> Quote here')}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('- List item')}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-1 rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            {copiedHtml ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedHtml ? 'Copied HTML' : 'Copy HTML'}
          </button>
          <button
            type="button"
            onClick={handleDownloadMd}
            className="inline-flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Download .md
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Markdown Source */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Markdown Source
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={15}
            className="w-full rounded-xl border border-gray-300 p-3 font-mono text-xs leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
          />
        </div>

        {/* Live Preview */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Live Preview
          </label>
          <div
            className="h-[305px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-inner"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>
    </div>
  );
}
