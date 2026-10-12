'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, Download, RefreshCw } from 'lucide-react';
import { downloadBlob } from '@/lib/download-utils';

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Riley', 'Morgan', 'Avery', 'Casey', 'Kai', 'Dakota', 'Rowan', 'Quinn', 'Harper', 'Eden', 'Emerson'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee'];
const CITIES = ['New York', 'Los Angeles', 'London', 'Tokyo', 'Berlin', 'Toronto', 'Sydney', 'Paris', 'Singapore', 'Amsterdam'];
const COUNTRIES = ['USA', 'UK', 'Japan', 'Germany', 'Canada', 'Australia', 'France', 'Singapore', 'Netherlands'];
const ROLES = ['Developer', 'Designer', 'Product Manager', 'Data Analyst', 'Founder', 'Marketing Lead', 'Student'];

function generateMockData(cnt: number, fmt: 'json' | 'csv'): string {
  const records = [];
  for (let i = 0; i < cnt; i++) {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const role = ROLES[Math.floor(Math.random() * ROLES.length)];
    const username = `${first.toLowerCase()}_${last.toLowerCase()}${Math.floor(Math.random() * 90 + 10)}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);

    records.push({
      id,
      name: `${first} ${last}`,
      username,
      email,
      role,
      city,
      country,
    });
  }

  if (fmt === 'json') {
    return JSON.stringify(records, null, 2);
  } else {
    const headers = ['id', 'name', 'username', 'email', 'role', 'city', 'country'];
    const rows = records.map((r) =>
      [r.id, `"${r.name}"`, r.username, r.email, `"${r.role}"`, `"${r.city}"`, `"${r.country}"`].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }
}

export function RandomDataGeneratorTool() {
  const [count, setCount] = useState<number>(5);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [output, setOutput] = useState<string>(() => generateMockData(5, 'json'));
  const [copied, setCopied] = useState<boolean>(false);

  const regenerate = useCallback(
    (cnt = count, fmt = format) => {
      setOutput(generateMockData(cnt, fmt));
      setCopied(false);
    },
    [count, format]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([output], { type: mime });
    downloadBlob(blob, `random_mock_data.${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
            <select
              value={count}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCount(val);
                regenerate(val);
              }}
              className="rounded-lg border border-gray-300 bg-white p-2 text-sm outline-none"
            >
              <option value={5}>5 records</option>
              <option value={10}>10 records</option>
              <option value={25}>25 records</option>
              <option value={50}>50 records</option>
              <option value={100}>100 records</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Format</label>
            <div className="flex rounded-lg bg-gray-200 p-0.5">
              <button
                type="button"
                onClick={() => {
                  setFormat('json');
                  regenerate(count, 'json');
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  format === 'json' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormat('csv');
                  regenerate(count, 'csv');
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  format === 'csv' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                CSV
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => regenerate()}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-roll
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-300"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>
      </div>

      {/* Output Preview */}
      <textarea
        value={output}
        readOnly
        rows={12}
        className="w-full rounded-xl border border-gray-200 bg-gray-900 p-4 font-mono text-xs text-green-400 outline-none select-all"
      />
    </div>
  );
}
