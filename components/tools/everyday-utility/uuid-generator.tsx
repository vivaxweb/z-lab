'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

function buildUuids(cnt: number, upper: boolean, hyph: boolean, brc: boolean): string[] {
  const list: string[] = [];
  for (let i = 0; i < cnt; i++) {
    let id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    if (!hyph) id = id.replace(/-/g, '');
    if (upper) id = id.toUpperCase();
    if (brc) id = `{${id}}`;
    list.push(id);
  }
  return list;
}

export function UuidGeneratorTool() {
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [braces, setBraces] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>(() => buildUuids(5, false, true, false));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const regenerate = useCallback(
    (cnt = count, upper = uppercase, hyph = hyphens, brc = braces) => {
      setUuids(buildUuids(cnt, upper, hyph, brc));
      setCopiedAll(false);
    },
    [count, uppercase, hyphens, braces]
  );

  const copySingle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
          <select
            value={count}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCount(val);
              regenerate(val);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm outline-none"
          >
            <option value={1}>1 UUID</option>
            <option value={5}>5 UUIDs</option>
            <option value={10}>10 UUIDs</option>
            <option value={25}>25 UUIDs</option>
            <option value={50}>50 UUIDs</option>
            <option value={100}>100 UUIDs</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-5 sm:pt-6">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => {
                setUppercase(e.target.checked);
                regenerate(count, e.target.checked);
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Uppercase
          </label>
        </div>

        <div className="flex items-center gap-2 pt-5 sm:pt-6">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => {
                setHyphens(e.target.checked);
                regenerate(count, uppercase, e.target.checked);
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Include Hyphens
          </label>
        </div>

        <div className="flex items-center gap-2 pt-5 sm:pt-6">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={braces}
              onChange={(e) => {
                setBraces(e.target.checked);
                regenerate(count, uppercase, hyphens, e.target.checked);
              }}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Add Braces {"{}"}
          </label>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => regenerate()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className="h-4 w-4" /> Regenerate
        </button>

        <button
          type="button"
          onClick={copyAll}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm"
        >
          {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiedAll ? 'Copied All!' : 'Copy All'}
        </button>
      </div>

      {/* UUID list */}
      <div className="space-y-2">
        {uuids.map((id, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:border-blue-300 transition"
          >
            <span className="font-mono text-sm text-gray-800 select-all">{id}</span>
            <button
              type="button"
              onClick={() => copySingle(id, index)}
              className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
              title="Copy this UUID"
            >
              {copiedIndex === index ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
