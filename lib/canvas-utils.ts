/**
 * Z Lab — Canvas Utilities
 * Reusable wrappers for common Canvas API operations used across image tools.
 * All functions run entirely in the browser. No file ever leaves the device.
 */

export type ImageOutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

/** Options for resizing an image. */
export interface ResizeOptions {
  /** Target width in pixels. */
  width: number;
  /** Target height in pixels. */
  height: number;
  /** Whether to maintain the original aspect ratio (default: true). */
  maintainAspectRatio?: boolean;
  /** Output format (default: 'image/jpeg'). */
  format?: ImageOutputFormat;
  /** Quality 0–1 (applies to jpeg/webp, default: 0.9). */
  quality?: number;
}

/** Options for compressing an image. */
export interface CompressOptions {
  /** Quality 0–1 (default: 0.8). */
  quality?: number;
  /** Output format (default: 'image/jpeg'). */
  format?: ImageOutputFormat;
  /** Optional max width; image will be downscaled if wider (preserves aspect ratio). */
  maxWidth?: number;
  /** Optional max height; image will be downscaled if taller (preserves aspect ratio). */
  maxHeight?: number;
}

/**
 * Load a File into an HTMLImageElement and wait for it to be fully decoded.
 */
export function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image.'));
    };
    img.src = url;
  });
}

/**
 * Resize an image File and return the result as a Blob.
 */
