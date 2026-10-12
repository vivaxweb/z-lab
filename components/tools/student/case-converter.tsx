'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CaseConverterTool() {
  const [text, setText] = useState<string>('privacy first client side utility toolbox');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  const toSentenceCase = (str: string) =>
    str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  const toCamelCase = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());

  const toSnakeCase = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');

  const toKebabCase = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');

  const toConstantCase = (str: string) =>
    str
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');

  const toAlternatingCase = (str: string) =>
    str
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');

  const cases = [
    { key: 'upper', label: 'UPPERCASE', value: text.toUpperCase() },
    { key: 'lower', label: 'lowercase', value: text.toLowerCase() },
    { key: 'title', label: 'Title Case', value: toTitleCase(text) },
    { key: 'sentence', label: 'Sentence case', value: toSentenceCase(text) },
    { key: 'camel', label: 'camelCase', value: toCamelCase(text) },
    { key: 'snake', label: 'snake_case', value: toSnakeCase(text) },
    { key: 'kebab', label: 'kebab-case', value: toKebabCase(text) },
    { key: 'constant', label: 'CONSTANT_CASE', value: toConstantCase(text) },
    { key: 'alternating', label: 'aLtErNaTiNg cAsE', value: toAlternatingCase(text) },
  ];

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          Input Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Type or paste text..."
          className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Case Options Grid */}
      <div className="space-y-3">
        {cases.map((c) => (
          <div
            key={c.key}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 hover:bg-gray-50 transition"
          >
            <div className="flex-1 overflow-hidden">
              <span className="text-xs font-semibold text-gray-400 block mb-0.5">{c.label}</span>
              <p className="font-mono text-sm text-gray-900 truncate select-all">{c.value || '...'}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(c.key, c.value)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-600 shadow-sm flex-shrink-0"
            >
              {copiedKey === c.key ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
