/**
 * Z Lab — Tool Registry
 * Single source of truth for every tool and category in the platform.
 */

export type ToolCategory =
  | 'creative-studio'
  | 'pdf-document'
  | 'text-writing'
  | 'study-focus'
  | 'dev-utilities'
  | 'privacy-vault';

export interface CategoryMeta {
  id: ToolCategory;
  name: string;
  tagline: string;
  shortTitle: string;
  icon: string;
  illustration: string;
  canvasClass: string;
  accentColor: string; // e.g. #FF6B8B
  bgTint: string;      // e.g. #FFF0F3
  badgeBg: string;     // e.g. bg-[#FF6B8B]
  textColor: string;   // e.g. text-[#111116]
  description: string;
  featuredSlug: string;
}

export interface ToolConfig {
  /** URL-safe slug, e.g. "image-compressor" */
  slug: string;
  /** Which category hub this tool belongs to */
  category: ToolCategory;
  /** Human-readable display title */
  title: string;
  /** One-line description shown on cards and meta tags */
  shortDescription: string;
  /** Lucide icon name (string identifier) */
  icon: string;
  /** Keywords used for SEO and instant search */
  keywords: string[];
  /** Optional badge, e.g. "Popular", "Hot", "New" */
  badge?: string;
}

export const CATEGORIES: ToolCategory[] = [
  'creative-studio',
  'pdf-document',
  'text-writing',
  'study-focus',
  'dev-utilities',
  'privacy-vault',
];

export const CATEGORY_INFO: Record<ToolCategory, CategoryMeta> = {
  'creative-studio': {
    id: 'creative-studio',
    name: 'Creative Studio',
    shortTitle: 'Studio',
    tagline: 'Visuals, Memes & Social Media',
    icon: 'Sparkles',
    illustration: '/illustrations/creative-studio.jpg',
    canvasClass: 'bg-creative-canvas',
    accentColor: '#FF6B8B',
    bgTint: '#FFF0F5',
    badgeBg: 'bg-[#FF6B8B]',
    textColor: 'text-[#111116]',
    description: 'Compress, resize, edit photos, create memes, and design social content with zero server lag.',
    featuredSlug: 'image-resizer',
  },
  'pdf-document': {
    id: 'pdf-document',
    name: 'PDF & Document Lab',
    shortTitle: 'PDF Lab',
    tagline: 'Paperless Client-Side Docs',
    icon: 'FileText',
    illustration: '/illustrations/pdf-document.jpg',
    canvasClass: 'bg-pdf-canvas',
    accentColor: '#68A0FD',
    bgTint: '#EEF5FF',
    badgeBg: 'bg-[#68A0FD]',
    textColor: 'text-[#111116]',
    description: 'Merge, split, reorder, rotate, and convert PDFs directly inside browser memory.',
    featuredSlug: 'pdf-compressor',
  },
  'text-writing': {
    id: 'text-writing',
    name: 'Text & Writing Suite',
    shortTitle: 'Words',
    tagline: 'Clean Formatting & Metrics',
    icon: 'PenTool',
    illustration: '/illustrations/hero-mascot.jpg',
    canvasClass: 'bg-writing-canvas',
    accentColor: '#FFE500',
    bgTint: '#FFFDE6',
    badgeBg: 'bg-[#FFE500]',
    textColor: 'text-[#111116]',
    description: 'Word counter, markdown live preview, case converter, citations, and instant text-to-speech.',
    featuredSlug: 'word-counter',
  },
  'study-focus': {
    id: 'study-focus',
    name: 'Study & Focus Deck',
    shortTitle: 'Study',
    tagline: 'Productivity & Flow States',
    icon: 'Zap',
    illustration: '/illustrations/study-focus.jpg',
    canvasClass: 'bg-study-canvas',
    accentColor: '#D4F84B',
    bgTint: '#F4FDE8',
    badgeBg: 'bg-[#D4F84B]',
    textColor: 'text-[#111116]',
    description: 'Pomodoro timer, smart flip flashcards, ambient sound noise generator, and streak trackers.',
    featuredSlug: 'pomodoro-timer',
  },
  'dev-utilities': {
    id: 'dev-utilities',
    name: 'Dev & Web Utilities',
    shortTitle: 'Dev Box',
    tagline: 'Generators, QR & Code Tools',
    icon: 'Code2',
    illustration: '/illustrations/dev-utilities.jpg',
    canvasClass: 'bg-dev-canvas',
    accentColor: '#C084FC',
    bgTint: '#F9F5FF',
    badgeBg: 'bg-[#C084FC]',
    textColor: 'text-[#111116]',
    description: 'QR codes, barcodes, CSS gradients, color conversions, UUIDs, and random mock test data.',
    featuredSlug: 'qr-generator',
  },
  'privacy-vault': {
    id: 'privacy-vault',
    name: 'Privacy Vault',
    shortTitle: 'Privacy',
    tagline: 'Zero-Knowledge Security',
    icon: 'ShieldCheck',
    illustration: '/illustrations/privacy-vault.jpg',
    canvasClass: 'bg-privacy-canvas',
    accentColor: '#4ADE80',
    bgTint: '#ECFDF5',
    badgeBg: 'bg-[#4ADE80]',
    textColor: 'text-[#111116]',
    description: 'Scrub EXIF metadata, generate high-entropy passwords, compute hashes, and AES encrypt text locally.',
    featuredSlug: 'password-generator',
  },
};

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  'creative-studio': 'Creative Studio',
  'pdf-document': 'PDF & Document Lab',
  'text-writing': 'Text & Writing Suite',
  'study-focus': 'Study & Focus Deck',
  'dev-utilities': 'Dev & Web Utilities',
  'privacy-vault': 'Privacy Vault',
};

