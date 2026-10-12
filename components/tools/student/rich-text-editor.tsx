'use client';

import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { downloadBlob } from '@/lib/download-utils';

export function RichTextEditorTool() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);

  const executeCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      updateCounts();
    }
  };

  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    setCharCount(text.length);
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    setWordCount(words);
  };

  const copyHtml = () => {
    if (!editorRef.current) return;
    navigator.clipboard.writeText(editorRef.current.innerHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (type: 'html' | 'txt') => {
    if (!editorRef.current) return;
    const content = type === 'html' ? editorRef.current.innerHTML : editorRef.current.innerText;
    const mime = type === 'html' ? 'text/html' : 'text/plain';
    const blob = new Blob([content], { type: mime });
    downloadBlob(blob, `document.${type}`);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 p-2.5">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => executeCmd('bold')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('italic')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('underline')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('strikeThrough')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <span className="h-4 w-[1px] bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCmd('formatBlock', '<h1>')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('formatBlock', '<h2>')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <span className="h-4 w-[1px] bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCmd('insertUnorderedList')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('insertOrderedList')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('formatBlock', '<blockquote>')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('formatBlock', '<pre>')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>

          <span className="h-4 w-[1px] bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCmd('justifyLeft')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyCenter')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyRight')}
            className="rounded p-1.5 text-gray-700 hover:bg-gray-200"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyHtml}
            className="inline-flex items-center gap-1 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied HTML' : 'Copy HTML'}
          </button>
          <button
            type="button"
            onClick={() => downloadFile('html')}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Export HTML
          </button>
        </div>
      </div>

      {/* Editable Document Canvas */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateCounts}
        className="min-h-[380px] w-full rounded-2xl border border-gray-300 bg-white p-6 text-sm leading-relaxed text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm prose max-w-none"
        dangerouslySetInnerHTML={{
          __html:
            '<h2>Z Lab Rich Text Notes</h2><p>Start typing or formatting your paper, assignment, or notes right here. Everything is stored and formatted strictly inside your browser memory.</p><ul><li>Zero cloud logging</li><li>Export to HTML or text</li></ul>',
        }}
      />

      {/* Metrics footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-2 font-medium">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-gray-800">{wordCount}</strong></span>
          <span>Characters: <strong className="text-gray-800">{charCount}</strong></span>
        </div>
        <button
          type="button"
          onClick={() => downloadFile('txt')}
          className="text-blue-600 hover:underline"
        >
          Download as plain text (.txt)
        </button>
      </div>
    </div>
  );
}
