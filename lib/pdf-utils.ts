/**
 * Z Lab — PDF Utilities
 * Reusable wrappers for common PDF operations using pdf-lib.
 * All processing happens entirely in the browser; no file leaves the device.
 *
 * NOTE: pdf-lib is imported lazily (dynamic import) to avoid bloating the
 * initial JS bundle. It is only loaded when a user actually uses a PDF tool.
 */

/**
 * Merge multiple PDF files (as ArrayBuffers) into a single PDF Uint8Array.
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const merged = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const donor = await PDFDocument.load(buffer);
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
  const src = await PDFDocument.load(pdfBuffer);
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
  const src = await PDFDocument.load(pdfBuffer);
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
 * Reorder pages in a PDF.
 * @param pdfBuffer   Source PDF buffer.
 * @param newOrder    Zero-indexed array specifying new page order.
 *                    e.g. [2, 0, 1] means: page 3 first, then page 1, then page 2.
 */
export async function reorderPdfPages(
  pdfBuffer: ArrayBuffer,
  newOrder: number[]
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(pdfBuffer);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, newOrder);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

/**
 * Convert an array of image Blobs/Files (JPEG or PNG) into a single PDF.
 * Each image becomes one page, sized to match the image dimensions.
 */
export async function imagesToPdf(imageFiles: (File | Blob)[]): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();

  for (const imgFile of imageFiles) {
    const buffer = await imgFile.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const mimeType = imgFile instanceof File ? imgFile.type : 'image/jpeg';

    let embeddedImage;
    if (mimeType === 'image/png') {
      embeddedImage = await pdfDoc.embedPng(bytes);
    } else {
      embeddedImage = await pdfDoc.embedJpg(bytes);
    }

    const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: embeddedImage.width,
      height: embeddedImage.height,
    });
  }

  return pdfDoc.save();
}

/**
 * Lightweight PDF "compression" via re-serialization through pdf-lib.
 * Note: pdf-lib does not currently implement FLATE compression or
 * image downsampling, so this primarily cleans up object streams.
 * For now this is a placeholder stub that re-saves the document.
 * Real compression (image downsampling) will be layered on top later.
 */
export async function compressPdf(pdfBuffer: ArrayBuffer): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  return src.save({ useObjectStreams: true });
}

/**
 * Get the page count of a PDF without loading all pages.
 */
export async function getPdfPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.load(pdfBuffer);
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
  const doc = await PDFDocument.load(pdfBuffer);
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
