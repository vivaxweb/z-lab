'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRightLeft, Download } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { downloadDataUrl } from '@/lib/download-utils';

export function Base64EncoderTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [subType, setSubType] = useState<'text' | 'file'>('text');
  const [inputVal, setInputVal] = useState<string>('Hello Z Lab!');
  const [fileOutput, setFileOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute text transformations synchronously via useMemo
  const { textOutput, textError } = useMemo(() => {
    if (subType !== 'text') return { textOutput: '', textError: null };
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputVal)));
        return { textOutput: encoded, textError: null };
      } else {
        const decoded = decodeURIComponent(escape(atob(inputVal)));
        return { textOutput: decoded, textError: null };
      }
    } catch {
      return {
        textOutput: '',
        textError: mode === 'decode' ? 'Invalid Base64 input string.' : 'Encoding error.',
      };
    }
  }, [inputVal, mode, subType]);

  const outputVal = subType === 'text' ? textOutput : fileOutput;
  const error = subType === 'text' ? textError : null;

  const handleSwap = () => {
    setInputVal(outputVal);
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFileOutput(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Mode & Type switchers */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              mode === 'encode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              mode === 'decode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Decode
          </button>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setSubType('text')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              subType === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => setSubType('file')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              subType === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            File to Base64
          </button>
        </div>
      </div>

      {subType === 'text' ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
              </label>
              <button
                type="button"
                onClick={handleSwap}
                disabled={!outputVal}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" /> Swap Input/Output
              </button>
            </div>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              rows={4}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter base64 to decode...'}
              className="w-full rounded-xl border border-gray-300 p-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                {mode === 'encode' ? 'Base64 Output' : 'Plain Text Output'}
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!outputVal}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Output
                  </>
                )}
              </button>
            </div>
            <textarea
              value={outputVal}
              readOnly
              rows={4}
              placeholder="Result will appear here..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-mono text-gray-800 outline-none select-all"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <FileDropzone
            onFilesSelected={handleFileUpload}
            label="Upload any file to convert directly into a Base64 Data URL"
          />
          {outputVal && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Base64 Data URL</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-800 hover:bg-gray-300"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadDataUrl(outputVal, 'exported-file')}
                    className="inline-flex items-center gap-1 rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              </div>
              <textarea
                value={outputVal}
                readOnly
                rows={5}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-mono text-gray-800 outline-none select-all break-all"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
