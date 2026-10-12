'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';

export interface FileDropzoneProps {
  /** Called when the user selects/drops valid file(s). */
  onFilesSelected: (files: File[]) => void;
  /** MIME types or extensions to accept, e.g. 'image/*' or '.pdf'. */
  accept?: string;
  /** Allow selecting multiple files (default: false). */
  multiple?: boolean;
  /** Max file size in bytes (default: no limit). */
  maxSizeBytes?: number;
  /** Human-readable size limit shown in the UI, e.g. '10 MB'. */
  maxSizeLabel?: string;
  /** Custom label shown in the drop zone. */
  label?: string;
  /** Whether the dropzone is disabled. */
  disabled?: boolean;
}

/**
 * Modern MindMate styled drag-and-drop / click-to-upload file input component.
 * Works smoothly across desktop and mobile devices.
 */
export function FileDropzone({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeBytes,
  maxSizeLabel,
  label,
  disabled = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (files: File[]): File[] => {
      setError(null);
      if (maxSizeBytes) {
        const oversized = files.filter((f) => f.size > maxSizeBytes);
        if (oversized.length > 0) {
          const limit = maxSizeLabel ?? `${(maxSizeBytes / 1024 / 1024).toFixed(0)} MB`;
          setError(`File too large. Maximum allowed size is ${limit}.`);
          return [];
        }
      }
      return files;
    },
    [maxSizeBytes, maxSizeLabel]
  );

  const handleFiles = useCallback(
    (rawFiles: FileList | null) => {
      if (!rawFiles || rawFiles.length === 0) return;
      const arr = Array.from(rawFiles);
      const valid = validate(arr);
      if (valid.length > 0) onFilesSelected(valid);
    },
    [validate, onFilesSelected]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const zoneClasses = [
    'flex flex-col items-center justify-center gap-3',
    'rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center',
    'cursor-pointer transition-all duration-200',
    isDraggingOver
      ? 'border-purple-400 bg-[#EFE5F7] scale-[0.99]'
      : 'border-purple-200/80 bg-[#FAF7FD] hover:border-purple-300 hover:bg-[#F5EDFA]',
    disabled ? 'pointer-events-none opacity-50' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
        aria-label="File upload"
      />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        className={zoneClasses}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled)
            inputRef.current?.click();
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Soft pastel icon badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-purple-600 transition-transform group-hover:scale-105">
          <UploadCloud className="h-7 w-7" />
        </div>

        <div className="space-y-1.5 max-w-sm">
          <p className="text-sm font-bold text-[#1E1B24]">
            {label ?? (
              <>
                <span className="text-purple-700 underline decoration-purple-300 underline-offset-4">Click to select file</span> or drag & drop here
              </>
            )}
          </p>
          {accept && (
            <p className="text-xs font-medium text-neutral-400">
              Supports: {accept}
              {maxSizeLabel ? ` · Up to ${maxSizeLabel}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Validation error */}
      {error && (
        <div role="alert" className="mt-3 flex items-center gap-2 rounded-2xl bg-red-50 p-3 text-xs font-bold text-red-700 border border-red-100">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
