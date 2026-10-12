const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const OUTPUT_DIR = path.join(__dirname, '..', 'reports', 'screenshots');
const PDF_OUTPUT_PATH = path.join(__dirname, '..', 'Z_Lab_UI_UX_Comprehensive_Report.pdf');
const PUBLIC_PDF_PATH = path.join(__dirname, '..', 'public', 'Z_Lab_UI_UX_Comprehensive_Report.pdf');

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/⌘/g, 'Ctrl+')
    .replace(/•/g, '-')
    .replace(/×/g, 'x')
    .replace(/—/g, '--')
    .replace(/–/g, '-')
    .replace(/’/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/[^\x20-\x7E\r\n\t]/g, ''); // strip any non-ASCII
}

const DESKTOP_TASKS = [
  {
    id: 'desktop_01_home_hero',
    title: 'Home Screen -- Hero & Version 2.0 Launchpad',
    url: '/',
    description: 'MindMate mascot illustration, Version 2.0 badge, 100% Local RAM status chip, and gradient primary CTA.',
  },
  {
    id: 'desktop_02_home_dashboard',
    title: 'Home Screen -- Dashboard, RAM Meter & Featured Spotlight',
    url: '/',
    description: 'Category icon buttons, live hardware memory meter, and sunset gradient flagship spotlight.',
  },
  {
    id: 'desktop_03_home_bento',
    title: 'Home Screen -- Instant Action Bento Launchpad',
    url: '/',
    description: 'Zero-latency micro-tools: Quick Password, live QR Generator, mini Pomodoro, and Color Palette chips.',
  },
  {
    id: 'desktop_04_home_hubs',
    title: 'Home Screen -- 6 Dedicated Laboratory Hubs Showcase',
    url: '/',
    description: 'Pure inline SVG vector illustrations floating seamlessly on soft elevated white cards without harsh borders.',
  },
  {
    id: 'desktop_05_home_explorer',
    title: 'Home Screen -- Tools Explorer & Category Pill Filters',
    url: '/',
    description: 'Omni search input, category filtering pills, and comprehensive tool cards with favorite star toggles.',
  },
  {
    id: 'desktop_06_omni_search',
    title: 'Global Omni-Search & Command Palette (Ctrl+K)',
    url: '/',
    description: 'Full keyboard-navigable search dialog with category filters and zero-latency instant fuzzy matching.',
  },
  {
    id: 'desktop_07_hubs_drawer',
    title: 'Global Navigation Drawer -- Category Hubs Directory',
    url: '/',
    description: 'Slide-out category navigation drawer with direct links, tool counts, and privacy architecture overview.',
  },
  {
    id: 'desktop_08_cat_study_focus',
    title: 'Category Hub -- Study & Focus Laboratory',
    url: '/tools/study-focus',
    description: 'Flagship Pomodoro Focus Session spotlight, offline tools catalog, and 0ms server lag guarantee.',
  },
  {
    id: 'desktop_09_cat_creative_studio',
    title: 'Category Hub -- Creative Studio Laboratory',
    url: '/tools/creative-studio',
    description: 'Image compressor, meme generator, format converters, and canvas manipulation workspaces.',
  },
  {
    id: 'desktop_10_cat_pdf_document',
    title: 'Category Hub -- PDF & Documents Laboratory',
    url: '/tools/pdf-document',
    description: 'Local PDF merge, split, compress, and reorder tools executing entirely inside browser WebAssembly.',
  },
  {
    id: 'desktop_11_cat_privacy_vault',
    title: 'Category Hub -- Privacy & Security Vault',
    url: '/tools/privacy-vault',
    description: 'WebCrypto password generator, EXIF metadata scrubbers, SHA/MD5 hashers, and text encryptors.',
  },
  {
    id: 'desktop_12_cat_dev_utilities',
    title: 'Category Hub -- Developer Utilities Laboratory',
    url: '/tools/dev-utilities',
    description: 'QR Code Studio, Barcode generator, JSON/CSV formatters, and Base64 encoders.',
  },
  {
    id: 'desktop_13_cat_text_writing',
    title: 'Category Hub -- Text & Writing Laboratory',
    url: '/tools/text-writing',
    description: 'Word counter, Markdown previewer, Case converters, and Rich text authoring workspaces.',
  },
  {
    id: 'desktop_14_tool_pomodoro',
    title: 'Flagship Tool -- MindMate Pomodoro Focus Session',
    url: '/tools/study-focus/pomodoro-timer',
    description: 'Segmented circular radial dial, mood chips, Lo-Fi synthesizer, flow state wave, and duration pills.',
  },
  {
    id: 'desktop_15_tool_qr_generator',
    title: 'Flagship Tool -- QR Code Studio & Palette Customizer',
    url: '/tools/dev-utilities/qr-generator',
    description: 'Color preset pills, custom hex selectors, live elevated QR preview, and instant PNG download.',
  },
  {
    id: 'desktop_16_tool_password_generator',
    title: 'Flagship Tool -- WebCrypto Password Generator',
    url: '/tools/privacy-vault/password-generator',
    description: 'Cryptographic entropy evaluation bar, quick preset chips, character toggles, and secure copy.',
  },
  {
    id: 'desktop_17_tool_image_compressor',
    title: 'Flagship Tool -- In-Browser Image Compressor',
    url: '/tools/creative-studio/image-compressor',
    description: 'Soft lavender drag-and-drop zone, compression quality slider, max width selector, and gradient actions.',
  },
  {
    id: 'desktop_18_tool_word_counter',
    title: 'Flagship Tool -- Live Word & Reading Analytics',
    url: '/tools/text-writing/word-counter',
    description: '4 pastel stat cards (Words, Characters, Sentences, Paragraphs) and reading/speaking time metrics.',
  },
  {
    id: 'desktop_19_tool_text_to_speech',
    title: 'Flagship Tool -- Client-Side Speech Synthesis Engine',
    url: '/tools/study-focus/text-to-speech',
    description: 'Offline Web Speech synthesis with voice models, pitch, rate controls, and gradient play trigger.',
  },
];