export async function resizeImage(file: File | Blob, options: ResizeOptions): Promise<Blob> {
  const img = await loadImage(file);
  const format = options.format ?? 'image/jpeg';
  const quality = options.quality ?? 0.9;
  const maintain = options.maintainAspectRatio ?? true;

  let targetW = options.width;
  let targetH = options.height;

  if (maintain) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    if (targetW / targetH > aspectRatio) {
      targetW = Math.round(targetH * aspectRatio);
    } else {
      targetH = Math.round(targetW / aspectRatio);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return canvasToBlob(canvas, format, quality);
}

/**
 * Compress an image File and return the result as a Blob.
 */
export async function compressImage(file: File | Blob, options: CompressOptions = {}): Promise<Blob> {
  const img = await loadImage(file);
  const format = options.format ?? 'image/jpeg';
  const quality = options.quality ?? 0.8;

  let targetW = img.naturalWidth;
  let targetH = img.naturalHeight;

  if (options.maxWidth && targetW > options.maxWidth) {
    targetH = Math.round((targetH * options.maxWidth) / targetW);
    targetW = options.maxWidth;
  }
  if (options.maxHeight && targetH > options.maxHeight) {
    targetW = Math.round((targetW * options.maxHeight) / targetH);
    targetH = options.maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return canvasToBlob(canvas, format, quality);
}

export interface SmartCompressOptions {
  /** Target quality 0.1 to 1.0 (default: 0.72) */
  quality?: number;
  /** Output format; 'auto' selects the optimal format between WebP and JPEG */
  format?: 'auto' | ImageOutputFormat;
  /** Max pixel width (aspect ratio is preserved) */
  maxWidth?: number;
  /** Max pixel height (aspect ratio is preserved) */
  maxHeight?: number;
  /** Target file size in kilobytes (optional) */
  targetSizeKb?: number;
}

export interface SmartCompressResult {
  blob: Blob;
  format: ImageOutputFormat;
  width: number;
  height: number;
  size: number;
  originalSize: number;
  savedPercent: number;
  wasAdapted: boolean;
  isLargerThanOriginal: boolean;
}

/**
 * Intelligent image compression that prevents file size inflation,
 * selects the optimal web format, and optionally targets a maximum KB size.
 */
export async function smartCompressImage(
  file: File | Blob,
  options: SmartCompressOptions = {}
): Promise<SmartCompressResult> {
  const img = await loadImage(file);
  const origSize = file.size;

  let targetW = img.naturalWidth;
  let targetH = img.naturalHeight;

  if (options.maxWidth && options.maxWidth > 0 && targetW > options.maxWidth) {
    targetH = Math.round((targetH * options.maxWidth) / targetW);
    targetW = options.maxWidth;
  }
  if (options.maxHeight && options.maxHeight > 0 && targetH > options.maxHeight) {
    targetW = Math.round((targetW * options.maxHeight) / targetH);
    targetH = options.maxHeight;
  }

  // Helper to render and export to blob
  const render = (fmt: ImageOutputFormat, q: number, w: number, h: number): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');
    if (fmt === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    return canvasToBlob(canvas, fmt, q);
  };

  const requestedFormat = options.format ?? 'auto';
  let targetQuality = Math.min(1.0, Math.max(0.1, options.quality ?? 0.72));

  // If targetSizeKb is set, iterate to meet the size limit
  if (options.targetSizeKb && options.targetSizeKb > 0) {
    const maxBytes = options.targetSizeKb * 1024;
    const testFmt: ImageOutputFormat =
      requestedFormat === 'auto' ? 'image/webp' : requestedFormat;

    let bestBlob: Blob | null = null;
    let currW = targetW;
    let currH = targetH;
    let currQ = targetQuality;

    for (let attempt = 0; attempt < 8; attempt++) {
      const b = await render(testFmt, currQ, currW, currH);
      bestBlob = b;
      if (b.size <= maxBytes) {
        break;
      }
      if (currQ > 0.3) {
        currQ = Math.max(0.2, currQ - 0.15);
      } else {
        // Downscale dimensions slightly if quality alone isn't enough
        currW = Math.round(currW * 0.85);
        currH = Math.round(currH * 0.85);
      }
    }

    const finalBlob = bestBlob ?? (await render(testFmt, currQ, currW, currH));
    return {
      blob: finalBlob,
      format: testFmt,
      width: currW,
      height: currH,
      size: finalBlob.size,
      originalSize: origSize,
      savedPercent: origSize > 0 ? Math.round(((origSize - finalBlob.size) / origSize) * 100) : 0,
      wasAdapted: true,
      isLargerThanOriginal: finalBlob.size >= origSize,
    };
  }

  // Standard compression: test format & prevent file inflation
  let chosenFormat: ImageOutputFormat =
    requestedFormat === 'auto' ? 'image/webp' : requestedFormat;

  let blob = await render(chosenFormat, targetQuality, targetW, targetH);
  let wasAdapted = false;

  // If 'auto' mode and WebP was larger than original, also try JPEG
  if (requestedFormat === 'auto' && blob.size >= origSize) {
    const jpegBlob = await render('image/jpeg', targetQuality, targetW, targetH);
    if (jpegBlob.size < blob.size) {
      blob = jpegBlob;
      chosenFormat = 'image/jpeg';
    }
  }

  // If the result is still larger than the original image:
  // Automatically step down quality to achieve genuine compression
  if (blob.size >= origSize && chosenFormat !== 'image/png') {
    const stepQualities = [0.65, 0.5, 0.4, 0.3];
    for (const q of stepQualities) {
      if (q >= targetQuality) continue;
      const testBlob = await render(chosenFormat, q, targetW, targetH);
      if (testBlob.size < origSize) {
        blob = testBlob;
        targetQuality = q;
        wasAdapted = true;
        break;
      }
    }
  }

  return {
    blob,
    format: chosenFormat,
    width: targetW,
    height: targetH,
    size: blob.size,
    originalSize: origSize,
    savedPercent: origSize > 0 ? Math.round(((origSize - blob.size) / origSize) * 100) : 0,
    wasAdapted,
    isLargerThanOriginal: blob.size >= origSize,
  };
}

/**
 * Apply a CSS filter string to an image and return the result as a Blob.
 * @param filter  A valid CSS filter string, e.g. 'grayscale(100%)' or 'sepia(80%) brightness(1.1)'.
 */
export async function applyFilter(
  file: File | Blob,
  filter: string,
  format: ImageOutputFormat = 'image/png',
  quality = 1
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');
  ctx.filter = filter;
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, format, quality);
}

/**
 * Draw text overlays onto an image (meme-style or watermark).
 */
export interface TextOverlay {
  text: string;
  x: number;
  y: number;
  font?: string;
  color?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  strokeColor?: string;
  strokeWidth?: number;
}

export async function drawTextOverlays(
  file: File | Blob,
  overlays: TextOverlay[],
  format: ImageOutputFormat = 'image/png',
  quality = 1
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');
  ctx.drawImage(img, 0, 0);

  for (const overlay of overlays) {
    ctx.font = overlay.font ?? 'bold 48px Impact, sans-serif';
    ctx.textAlign = overlay.align ?? 'center';
    ctx.textBaseline = overlay.baseline ?? 'top';
    if (overlay.strokeColor) {
      ctx.strokeStyle = overlay.strokeColor;
      ctx.lineWidth = overlay.strokeWidth ?? 3;
      ctx.strokeText(overlay.text, overlay.x, overlay.y);
    }
    ctx.fillStyle = overlay.color ?? '#ffffff';
    ctx.fillText(overlay.text, overlay.x, overlay.y);
  }

  return canvasToBlob(canvas, format, quality);
}

/**
 * Extract the N most dominant colors from an image using canvas pixel sampling.
 * Returns an array of hex color strings.
 */
export async function extractPalette(file: File | Blob, colorCount = 6): Promise<string[]> {
  const img = await loadImage(file);
  // Sample at a smaller size for performance
  const sampleSize = 100;
  const canvas = document.createElement('canvas');
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');
  ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
  const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);

  // Bucket colours into coarse bins
  const buckets = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    const key = `${r},${g},${b}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });
}

/**
 * Stitch multiple images together into a grid collage.
 * @param files   Array of image files to arrange.
 * @param cols    Number of columns in the grid (default: 2).
 * @param gap     Gap in pixels between cells (default: 8).
 * @param cellSize  Fixed size of each cell in pixels (default: 400).
 */
export async function makeCollage(
  files: (File | Blob)[],
  cols = 2,
  gap = 8,
  cellSize = 400,
  format: ImageOutputFormat = 'image/jpeg',
  quality = 0.9
): Promise<Blob> {
  const images = await Promise.all(files.map(loadImage));
  const rows = Math.ceil(images.length / cols);
  const totalW = cols * cellSize + (cols - 1) * gap;
  const totalH = rows * cellSize + (rows - 1) * gap;

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, totalW, totalH);

  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (cellSize + gap);
    const y = row * (cellSize + gap);
    // Cover-fit: center-crop the image into the cell
    const scale = Math.max(cellSize / img.naturalWidth, cellSize / img.naturalHeight);
    const sw = cellSize / scale;
    const sh = cellSize / scale;
    const sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, cellSize, cellSize);
  });

  return canvasToBlob(canvas, format, quality);
}

// ─── Internal helpers ────────────────────────────────────────────────────────

/** Convert a canvas to a Blob (promisified). */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageOutputFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null.'));
      },
      format,
      quality
    );
  });
}