/** Backwards-compatibility lookup for previous category slugs */
export const LEGACY_CATEGORY_MAP: Record<string, ToolCategory> = {
  privacy: 'privacy-vault',
  'link-code': 'dev-utilities',
  'everyday-utility': 'dev-utilities',
  'content-creator': 'creative-studio',
  student: 'study-focus',
};

export function resolveCategory(raw: string): ToolCategory {
  if (CATEGORIES.includes(raw as ToolCategory)) {
    return raw as ToolCategory;
  }
  return LEGACY_CATEGORY_MAP[raw] || 'creative-studio';
}

export const toolsRegistry: ToolConfig[] = [
  // ─── 🎨 Creative Studio (10 tools) ──────────────────────────────────────────
  {
    slug: 'image-resizer',
    category: 'creative-studio',
    title: 'Image Resizer',
    shortDescription: 'Resize images to exact pixel dimensions with zero quality loss.',
    icon: 'Maximize2',
    keywords: ['image', 'resize', 'dimensions', 'width', 'height', 'canvas'],
    badge: 'Popular',
  },
  {
    slug: 'image-compressor',
    category: 'creative-studio',
    title: 'Image Compressor',
    shortDescription: 'Compress JPG and PNG photos locally to slash file size.',
    icon: 'FileDown',
    keywords: ['image', 'compress', 'optimize', 'jpg', 'png', 'file size'],
    badge: 'Hot',
  },
  {
    slug: 'meme-generator',
    category: 'creative-studio',
    title: 'Meme Generator',
    shortDescription: 'Generate custom memes with punchy top and bottom text styling.',
    icon: 'Laugh',
    keywords: ['meme', 'image', 'text', 'generator', 'canvas', 'funny'],
  },
  {
    slug: 'photo-collage',
    category: 'creative-studio',
    title: 'Photo Collage Maker',
    shortDescription: 'Combine multiple photos into a crisp grid collage and export.',
    icon: 'LayoutGrid',
    keywords: ['collage', 'photo', 'grid', 'combine', 'image', 'canvas'],
  },
  {
    slug: 'image-filters',
    category: 'creative-studio',
    title: 'Image Filter Lab',
    shortDescription: 'Apply retro, sepia, blur, contrast, and cyberpunk filters.',
    icon: 'Sliders',
    keywords: ['filter', 'image', 'grayscale', 'sepia', 'blur', 'canvas'],
  },
  {
    slug: 'image-watermark',
    category: 'creative-studio',
    title: 'Image Watermark',
    shortDescription: 'Add text or logo copyright badges to protect your photos.',
    icon: 'Stamp',
    keywords: ['watermark', 'image', 'text', 'logo', 'overlay', 'canvas'],
  },
  {
    slug: 'color-palette-extractor',
    category: 'creative-studio',
    title: 'Color Palette Extractor',
    shortDescription: 'Extract the dominant color palette and hex swatches from any photo.',
    icon: 'Pipette',
    keywords: ['color', 'palette', 'extract', 'image', 'dominant', 'swatch'],
  },
  {
    slug: 'favicon-resizer',
    category: 'creative-studio',
    title: 'Favicon Resizer',
    shortDescription: 'Resize any logo to 16, 32, 64, and 180px favicon app packs.',
    icon: 'ImagePlus',
    keywords: ['favicon', 'icon', 'resize', 'image', '16x16', '32x32'],
  },
  {
    slug: 'thumbnail-creator',
    category: 'creative-studio',
    title: 'Thumbnail & Social Resizer',
    shortDescription: 'Design social thumbnails with YouTube, IG, TikTok, and Twitter presets.',
    icon: 'Layout',
    keywords: ['thumbnail', 'youtube', 'instagram', 'tiktok', 'social media', 'banner', 'resizer'],
  },
  {
    slug: 'image-format-converter',
    category: 'creative-studio',
    title: 'Image Format Converter',
    shortDescription: 'Convert photos between PNG, WebP, JPEG, and AVIF with instant download.',
    icon: 'FileImage',
    keywords: ['image converter', 'png to webp', 'webp to png', 'jpg to png', 'format', 'convert'],
  },

  // ─── 📄 PDF & Document Lab (7 tools) ────────────────────────────────────────
  {
    slug: 'pdf-compressor',
    category: 'pdf-document',
    title: 'PDF Compressor',
    shortDescription: 'Reduce PDF file weight inside browser RAM without server leaks.',
    icon: 'FileArchive',
    keywords: ['pdf', 'compress', 'reduce', 'file size', 'optimize'],
    badge: 'Popular',
  },
  {
    slug: 'pdf-merge',
    category: 'pdf-document',
    title: 'PDF Merger',
    shortDescription: 'Join and combine multiple PDF documents into a single master file.',
    icon: 'FilePlus2',
    keywords: ['pdf', 'merge', 'combine', 'join', 'files'],
  },
  {
    slug: 'pdf-split',
    category: 'pdf-document',
    title: 'PDF Splitter',
    shortDescription: 'Extract specific pages or break a PDF into individual files.',
    icon: 'Scissors',
    keywords: ['pdf', 'split', 'pages', 'extract', 'range'],
  },
  {
    slug: 'pdf-reorder',
    category: 'pdf-document',
    title: 'PDF Page Reorder',
    shortDescription: 'Drag and drop to sort, reorder, and restructure PDF pages.',
    icon: 'GripVertical',
    keywords: ['pdf', 'reorder', 'sort', 'pages', 'drag', 'drop'],
  },
  {
    slug: 'pdf-rotator',
    category: 'pdf-document',
    title: 'PDF Rotator',
    shortDescription: 'Rotate PDF pages clockwise or upside-down by 90, 180, or 270 degrees.',
    icon: 'RotateCw',
    keywords: ['pdf', 'rotate', 'orientation', 'pages', 'document', 'flip'],
  },
  {
    slug: 'image-to-pdf',
    category: 'pdf-document',
    title: 'Image to PDF',
    shortDescription: 'Batch compile JPG and PNG images into a clean multi-page PDF.',
    icon: 'FileImage',
    keywords: ['image', 'pdf', 'convert', 'jpg', 'png', 'document'],
  },
  {
    slug: 'csv-editor',
    category: 'pdf-document',
    title: 'CSV Spreadsheet Editor',
    shortDescription: 'Inspect, edit, filter, and export CSV tables with an in-browser sheet.',
    icon: 'Table',
    keywords: ['csv', 'spreadsheet', 'table', 'editor', 'excel', 'data', 'convert', 'json'],
  },

  // ─── ✍️ Text & Writing Suite (7 tools) ──────────────────────────────────────
  {
    slug: 'word-counter',
    category: 'text-writing',
    title: 'Word & Reading Counter',
    shortDescription: 'Count words, characters, sentences, and estimated reading time live.',
    icon: 'Type',
    keywords: ['word', 'count', 'character', 'sentence', 'reading time', 'text'],
    badge: 'Popular',
  },
  {
    slug: 'character-counter',
    category: 'text-writing',
    title: 'Character & Line Counter',
    shortDescription: 'Inspect detailed character metrics, line counts, byte sizes, and density.',
    icon: 'AlignLeft',
    keywords: ['character counter', 'line counter', 'text stats', 'bytes', 'words', 'lines'],
  },
  {
    slug: 'case-converter',
    category: 'text-writing',
    title: 'Case Converter',
    shortDescription: 'Transform text to UPPER, lower, Title Case, camelCase, and kebab-case.',
    icon: 'CaseSensitive',
    keywords: ['case', 'upper', 'lower', 'title', 'camel', 'snake', 'text'],
  },
  {
    slug: 'text-to-speech',
    category: 'text-writing',
    title: 'Text to Speech Synthesizer',
    shortDescription: 'Listen to any text with browser speech synthesis and speed control.',
    icon: 'Volume2',
    keywords: ['text', 'speech', 'tts', 'audio', 'read', 'voice', 'accessibility'],
  },
  {
    slug: 'markdown-previewer',
    category: 'text-writing',
    title: 'Markdown Live Previewer',
    shortDescription: 'Write GitHub Markdown on the left, see instant rendered HTML on the right.',
    icon: 'FileText',
    keywords: ['markdown', 'preview', 'html', 'render', 'live', 'editor'],
  },
  {
    slug: 'rich-text-editor',
    category: 'text-writing',
    title: 'Rich Text Notes Editor',
    shortDescription: 'Draft notes with headings, bold text, lists, and export clean HTML.',
    icon: 'PenTool',
    keywords: ['rich text', 'wysiwyg', 'editor', 'notes', 'formatting', 'html', 'write'],
  },
  {
    slug: 'citation-generator',
    category: 'text-writing',
    title: 'Academic Citation Generator',
    shortDescription: 'Generate precise MLA 9, APA 7, and Chicago 17 bibliographies instantly.',
    icon: 'BookOpen',
    keywords: ['citation', 'mla', 'apa', 'chicago', 'bibliography', 'references', 'academic', 'essay'],
  },

  // ─── ⚡ Study & Focus Deck (5 tools) ────────────────────────────────────────
  {
    slug: 'pomodoro-timer',
    category: 'study-focus',
    title: 'Pomodoro Focus Timer',
    shortDescription: 'Customizable work intervals, short/long break timers, and chime chimes.',
    icon: 'Timer',
    keywords: ['pomodoro', 'timer', 'focus', 'study', 'productivity', 'break', 'clock'],
    badge: 'Hot',
  },
  {
    slug: 'smart-flashcards',
    category: 'study-focus',
    title: 'Smart Flashcard Quizzer',
    shortDescription: 'Create interactive 3D flip study decks with spaced repetition review.',
    icon: 'Layers',
    keywords: ['flashcards', 'study', 'quiz', 'memorize', 'cards', 'learning', 'revision'],
  },
  {
    slug: 'gpa-calculator',
    category: 'study-focus',
    title: 'GPA & CGPA Calculator',
    shortDescription: 'Compute semester GPA and cumulative CGPA on 4.0 and 10.0 grade scales.',
    icon: 'GraduationCap',
    keywords: ['gpa', 'cgpa', 'calculator', 'grades', 'college', 'semester', 'credits', 'scale'],
  },
  {
    slug: 'white-noise-generator',
    category: 'study-focus',
    title: 'White & Brown Noise Lab',
    shortDescription: 'Synthesize ambient brown, pink, and white noise for laser focus and sleep.',
    icon: 'Volume2',
    keywords: ['white noise', 'pink noise', 'brown noise', 'ambient', 'focus', 'relax', 'audio', 'sound'],
  },
  {
    slug: 'habit-tracker',
    category: 'study-focus',
    title: 'Daily Streak Habit Tracker',
    shortDescription: 'Track daily habits and build streaks with private local browser storage.',
    icon: 'CheckSquare',
    keywords: ['habit tracker', 'streaks', 'goals', 'routine', 'daily', 'productivity'],
  },

  // ─── 💻 Dev & Web Utilities (10 tools) ──────────────────────────────────────
  {
    slug: 'qr-generator',
    category: 'dev-utilities',
    title: 'QR Code Studio',
    shortDescription: 'Generate custom QR codes with high resolution SVG/PNG export.',
    icon: 'QrCode',
    keywords: ['qr', 'qrcode', 'generate', 'url', 'barcode'],
    badge: 'Popular',
  },
  {
    slug: 'qr-scanner',
    category: 'dev-utilities',
    title: 'QR Code Scanner',
    shortDescription: 'Decode QR codes from photos or camera input client-side.',
    icon: 'ScanLine',
    keywords: ['qr', 'scan', 'decode', 'image', 'reader'],
  },
  {
    slug: 'barcode-generator',
    category: 'dev-utilities',
    title: 'Barcode Generator',
    shortDescription: 'Render CODE-128, EAN-13, UPC-A, and ITF barcodes in vector format.',
    icon: 'BarChart2',
    keywords: ['barcode', 'code128', 'ean', 'upc', 'generate'],
  },
  {
    slug: 'url-encoder',
    category: 'dev-utilities',
    title: 'URL & Query Encoder',
    shortDescription: 'Safely encode or decode URL parameters and query strings.',
    icon: 'Link',
    keywords: ['url', 'encode', 'decode', 'uri', 'query', 'percent'],
  },
  {
    slug: 'unit-converter',
    category: 'dev-utilities',
    title: 'Unit Converter',
    shortDescription: 'Convert between length, weight, temperature, speed, area, and volume.',
    icon: 'ArrowLeftRight',
    keywords: ['unit', 'convert', 'length', 'weight', 'temperature', 'metric'],
  },
  {
    slug: 'color-converter',
    category: 'dev-utilities',
    title: 'Color Format Converter',
    shortDescription: 'Convert colors seamlessly between HEX, RGB, HSL, and CMYK codes.',
    icon: 'Palette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'cmyk', 'convert'],
  },
  {
    slug: 'css-gradient-generator',
    category: 'dev-utilities',
    title: 'CSS Gradient Lab',
    shortDescription: 'Design modern linear and radial gradients with 1-click CSS copying.',
    icon: 'Blend',
    keywords: ['css', 'gradient', 'linear', 'radial', 'design', 'color'],
  },
  {
    slug: 'uuid-generator',
    category: 'dev-utilities',
    title: 'UUID v4 Bulk Generator',
    shortDescription: 'Generate batches of cryptographically unique UUID identifiers.',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'random', 'generate', 'unique', 'id'],
  },
  {
    slug: 'random-data-generator',
    category: 'dev-utilities',
    title: 'Mock Data Generator',
    shortDescription: 'Generate fake names, mock emails, user profiles, and dummy JSON objects.',
    icon: 'Shuffle',
    keywords: ['random', 'fake', 'data', 'name', 'email', 'json', 'mock'],
  },
  {
    slug: 'scientific-calculator',
    category: 'dev-utilities',
    title: 'Scientific Calculator',
    shortDescription: 'Perform trigonometry, logarithms, powers, and algebraic calculations.',
    icon: 'Calculator',
    keywords: ['calculator', 'scientific', 'trig', 'math', 'algebra', 'sin', 'cos', 'log'],
  },

  // ─── 🔒 Privacy Vault (5 tools) ─────────────────────────────────────────────
  {
    slug: 'exif-remover',
    category: 'privacy-vault',
    title: 'EXIF Metadata Stripper',
    shortDescription: 'Scrub GPS location coordinates, camera models, and timestamps from photos.',
    icon: 'EyeOff',
    keywords: ['exif', 'metadata', 'privacy', 'image', 'photo', 'strip'],
    badge: 'Popular',
  },
  {
    slug: 'password-generator',
    category: 'privacy-vault',
    title: 'Password Generator',
    shortDescription: 'Generate strong, high-entropy passwords with custom symbol sets.',
    icon: 'KeyRound',
    keywords: ['password', 'security', 'random', 'crypto', 'generate'],
    badge: 'Hot',
  },
  {
    slug: 'hash-generator',
    category: 'privacy-vault',
    title: 'Cryptographic Hash Generator',
    shortDescription: 'Compute SHA-256, SHA-512, and MD5 checksum hashes in browser memory.',
    icon: 'Hash',
    keywords: ['hash', 'sha256', 'sha512', 'md5', 'checksum', 'crypto'],
  },
  {
    slug: 'base64-encoder',
    category: 'privacy-vault',
    title: 'Base64 Encoder / Decoder',
    shortDescription: 'Encode or decode Base64 strings and raw files client-side.',
    icon: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'text', 'file'],
  },
  {
    slug: 'text-encryptor',
    category: 'privacy-vault',
    title: 'AES-256 Text Encryptor',
    shortDescription: 'Encrypt and decrypt text locally with passphrase-derived AES-256.',
    icon: 'Lock',
    keywords: ['encrypt', 'decrypt', 'aes', 'text', 'secure', 'passphrase'],
  },
];

/** Look up a single tool by slug. */
export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolsRegistry.find((t) => t.slug === slug);
}

/** Get all tools belonging to a category. */
export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return toolsRegistry.filter((t) => t.category === category);
}

/** Alias for toolsRegistry */
export const TOOLS = toolsRegistry;
