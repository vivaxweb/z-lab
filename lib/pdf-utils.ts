/**
 * Z Lab — PDF Utilities
 * Reusable wrappers for common PDF operations using pdf-lib.
 * All processing happens entirely in the browser; no file leaves the device.
 *
 * NOTE: pdf-lib is imported lazily (dynamic import) to avoid bloating the
 * initial JS bundle. It is only loaded when a user actually uses a PDF tool.
 */

export interface CompressPdfOptions {
  /** Quality 0.1 to 1.0 (default: 0.65) */
  quality?: number;
  /** Max dimension in pixels for embedded images (default: 1440) */
  maxImageDimension?: number;
  /** Compression preset level */
  level?: 'light' | 'balanced' | 'extreme';
}

export interface CompressPdfResult {
  bytes: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  imageCount: number;
  isSmaller: boolean;
}

export interface ImagesToPdfOptions {
  /** 'fit' = exact image dimensions; 'a4' = standard A4 paper size (595 x 842 pt) */
  pageSize?: 'fit' | 'a4';
  /** Page orientation for A4 mode */
  orientation?: 'auto' | 'portrait' | 'landscape';
}

/**
 * Merge multiple PDF files (as ArrayBuffers) into a single PDF Uint8Array.
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const merged = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const donor = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pages = await merged.copyPages(donor, donor.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save();
}

/**
 * Split a PDF into individual pages, returning an array of Uint8Arrays
 * (one per page).
 */
export async function splitPdf(pdfBuffer: ArrayBuffer): Promise<Uint8Array[]> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pageCount = src.getPageCount();
  const results: Uint8Array[] = [];

  for (let i = 0; i < pageCount; i++) {
    const single = await PDFDocument.create();
    const [page] = await single.copyPages(src, [i]);
    single.addPage(page);
    results.push(await single.save());
  }

  return results;
}

/**
 * Extract a specific page range (1-indexed, inclusive) from a PDF.
 * @param pdfBuffer  The source PDF buffer.
 * @param start      First page to include (1-indexed).
 * @param end        Last page to include (1-indexed).
 */
export async function extractPageRange(
  pdfBuffer: ArrayBuffer,
  start: number,
  end: number
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pageCount = src.getPageCount();

  const s = Math.max(0, start - 1);
  const e = Math.min(pageCount - 1, end - 1);
  const indices = Array.from({ length: e - s + 1 }, (_, i) => s + i);

  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

/**
 * Extract specific pages (1-indexed array, e.g. [1, 3, 5]) from a PDF.
 */
export async function extractSpecificPages(
  pdfBuffer: ArrayBuffer,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pageCount = src.getPageCount();

  // Deduplicate and clamp to valid range, convert to 0-indexed
  const validIndices = Array.from(new Set(pageNumbers))
    .filter((n) => n >= 1 && n <= pageCount)
    .map((n) => n - 1);

  if (validIndices.length === 0) {
    throw new Error('No valid page numbers provided.');
  }

  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, validIndices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

/**
 * Reorder pages in a PDF.
 * @param pdfBuffer   Source PDF buffer.
 * @param newOrder    Zero-indexed array specifying new page order.
 */
export async function reorderPdfPages(
  pdfBuffer: ArrayBuffer,
  newOrder: number[]
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, newOrder);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

/**
 * Helper to convert an image file or blob to baseline JPEG bytes using offscreen canvas.
 * This guarantees compatibility with pdf-lib embedJpg, eliminating errors from
 * WebP, AVIF, progressive JPEGs, or non-standard color formats.
 */
async function imageToStandardJpeg(file: File | Blob, quality = 0.9): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      // Fill white background to handle transparency
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Canvas export failed'));
            return;
          }
          const buf = await blob.arrayBuffer();
          resolve({
            bytes: new Uint8Array(buf),
            width: canvas.width,
            height: canvas.height,
          });
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file.'));
    };
    img.src = url;
  });
}

/**
 * Convert an array of image Blobs/Files (WebP, JPG, PNG, GIF, BMP) into a single PDF.
 */
export async function imagesToPdf(
  imageFiles: (File | Blob)[],
  options: ImagesToPdfOptions = {}
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();
  const pageSizeMode = options.pageSize ?? 'fit';

  // Standard A4 dimensions in points: 595.28 x 841.89
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const MARGIN = 36; // 0.5 inch margins

  for (const imgFile of imageFiles) {
    const { bytes, width: imgW, height: imgH } = await imageToStandardJpeg(imgFile, 0.9);
    const embeddedImage = await pdfDoc.embedJpg(bytes);

    if (pageSizeMode === 'a4') {
      const isLandscape =
        options.orientation === 'landscape' ||
        (options.orientation === 'auto' && imgW > imgH);

      const pageWidth = isLandscape ? A4_HEIGHT : A4_WIDTH;
      const pageHeight = isLandscape ? A4_WIDTH : A4_HEIGHT;

      const availW = pageWidth - MARGIN * 2;
      const availH = pageHeight - MARGIN * 2;

      // Fit image inside available page area preserving aspect ratio
      const scale = Math.min(availW / imgW, availH / imgH, 1.0);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const posX = (pageWidth - drawW) / 2;
      const posY = (pageHeight - drawH) / 2;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(embeddedImage, {
        x: posX,
        y: posY,
        width: drawW,
        height: drawH,
      });
    } else {
      // Fit to exact image dimensions
      const page = pdfDoc.addPage([imgW, imgH]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imgW,
        height: imgH,
      });
    }
  }

  return pdfDoc.save();
}