const MOBILE_TASKS = [
  {
    id: 'mobile_01_home_hero',
    title: 'Mobile Home Screen -- Onboarding Hero & Island Nav',
    url: '/',
    description: 'Touch-optimized header, character illustration, Version 2.0 chip, and floating pill bottom navigation.',
  },
  {
    id: 'mobile_02_home_dashboard',
    title: 'Mobile Home Screen -- Dashboard & Category Grid',
    url: '/',
    description: '6 circular pastel category icon badges and device RAM execution meter stacked for mobile screens.',
  },
  {
    id: 'mobile_03_home_bento',
    title: 'Mobile Home Screen -- Bento Action Widgets',
    url: '/',
    description: 'Quick-access widgets optimized for vertical thumb-scrolling with instant copy and generator actions.',
  },
  {
    id: 'mobile_04_home_hubs',
    title: 'Mobile Home Screen -- Category Hubs Cards',
    url: '/',
    description: 'Elevated white cards with pure vector lab illustrations and smooth tap navigation.',
  },
  {
    id: 'mobile_05_home_explorer',
    title: 'Mobile Home Screen -- Tool Explorer & Filters',
    url: '/',
    description: 'Horizontal swipeable category pills and card directory with favorite star triggers.',
  },
  {
    id: 'mobile_06_omni_search',
    title: 'Mobile Omni-Search -- Fullscreen Command Palette',
    url: '/',
    description: 'Triggered from the floating island bottom navigation bar for quick mobile tool discovery.',
  },
  {
    id: 'mobile_07_cat_study_focus',
    title: 'Mobile Category -- Study & Focus Hub',
    url: '/tools/study-focus',
    description: 'Full-bleed mobile category overview with sunset gradient flagship card and utility list.',
  },
  {
    id: 'mobile_08_cat_creative_studio',
    title: 'Mobile Category -- Creative Studio Hub',
    url: '/tools/creative-studio',
    description: 'Mobile layout for image processing and canvas tools with zero upload privacy guarantee.',
  },
  {
    id: 'mobile_09_tool_pomodoro',
    title: 'Mobile Tool -- Pomodoro Focus Session',
    url: '/tools/study-focus/pomodoro-timer',
    description: 'Circular radial timer dial with compact time chip matrix and mobile lo-fi controls.',
  },
  {
    id: 'mobile_10_tool_qr_generator',
    title: 'Mobile Tool -- QR Code Studio',
    url: '/tools/dev-utilities/qr-generator',
    description: 'Vertical stacked layout: Content input, palette buttons, live QR preview, and download action.',
  },
  {
    id: 'mobile_11_tool_password_generator',
    title: 'Mobile Tool -- WebCrypto Password Vault',
    url: '/tools/privacy-vault/password-generator',
    description: 'Mobile vault card with touch sliders, character switches, and gradient copy button.',
  },
  {
    id: 'mobile_12_tool_image_compressor',
    title: 'Mobile Tool -- In-Browser Image Compressor',
    url: '/tools/creative-studio/image-compressor',
    description: 'Mobile drag/tap file selection zone, quality slider, and responsive compression controls.',
  },
  {
    id: 'mobile_13_tool_word_counter',
    title: 'Mobile Tool -- Word & Text Analytics',
    url: '/tools/text-writing/word-counter',
    description: '2x2 grid of pastel metric counters, reading stats, and full mobile typing workspace.',
  },
];

