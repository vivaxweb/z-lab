'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft } from 'lucide-react';

export function UrlEncoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [type, setType] = useState<'component' | 'full'>('component');
  const [input, setInput] = useState<string>('https://example.com/search?q=z lab&tag=privacy#top');
  const [copied, setCopied] = useState<boolean>(false);
  const { output, error } = React.useMemo(() => {
    try {
      const out =
        mode === 'encode'
          ? type === 'component'
            ? encodeURIComponent(input)
            : encodeURI(input)
          : type === 'component'
          ? decodeURIComponent(input)
          : decodeURI(input);
      return { output: out, error: null };
    } catch {
      return {
        output: '',
        error: mode === 'decode' ? 'Malformed URI sequence in input.' : 'Encoding failed.',
      };
    }
  }, [input, mode, type]);

  const handleSwap = () => {
    setInput(output);
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
              mode === 'encode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
              mode === 'decode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Decode
          </button>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setType('component')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              type === 'component' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Query Component (encodeURIComponent)
          </button>
          <button
            type="button"
            onClick={() => setType('full')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              type === 'full' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Full URL (encodeURI)
          </button>
        </div>
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            {mode === 'encode' ? 'Original String' : 'Encoded String'}
          </label>
          <button
            type="button"
            onClick={handleSwap}
            disabled={!output}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" /> Swap Values
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          placeholder="Enter text or URL..."
          className="w-full rounded-xl border border-gray-300 p-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
          </label>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Result
              </>
            )}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          rows={4}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-mono text-gray-800 outline-none select-all"
        />
      </div>
    </div>
  );
}
