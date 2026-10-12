'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, BookOpen } from 'lucide-react';

type CitationStyle = 'mla' | 'apa' | 'chicago';
type SourceType = 'website' | 'book' | 'journal';

export function CitationGeneratorTool() {
  const [style, setStyle] = useState<CitationStyle>('mla');
  const [sourceType, setSourceType] = useState<SourceType>('website');

  // Input Fields
  const [authorLast, setAuthorLast] = useState<string>('Smith');
  const [authorFirst, setAuthorFirst] = useState<string>('John');
  const [title, setTitle] = useState<string>('The Future of Client-Side Privacy');
  const [container, setContainer] = useState<string>('Digital Tech Review');
  const [publisher, setPublisher] = useState<string>('Tech Press');
  const [year, setYear] = useState<string>('2025');
  const [url, setUrl] = useState<string>('https://example.com/privacy-article');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedInText, setCopiedInText] = useState<boolean>(false);

  // Generate bibliography citation
  const { formattedText, inTextCitation } = useMemo(() => {
    const hasAuthor = authorLast.trim() || authorFirst.trim();
    const authorMLA = hasAuthor ? `${authorLast}${authorFirst ? ', ' + authorFirst : ''}.` : '';
    const authorAPA = hasAuthor ? `${authorLast}${authorFirst ? ', ' + authorFirst.charAt(0) + '.' : ''}` : '';
    const authorChicago = hasAuthor ? `${authorLast}${authorFirst ? ', ' + authorFirst : ''}.` : '';

    let bib = '';
    let inText = '';

    if (style === 'mla') {
      // MLA 9th Edition: Author. "Title of Source." Title of Container, Publisher, Date, Location.
      if (sourceType === 'book') {
        bib = `${authorMLA} ${title}. ${publisher ? publisher + ', ' : ''}${year}.`.trim();
      } else {
        bib = `${authorMLA} "${title}." ${container}, ${publisher ? publisher + ', ' : ''}${year}, ${url}.`.trim();
      }
      inText = hasAuthor ? `(${authorLast})` : `("${title.slice(0, 20)}...")`;
    } else if (style === 'apa') {
      // APA 7th Edition: Author, A. A. (Year). Title. Site Name. URL
      if (sourceType === 'book') {
        bib = `${authorAPA} (${year}). ${title}. ${publisher}.`.trim();
      } else {
        bib = `${authorAPA} (${year}). ${title}. ${container}. ${url}`.trim();
      }
      inText = hasAuthor ? `(${authorLast}, ${year})` : `("${title.slice(0, 20)}...", ${year})`;
    } else {
      // Chicago 17th Edition: Author. Year. "Title." Container. URL.
      if (sourceType === 'book') {
        bib = `${authorChicago} ${title}. ${publisher ? publisher + ', ' : ''}${year}.`.trim();
      } else {
        bib = `${authorChicago} "${title}." ${container} (${year}). ${url}.`.trim();
      }
      inText = hasAuthor ? `(${authorLast} ${year})` : `(${year})`;
    }

    return { formattedText: bib, inTextCitation: inText };
  }, [style, sourceType, authorLast, authorFirst, title, container, publisher, year, url]);

  const handleCopy = (text: string, isInText: boolean) => {
    navigator.clipboard.writeText(text);
    if (isInText) {
      setCopiedInText(true);
      setTimeout(() => setCopiedInText(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Style & Type selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setStyle('mla')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              style === 'mla' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            MLA 9 (US)
          </button>
          <button
            type="button"
            onClick={() => setStyle('apa')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              style === 'apa' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            APA 7
          </button>
          <button
            type="button"
            onClick={() => setStyle('chicago')}
            className={`rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              style === 'chicago' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Chicago 17 (US)
          </button>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          {(['website', 'book', 'journal'] as SourceType[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSourceType(st)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                sourceType === st ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Author Last Name</label>
          <input
            type="text"
            value={authorLast}
            onChange={(e) => setAuthorLast(e.target.value)}
            placeholder="e.g. Smith"
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Author First Name</label>
          <input
            type="text"
            value={authorFirst}
            onChange={(e) => setAuthorFirst(e.target.value)}
            placeholder="e.g. John"
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Title of Work / Article</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of webpage or article..."
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
          />
        </div>

        {sourceType === 'book' ? (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Publisher</label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="e.g. Oxford University Press"
              className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Website / Journal Name</label>
            <input
              type="text"
              value={container}
              onChange={(e) => setContainer(e.target.value)}
              placeholder="Website or journal name..."
              className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Year / Date</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2025"
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
          />
        </div>

        {sourceType !== 'book' && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL or DOI Link</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Generated Citations Output */}
      <div className="space-y-4">
        {/* Full Bibliography Entry */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Bibliography Reference ({style.toUpperCase()})
            </span>
            <button
              type="button"
              onClick={() => handleCopy(formattedText, false)}
              className="inline-flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Citation'}
            </button>
          </div>
          <p className="font-serif text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 select-all leading-relaxed">
            {formattedText}
          </p>
        </div>

        {/* In-Text Citation */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
              In-Text Citation Parenthetical
            </span>
            <button
              type="button"
              onClick={() => handleCopy(inTextCitation, true)}
              className="inline-flex items-center gap-1 rounded bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200"
            >
              {copiedInText ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedInText ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="font-mono text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 select-all">
            {inTextCitation}
          </p>
        </div>
      </div>
    </div>
  );
}