async function generatePdfReport() {
  console.log('📄 Assembling Comprehensive PDF Report with pdf-lib...');
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 1200;
  const PAGE_HEIGHT = 800;

  // ── Slide 1: Cover Page ───────────────────────────────────────────────────
  const coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  // Background pastel canvas
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: rgb(0.957, 0.925, 0.973), // #F4ECF8
  });

  // White Card Container
  coverPage.drawRectangle({
    x: 80,
    y: 80,
    width: PAGE_WIDTH - 160,
    height: PAGE_HEIGHT - 160,
    color: rgb(1, 1, 1),
    borderWidth: 1,
    borderColor: rgb(0.9, 0.85, 0.95),
  });

  // Top Category Pill
  coverPage.drawRectangle({
    x: 130,
    y: PAGE_HEIGHT - 170,
    width: 220,
    height: 32,
    color: rgb(0.843, 0.969, 0.357), // Lime #D7F75B
  });
  coverPage.drawText(cleanText('OFFICIAL UI / UX REPORT'), {
    x: 145,
    y: PAGE_HEIGHT - 158,
    size: 13,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  // Title
  coverPage.drawText(cleanText('Z LAB -- Redesign & Visual Audit'), {
    x: 130,
    y: PAGE_HEIGHT - 230,
    size: 34,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  coverPage.drawText(cleanText('Complete Desktop & Mobile Interface Specification'), {
    x: 130,
    y: PAGE_HEIGHT - 270,
    size: 18,
    font: fontRegular,
    color: rgb(0.4, 0.38, 0.45),
  });

  // Summary box
  coverPage.drawRectangle({
    x: 130,
    y: 200,
    width: PAGE_WIDTH - 260,
    height: 250,
    color: rgb(0.98, 0.97, 0.99),
  });

  const summaryBullets = [
    '- Design System: MindMate Soft Pastel Claymorphic Pop (#F4ECF8 canvas, rounded-3xl cards, zero harsh borders)',
    '- Signature Accents: Lime-to-pink gradient pills (#D7F75B to #FCA5BA), circular pastel badges, segmented dial gauges',
    '- Part I: Desktop Workspace Interface (1440 x 900) -- Full hero, dashboard, 6 hubs, omni-search, and flagship tools',
    '- Part II: Mobile Island Experience (390 x 844) -- Floating bottom nav island, touch drawers, and thumb-friendly controls',
    '- Privacy Architecture: 100% Client-Side In-Browser RAM execution via Web Crypto, Canvas, Web Audio, and WebAssembly',
    '- Coverage: 32+ High-Resolution Verified Screen States across all 6 core laboratory categories and 44 client utilities',
  ];

  let bulletY = 410;
  for (const b of summaryBullets) {
    coverPage.drawText(cleanText(b), {
      x: 160,
      y: bulletY,
      size: 13,
      font: fontRegular,
      color: rgb(0.2, 0.18, 0.25),
    });
    bulletY -= 32;
  }

  // Footer metadata
  coverPage.drawText(cleanText(`Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })} - Next.js 16.4.0 Engine`), {
    x: 130,
    y: 125,
    size: 11,
    font: fontBold,
    color: rgb(0.5, 0.45, 0.55),
  });

  // ── Slide 2: Section Divider Part 1 (Desktop) ─────────────────────────────
  createSectionDivider(pdfDoc, fontBold, fontRegular, PAGE_WIDTH, PAGE_HEIGHT, 'PART I', 'DESKTOP WORKSPACE INTERFACE', '1440 x 900 Viewport - High-DPI Desktop Layout');

  // Add Desktop Slides
  for (let i = 0; i < DESKTOP_TASKS.length; i++) {
    const task = DESKTOP_TASKS[i];
    const imgPath = path.join(OUTPUT_DIR, `${task.id}.png`);
    if (fs.existsSync(imgPath)) {
      await addSlideWithImage(pdfDoc, fontBold, fontRegular, PAGE_WIDTH, PAGE_HEIGHT, {
        categoryBadge: 'DESKTOP VIEW (1440 x 900)',
        title: `${String(i + 1).padStart(2, '0')}. ${task.title}`,
        urlBadge: task.url,
        description: task.description,
        imagePath: imgPath,
        isMobile: false,
      });
    }
  }

  // ── Slide: Section Divider Part 2 (Mobile) ───────────────────────────────
  createSectionDivider(pdfDoc, fontBold, fontRegular, PAGE_WIDTH, PAGE_HEIGHT, 'PART II', 'MOBILE ISLAND & TOUCH EXPERIENCE', '390 x 844 Viewport - Floating Navigation Island & Mobile Drawers');

  // Add Mobile Slides
  for (let i = 0; i < MOBILE_TASKS.length; i++) {
    const task = MOBILE_TASKS[i];
    const imgPath = path.join(OUTPUT_DIR, `${task.id}.png`);
    if (fs.existsSync(imgPath)) {
      await addSlideWithImage(pdfDoc, fontBold, fontRegular, PAGE_WIDTH, PAGE_HEIGHT, {
        categoryBadge: 'MOBILE VIEW (390 x 844)',
        title: `${String(i + 1).padStart(2, '0')}. ${task.title}`,
        urlBadge: task.url,
        description: task.description,
        imagePath: imgPath,
        isMobile: true,
      });
    }
  }

  // ── Slide: Architectural Summary Index ────────────────────────────────────
  createSummarySlide(pdfDoc, fontBold, fontRegular, PAGE_WIDTH, PAGE_HEIGHT);

  // Save the complete PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(PDF_OUTPUT_PATH, pdfBytes);
  fs.writeFileSync(PUBLIC_PDF_PATH, pdfBytes);
  console.log(`\n🎉 PDF Report successfully generated at: ${PDF_OUTPUT_PATH}`);
  console.log(`   Public Copy at: ${PUBLIC_PDF_PATH}`);
  console.log(`   Total Pages: ${pdfDoc.getPageCount()}`);
  console.log(`   File Size: ${(pdfBytes.length / 1024 / 1024).toFixed(2)} MB`);
}

function createSectionDivider(pdfDoc, fontBold, fontRegular, width, height, partTag, title, subtitle) {
  const page = pdfDoc.addPage([width, height]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.957, 0.925, 0.973),
  });

  page.drawRectangle({
    x: 100,
    y: 150,
    width: width - 200,
    height: height - 300,
    color: rgb(1, 1, 1),
    borderWidth: 1,
    borderColor: rgb(0.9, 0.85, 0.95),
  });

  page.drawRectangle({
    x: 160,
    y: height - 260,
    width: 140,
    height: 36,
    color: rgb(0.988, 0.647, 0.729), // Pink #FCA5BA
  });

  page.drawText(cleanText(partTag), {
    x: 195,
    y: height - 246,
    size: 16,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  page.drawText(cleanText(title), {
    x: 160,
    y: height - 330,
    size: 32,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  page.drawText(cleanText(subtitle), {
    x: 160,
    y: height - 380,
    size: 18,
    font: fontRegular,
    color: rgb(0.45, 0.42, 0.5),
  });
}

async function addSlideWithImage(pdfDoc, fontBold, fontRegular, pageWidth, pageHeight, info) {
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Canvas background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.957, 0.925, 0.973),
  });

  // Top Header Card
  page.drawRectangle({
    x: 40,
    y: pageHeight - 95,
    width: pageWidth - 80,
    height: 75,
    color: rgb(1, 1, 1),
    borderWidth: 1,
    borderColor: rgb(0.92, 0.88, 0.96),
  });

  // Badge
  const badgeColor = info.isMobile ? rgb(0.988, 0.647, 0.729) : rgb(0.843, 0.969, 0.357);
  page.drawRectangle({
    x: 55,
    y: pageHeight - 55,
    width: 180,
    height: 22,
    color: badgeColor,
  });
  page.drawText(cleanText(info.categoryBadge), {
    x: 65,
    y: pageHeight - 47,
    size: 9,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  // Route URL badge
  page.drawRectangle({
    x: 245,
    y: pageHeight - 55,
    width: 180,
    height: 22,
    color: rgb(0.94, 0.92, 0.96),
  });
  page.drawText(cleanText(`Route: ${info.urlBadge}`), {
    x: 255,
    y: pageHeight - 47,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.25, 0.38),
  });

  // Title
  page.drawText(cleanText(info.title), {
    x: 55,
    y: pageHeight - 82,
    size: 16,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  // Embed screenshot
  const imageBytes = fs.readFileSync(info.imagePath);
  const image = await pdfDoc.embedPng(imageBytes);

  if (!info.isMobile) {
    // Desktop layout: full landscape screenshot below header
    const imgMaxW = pageWidth - 80;
    const imgMaxH = pageHeight - 130;
    const scale = Math.min(imgMaxW / image.width, imgMaxH / image.height);
    const imgW = image.width * scale;
    const imgH = image.height * scale;
    const imgX = (pageWidth - imgW) / 2;
    const imgY = 25 + (imgMaxH - imgH) / 2;

    // Soft card backing behind image
    page.drawRectangle({
      x: imgX - 3,
      y: imgY - 3,
      width: imgW + 6,
      height: imgH + 6,
      color: rgb(1, 1, 1),
      borderWidth: 1,
      borderColor: rgb(0.88, 0.84, 0.92),
    });

    page.drawImage(image, {
      x: imgX,
      y: imgY,
      width: imgW,
      height: imgH,
    });
  } else {
    // Mobile layout: centered mobile device frame on the left/center, with feature description callout on the right
    const imgMaxH = pageHeight - 135;
    const scale = Math.min(320 / image.width, imgMaxH / image.height);
    const imgW = image.width * scale;
    const imgH = image.height * scale;
    const imgX = 90;
    const imgY = 25 + (imgMaxH - imgH) / 2;

    // Mobile Phone Outer Bezel Card
    page.drawRectangle({
      x: imgX - 8,
      y: imgY - 8,
      width: imgW + 16,
      height: imgH + 16,
      color: rgb(1, 1, 1),
      borderWidth: 2,
      borderColor: rgb(0.85, 0.8, 0.9),
    });

    page.drawImage(image, {
      x: imgX,
      y: imgY,
      width: imgW,
      height: imgH,
    });

    // Right side Feature Description Box
    const descX = imgX + imgW + 40;
    const descW = pageWidth - descX - 60;

    page.drawRectangle({
      x: descX,
      y: pageHeight / 2 - 120,
      width: descW,
      height: 240,
      color: rgb(1, 1, 1),
      borderWidth: 1,
      borderColor: rgb(0.9, 0.85, 0.95),
    });

    page.drawRectangle({
      x: descX + 25,
      y: pageHeight / 2 + 75,
      width: 140,
      height: 24,
      color: rgb(0.92, 0.88, 0.98),
    });
    page.drawText(cleanText('MOBILE UX HIGHLIGHT'), {
      x: descX + 35,
      y: pageHeight / 2 + 83,
      size: 9,
      font: fontBold,
      color: rgb(0.3, 0.15, 0.45),
    });

    page.drawText(cleanText(info.title), {
      x: descX + 25,
      y: pageHeight / 2 + 45,
      size: 16,
      font: fontBold,
      color: rgb(0.12, 0.11, 0.14),
    });

    page.drawText(cleanText(info.description), {
      x: descX + 25,
      y: pageHeight / 2 + 10,
      size: 11,
      font: fontRegular,
      color: rgb(0.35, 0.32, 0.4),
      maxWidth: descW - 50,
      lineHeight: 16,
    });

    const bulletLines = [
      '- Optimized for one-thumb reachability',
      '- Floating island bottom navigation bar',
      '- Client-side local execution without network latency'
    ];
    let bY = pageHeight / 2 - 45;
    for (const line of bulletLines) {
      page.drawText(cleanText(line), {
        x: descX + 25,
        y: bY,
        size: 10,
        font: fontRegular,
        color: rgb(0.45, 0.4, 0.5),
      });
      bY -= 18;
    }
  }
}

function createSummarySlide(pdfDoc, fontBold, fontRegular, width, height) {
  const page = pdfDoc.addPage([width, height]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.957, 0.925, 0.973),
  });

  page.drawRectangle({
    x: 80,
    y: 80,
    width: width - 160,
    height: height - 160,
    color: rgb(1, 1, 1),
    borderWidth: 1,
    borderColor: rgb(0.9, 0.85, 0.95),
  });

  page.drawRectangle({
    x: 130,
    y: height - 170,
    width: 200,
    height: 32,
    color: rgb(0.843, 0.969, 0.357),
  });
  page.drawText(cleanText('TECHNICAL SPECIFICATIONS'), {
    x: 145,
    y: height - 158,
    size: 12,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  page.drawText(cleanText('Z LAB Architecture & Feature Matrix'), {
    x: 130,
    y: height - 225,
    size: 30,
    font: fontBold,
    color: rgb(0.12, 0.11, 0.14),
  });

  const categories = [
    { name: '1. Creative Studio', count: '16 Tools', tech: 'HTML5 Canvas 2D API, Blob URL streaming, WebP & JPEG encoders' },
    { name: '2. PDF & Documents', count: '6 Tools', tech: 'WebAssembly pdf-lib runtime, in-memory PDF page manipulation' },
    { name: '3. Text & Writing', count: '8 Tools', tech: 'RegExp word frequency engines, Web Speech API synthesis' },
    { name: '4. Study & Focus', count: '3 Tools', tech: 'Web Audio API ambient white noise oscillator, Lo-Fi synthesizer' },
    { name: '5. Dev Utilities', count: '6 Tools', tech: 'QR Matrix math, Barcode canvas renderer, Base64 streaming' },
    { name: '6. Privacy & Security', count: '5 Tools', tech: 'WebCrypto getRandomValues, SHA-256 / SHA-512 browser digest' },
  ];

  let catY = height - 280;
  for (const cat of categories) {
    page.drawRectangle({
      x: 130,
      y: catY - 25,
      width: width - 260,
      height: 48,
      color: rgb(0.98, 0.97, 0.99),
      borderWidth: 1,
      borderColor: rgb(0.93, 0.9, 0.96),
    });

    page.drawText(cleanText(cat.name), {
      x: 150,
      y: catY - 3,
      size: 14,
      font: fontBold,
      color: rgb(0.12, 0.11, 0.14),
    });

    page.drawText(cleanText(cat.count), {
      x: 350,
      y: catY - 3,
      size: 12,
      font: fontBold,
      color: rgb(0.5, 0.2, 0.7),
    });

    page.drawText(cleanText(cat.tech), {
      x: 460,
      y: catY - 3,
      size: 11,
      font: fontRegular,
      color: rgb(0.4, 0.38, 0.45),
    });

    catY -= 58;
  }

  // Footer status
  page.drawText(cleanText('Total Tools: 44 client-side utilities | Server Uploads: 0 bytes | Privacy Guarantee: 100% In-RAM'), {
    x: 130,
    y: 120,
    size: 12,
    font: fontBold,
    color: rgb(0.12, 0.6, 0.3),
  });
}

generatePdfReport().catch(err => {
  console.error('Fatal error during PDF generation:', err);
  process.exit(1);
});