/**
 * Recompresses an embedded JPEG stream from a PDF using offscreen canvas in browser.
 */
async function recompressJpegBytes(
  jpegBytes: Uint8Array,
  quality: number,
  maxDimension: number
): Promise<{ newBytes: Uint8Array; width: number; height: number } | null> {
  if (typeof window === 'undefined') return null;

  try {
    const blob = new Blob([jpegBytes as BlobPart], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // continue without failing if image decoding fails
      img.src = url;
    });

    URL.revokeObjectURL(url);

    if (!img.naturalWidth || !img.naturalHeight) return null;

    let targetW = img.naturalWidth;
    let targetH = img.naturalHeight;

    if (maxDimension > 0 && (targetW > maxDimension || targetH > maxDimension)) {
      if (targetW > targetH) {
        targetH = Math.round((targetH * maxDimension) / targetW);
        targetW = maxDimension;
      } else {
        targetW = Math.round((targetW * maxDimension) / targetH);
        targetH = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const compressedBlob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, 'image/jpeg', quality)
    );

    if (!compressedBlob) return null;

    // Only accept if smaller than original
    if (compressedBlob.size < jpegBytes.length) {
      const buf = await compressedBlob.arrayBuffer();
      return {
        newBytes: new Uint8Array(buf),
        width: targetW,
        height: targetH,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Genuine client-side PDF compression:
 * 1. Scans and recompresses embedded JPEG images (the main cause of large PDF file size).
 * 2. Downsamples oversized images to display resolutions.
 * 3. Strips unneeded metadata and compacts PDF object streams.
 * 4. Ensures the resulting file size never increases beyond the original.
 */
export async function compressPdf(
  pdfBuffer: ArrayBuffer,
  options: CompressPdfOptions = {}
): Promise<CompressPdfResult> {
  const { PDFDocument, PDFName, PDFNumber } = await import('pdf-lib');
  const origSize = pdfBuffer.byteLength;

  let quality = options.quality ?? 0.65;
  let maxDim = options.maxImageDimension ?? 1440;

  if (options.level === 'extreme') {
    quality = 0.45;
    maxDim = 1000;
  } else if (options.level === 'light') {
    quality = 0.82;
    maxDim = 1920;
  }

  const doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });

  let imageCount = 0;
  let imagesCompressed = 0;

  // Process all indirect image objects
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dict = (obj as any).dict;
    if (dict && dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
      imageCount++;
      const filter = dict.get(PDFName.of('Filter'));

      // If it is a JPEG stream (DCTDecode)
      if (filter === PDFName.of('DCTDecode')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contents = (obj as any).contents as Uint8Array | undefined;
        if (contents && contents.length > 5000) { // only recompress images > 5KB
          const recompressed = await recompressJpegBytes(contents, quality, maxDim);
          if (recompressed) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (obj as any).contents = recompressed.newBytes;
            dict.set(PDFName.of('Length'), PDFNumber.of(recompressed.newBytes.length));
            dict.set(PDFName.of('Width'), PDFNumber.of(recompressed.width));
            dict.set(PDFName.of('Height'), PDFNumber.of(recompressed.height));
            imagesCompressed++;
          }
        }
      }
    }
  }

  // Strip non-essential document metadata to save bytes
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('Z Lab (Client-Side)');
  doc.setCreator('Z Lab');

  // Save with optimized object streams
  const compressedBytes = await doc.save({ useObjectStreams: true });

  // If the compressed bytes are somehow larger than original, return the original
  if (compressedBytes.length >= origSize) {
    return {
      bytes: new Uint8Array(pdfBuffer),
      originalSize: origSize,
      compressedSize: origSize,
      savedPercent: 0,
      imageCount,
      isSmaller: false,
    };
  }

  const savedPercent = Math.round(((origSize - compressedBytes.length) / origSize) * 100);

  return {
    bytes: compressedBytes,
    originalSize: origSize,
    compressedSize: compressedBytes.length,
    savedPercent,
    imageCount: imagesCompressed,
    isSmaller: true,
  };
}

/**
 * Get the page count of a PDF without loading all pages.
 */
export async function getPdfPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  return doc.getPageCount();
}

/**
 * Rotate pages of a PDF.
 * @param pdfBuffer The source PDF buffer.
 * @param rotations An array of angle increments in degrees (0, 90, 180, 270) indexed by page.
 */
export async function rotatePdfPages(
  pdfBuffer: ArrayBuffer,
  rotations: number[]
): Promise<Uint8Array> {
  const { PDFDocument, degrees } = await import('pdf-lib');
  const doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pages = doc.getPages();
  pages.forEach((page, index) => {
    const additional = rotations[index] || 0;
    if (additional !== 0) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + additional) % 360));
    }
  });
  return doc.save();
}
