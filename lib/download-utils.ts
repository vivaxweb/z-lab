/**
 * Z Lab — Download Utilities
 * Generic helpers for triggering Blob downloads in the browser without any
 * server round-trip. Always call revokeObjectUrl() after the download is
 * initiated to avoid memory leaks.
 */

/**
 * Trigger a file download from a Blob.
 * @param blob   The blob to download.
 * @param filename  Suggested download filename.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Revoke after a short delay to allow the browser to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Trigger a download from a raw Uint8Array (useful for pdf-lib output).
 * @param bytes     The byte array to download.
 * @param filename  Suggested download filename.
 * @param mimeType  MIME type of the file (default: 'application/octet-stream').
 */
export function downloadBytes(
  bytes: Uint8Array,
  filename: string,
  mimeType = 'application/octet-stream'
): void {
  const blob = new Blob([bytes as BlobPart], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Trigger a download from a data URL string (e.g. canvas.toDataURL()).
 * @param dataUrl   The base64 data URL.
 * @param filename  Suggested download filename.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

/**
 * Convert a File or Blob to an ArrayBuffer for use with pdf-lib / Web Crypto.
 */
export async function fileToArrayBuffer(file: File | Blob): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

/**
 * Convert a File or Blob to a base64 data URL.
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}
