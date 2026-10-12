'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';

interface HashResults {
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

export function HashGeneratorTool() {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState<string>('Hello Z Lab');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hashes, setHashes] = useState<HashResults>({
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const bufferToHex = (buffer: ArrayBuffer, upper: boolean): string => {
    const bytes = new Uint8Array(buffer);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return upper ? hex.toUpperCase() : hex.toLowerCase();
  };

  useEffect(() => {
    let canceled = false;

    // Small debounce & deferred microtask to avoid blocking UI and cascading render
    const timer = setTimeout(async () => {
      try {
        let dataBuffer: ArrayBuffer;
        if (activeTab === 'text') {
          const encoder = new TextEncoder();
          dataBuffer = encoder.encode(textInput).buffer as ArrayBuffer;
        } else if (selectedFile) {
          dataBuffer = await selectedFile.arrayBuffer();
        } else {
          return;
        }

        if (canceled) return;
        setIsProcessing(true);

        const [sha1Buf, sha256Buf, sha384Buf, sha512Buf] = await Promise.all([
          crypto.subtle.digest('SHA-1', dataBuffer),
          crypto.subtle.digest('SHA-256', dataBuffer),
          crypto.subtle.digest('SHA-384', dataBuffer),
          crypto.subtle.digest('SHA-512', dataBuffer),
        ]);

        if (!canceled) {
          setHashes({
            sha1: bufferToHex(sha1Buf, uppercase),
            sha256: bufferToHex(sha256Buf, uppercase),
            sha384: bufferToHex(sha384Buf, uppercase),
            sha512: bufferToHex(sha512Buf, uppercase),
          });
        }
      } catch (err) {
        console.error('Error computing hashes', err);
      } finally {
        if (!canceled) setIsProcessing(false);
      }
    }, 50);

    return () => {
      canceled = true;
      clearTimeout(timer);
    };
  }, [activeTab, textInput, selectedFile, uppercase]);

  const copyToClipboard = (key: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 ${
            activeTab === 'text'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Text Input
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 ${
            activeTab === 'file'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          File Checksum
        </button>
      </div>

      {/* Input Section */}
      {activeTab === 'text' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text String</label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={4}
            placeholder="Type or paste text here to compute hash..."
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono outline-none"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <FileDropzone
            onFilesSelected={(files) => {
              if (files.length > 0) setSelectedFile(files[0]);
            }}
            label="Drop any file here or click to compute cryptographic checksum"
          />
          {selectedFile && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-gray-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Uppercase Hex Output
        </label>
        {isProcessing && <span className="text-xs text-blue-600 animate-pulse">Computing hash...</span>}
      </div>

      {/* Hash Outputs */}
      <div className="space-y-3">
        {(['sha256', 'sha512', 'sha384', 'sha1'] as const).map((algo) => {
          const value = hashes[algo];
          return (
            <div key={algo} className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <span>{algo.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(algo, value)}
                  disabled={!value}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {copiedKey === algo ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-gray-800 break-all select-all">
                {value || 'Enter text or select a file'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
