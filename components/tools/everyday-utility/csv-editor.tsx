'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Download, Upload, Search } from 'lucide-react';
import { downloadBlob } from '@/lib/download-utils';

const DEFAULT_HEADERS = ['ID', 'Product', 'Category', 'Price', 'Stock'];
const DEFAULT_ROWS = [
  ['1', 'Wireless Mechanical Keyboard', 'Electronics', '$89.99', '42'],
  ['2', 'Noise Cancelling Headphones', 'Audio', '$149.50', '18'],
  ['3', 'Ergonomic Mousepad XL', 'Accessories', '$24.00', '120'],
  ['4', 'USB-C Fast Charging Hub', 'Electronics', '$39.99', '65'],
];

export function CsvEditorTool() {
  const [headers, setHeaders] = useState<string[]>(DEFAULT_HEADERS);
  const [rows, setRows] = useState<string[][]>(DEFAULT_ROWS);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [newColName, setNewColName] = useState<string>('');

  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    const parsedHeaders = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const parsedRows = lines.slice(1).map((line) => {
      return line.split(',').map((cell) => cell.trim().replace(/^["']|["']$/g, ''));
    });

    setHeaders(parsedHeaders);
    setRows(parsedRows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCsv(content);
    };
    reader.readAsText(file);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const updated = [...rows];
    updated[rowIndex] = [...updated[rowIndex]];
    updated[rowIndex][colIndex] = value;
    setRows(updated);
  };

  const updateHeader = (colIndex: number, value: string) => {
    const updated = [...headers];
    updated[colIndex] = value;
    setHeaders(updated);
  };

  const addRow = () => {
    const emptyRow = Array(headers.length).fill('');
    setRows([...rows, emptyRow]);
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== rowIndex));
  };

  const addColumn = () => {
    if (!newColName.trim()) return;
    setHeaders([...headers, newColName.trim()]);
    setRows(rows.map((r) => [...r, '']));
    setNewColName('');
  };

  const deleteColumn = (colIndex: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== colIndex));
    setRows(rows.map((r) => r.filter((_, i) => i !== colIndex)));
  };

  // Exports
  const exportCsv = () => {
    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n');
    downloadBlob(new Blob([csvContent], { type: 'text/csv' }), 'spreadsheet.csv');
  };

  const exportJson = () => {
    const jsonList = rows.map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });
    downloadBlob(new Blob([JSON.stringify(jsonList, null, 2)], { type: 'application/json' }), 'data.json');
  };

  const exportMarkdown = () => {
    const mdLines = [
      `| ${headers.join(' | ')} |`,
      `| ${headers.map(() => '---').join(' | ')} |`,
      ...rows.map((r) => `| ${r.join(' | ')} |`),
    ].join('\n');
    downloadBlob(new Blob([mdLines], { type: 'text/markdown' }), 'table.md');
  };

  const filteredRows = rows.filter((r) => {
    if (!filterQuery) return true;
    return r.some((cell) => cell.toLowerCase().includes(filterQuery.toLowerCase()));
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer">
            <Upload className="h-3.5 w-3.5" /> Import CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Row
          </button>

          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              placeholder="Col Name..."
              className="w-24 rounded-lg border border-gray-300 p-1.5 text-xs outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addColumn}
              disabled={!newColName.trim()}
              className="rounded-lg bg-gray-100 p-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              + Col
            </button>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            JSON
          </button>
          <button
            type="button"
            onClick={exportMarkdown}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            Markdown
          </button>
        </div>
      </div>

      {/* Search / Filter in Table */}
      <div className="flex items-center justify-between text-xs">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search rows in table..."
            className="w-full rounded-lg border border-gray-300 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-gray-500">
          Showing {filteredRows.length} of {rows.length} rows ({headers.length} columns)
        </span>
      </div>

      {/* Interactive Spreadsheet Grid */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-100/80 sticky top-0 border-b border-gray-200 text-gray-700 font-bold z-10">
              <tr>
                <th className="p-2 w-10 text-center border-r text-gray-400">#</th>
                {headers.map((head, colIdx) => (
                  <th key={colIdx} className="p-2 border-r min-w-[130px] group relative">
                    <input
                      type="text"
                      value={head}
                      onChange={(e) => updateHeader(colIdx, e.target.value)}
                      className="bg-transparent font-bold text-gray-800 outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => deleteColumn(colIdx)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-0.5"
                      title="Delete Column"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </th>
                ))}
                <th className="p-2 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {filteredRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-blue-50/40 transition">
                  <td className="p-2 text-center text-gray-400 font-sans border-r text-[10px]">
                    {rowIdx + 1}
                  </td>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-1 border-r">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className="w-full rounded p-1 bg-transparent text-gray-800 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 font-sans text-xs"
                      />
                    </td>
                  ))}
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRow(rowIdx)}
                      disabled={rows.length <= 1}
                      className="p-1 text-gray-300 hover:text-red-600 disabled:opacity-20"
                      title="Delete Row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
