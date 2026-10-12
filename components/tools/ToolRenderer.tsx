'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { ToolConfig } from '@/lib/tools-registry';
import { ToolComingSoon } from '@/components/ToolComingSoon';

// Loading placeholder while the specific tool's client bundle loads
const ToolLoading = () => (
  <div className="flex items-center justify-center py-16 text-xs text-gray-500 animate-pulse">
    Loading tool workspace...
  </div>
);

// Dynamic lazy imports for every tool
// Privacy
const PasswordGeneratorTool = dynamic(
  () => import('./privacy/password-generator').then((m) => m.PasswordGeneratorTool),
  { loading: ToolLoading }
);
const HashGeneratorTool = dynamic(
  () => import('./privacy/hash-generator').then((m) => m.HashGeneratorTool),
  { loading: ToolLoading }
);
const Base64EncoderTool = dynamic(
  () => import('./privacy/base64-encoder').then((m) => m.Base64EncoderTool),
  { loading: ToolLoading }
);
const TextEncryptorTool = dynamic(
  () => import('./privacy/text-encryptor').then((m) => m.TextEncryptorTool),
  { loading: ToolLoading }
);
const ExifRemoverTool = dynamic(
  () => import('./privacy/exif-remover').then((m) => m.ExifRemoverTool),
  { loading: ToolLoading }
);

// Link & Code
const QrGeneratorTool = dynamic(
  () => import('./link-code/qr-generator').then((m) => m.QrGeneratorTool),
  { loading: ToolLoading }
);
const BarcodeGeneratorTool = dynamic(
  () => import('./link-code/barcode-generator').then((m) => m.BarcodeGeneratorTool),
  { loading: ToolLoading }
);
const UrlEncoderTool = dynamic(
  () => import('./link-code/url-encoder').then((m) => m.UrlEncoderTool),
  { loading: ToolLoading }
);
const QrScannerTool = dynamic(
  () => import('./link-code/qr-scanner').then((m) => m.QrScannerTool),
  { loading: ToolLoading }
);

// Everyday Utility
const UuidGeneratorTool = dynamic(
  () => import('./everyday-utility/uuid-generator').then((m) => m.UuidGeneratorTool),
  { loading: ToolLoading }
);
const UnitConverterTool = dynamic(
  () => import('./everyday-utility/unit-converter').then((m) => m.UnitConverterTool),
  { loading: ToolLoading }
);
const ColorConverterTool = dynamic(
  () => import('./everyday-utility/color-converter').then((m) => m.ColorConverterTool),
  { loading: ToolLoading }
);
const CssGradientGeneratorTool = dynamic(
  () => import('./everyday-utility/css-gradient-generator').then((m) => m.CssGradientGeneratorTool),
  { loading: ToolLoading }
);
const RandomDataGeneratorTool = dynamic(
  () => import('./everyday-utility/random-data-generator').then((m) => m.RandomDataGeneratorTool),
  { loading: ToolLoading }
);
const WhiteNoiseGeneratorTool = dynamic(
  () => import('./everyday-utility/white-noise-generator').then((m) => m.WhiteNoiseGeneratorTool),
  { loading: ToolLoading }
);
const HabitTrackerTool = dynamic(
  () => import('./everyday-utility/habit-tracker').then((m) => m.HabitTrackerTool),
  { loading: ToolLoading }
);
const ScientificCalculatorTool = dynamic(
  () => import('./everyday-utility/scientific-calculator').then((m) => m.ScientificCalculatorTool),
  { loading: ToolLoading }
);
const CsvEditorTool = dynamic(
  () => import('./everyday-utility/csv-editor').then((m) => m.CsvEditorTool),
  { loading: ToolLoading }
);

// Content Creator - Images
const ImageResizerTool = dynamic(
  () => import('./content-creator/image-resizer').then((m) => m.ImageResizerTool),
  { loading: ToolLoading }
);
const ImageCompressorTool = dynamic(
  () => import('./content-creator/image-compressor').then((m) => m.ImageCompressorTool),
  { loading: ToolLoading }
);
const MemeGeneratorTool = dynamic(
  () => import('./content-creator/meme-generator').then((m) => m.MemeGeneratorTool),
  { loading: ToolLoading }
);
const PhotoCollageTool = dynamic(
  () => import('./content-creator/photo-collage').then((m) => m.PhotoCollageTool),
  { loading: ToolLoading }
);
const ImageFiltersTool = dynamic(
  () => import('./content-creator/image-filters').then((m) => m.ImageFiltersTool),
  { loading: ToolLoading }
);
const ImageWatermarkTool = dynamic(
  () => import('./content-creator/image-watermark').then((m) => m.ImageWatermarkTool),
  { loading: ToolLoading }
);
const ColorPaletteExtractorTool = dynamic(
  () => import('./content-creator/color-palette-extractor').then((m) => m.ColorPaletteExtractorTool),
  { loading: ToolLoading }
);
const FaviconResizerTool = dynamic(
  () => import('./content-creator/favicon-resizer').then((m) => m.FaviconResizerTool),
  { loading: ToolLoading }
);
const ThumbnailCreatorTool = dynamic(
  () => import('./content-creator/thumbnail-creator').then((m) => m.ThumbnailCreatorTool),
  { loading: ToolLoading }
);
const ImageFormatConverterTool = dynamic(
  () => import('./content-creator/image-format-converter').then((m) => m.ImageFormatConverterTool),
  { loading: ToolLoading }
);

// Content Creator - PDF
const ImageToPdfTool = dynamic(
  () => import('./content-creator/image-to-pdf').then((m) => m.ImageToPdfTool),
  { loading: ToolLoading }
);
const PdfMergeTool = dynamic(
  () => import('./content-creator/pdf-merge').then((m) => m.PdfMergeTool),
  { loading: ToolLoading }
);
const PdfSplitTool = dynamic(
  () => import('./content-creator/pdf-split').then((m) => m.PdfSplitTool),
  { loading: ToolLoading }
);
const PdfReorderTool = dynamic(
  () => import('./content-creator/pdf-reorder').then((m) => m.PdfReorderTool),
  { loading: ToolLoading }
);
const PdfCompressorTool = dynamic(
  () => import('./content-creator/pdf-compressor').then((m) => m.PdfCompressorTool),
  { loading: ToolLoading }
);
const PdfRotatorTool = dynamic(
  () => import('./content-creator/pdf-rotator').then((m) => m.PdfRotatorTool),
  { loading: ToolLoading }
);

// Student
const WordCounterTool = dynamic(
  () => import('./student/word-counter').then((m) => m.WordCounterTool),
  { loading: ToolLoading }
);
const CaseConverterTool = dynamic(
  () => import('./student/case-converter').then((m) => m.CaseConverterTool),
  { loading: ToolLoading }
);
const TextToSpeechTool = dynamic(
  () => import('./student/text-to-speech').then((m) => m.TextToSpeechTool),
  { loading: ToolLoading }
);
const MarkdownPreviewerTool = dynamic(
  () => import('./student/markdown-previewer').then((m) => m.MarkdownPreviewerTool),
  { loading: ToolLoading }
);
const PomodoroTimerTool = dynamic(
  () => import('./student/pomodoro-timer').then((m) => m.PomodoroTimerTool),
  { loading: ToolLoading }
);
const SmartFlashcardsTool = dynamic(
  () => import('./student/smart-flashcards').then((m) => m.SmartFlashcardsTool),
  { loading: ToolLoading }
);
const CitationGeneratorTool = dynamic(
  () => import('./student/citation-generator').then((m) => m.CitationGeneratorTool),
  { loading: ToolLoading }
);
const GpaCalculatorTool = dynamic(
  () => import('./student/gpa-calculator').then((m) => m.GpaCalculatorTool),
  { loading: ToolLoading }
);
const RichTextEditorTool = dynamic(
  () => import('./student/rich-text-editor').then((m) => m.RichTextEditorTool),
  { loading: ToolLoading }
);
const CharacterCounterTool = dynamic(
  () => import('./student/character-counter').then((m) => m.CharacterCounterTool),
  { loading: ToolLoading }
);

export function ToolRenderer({ tool }: { tool: ToolConfig }) {
  switch (tool.slug) {
    // Privacy
    case 'password-generator':
      return <PasswordGeneratorTool />;
    case 'hash-generator':
      return <HashGeneratorTool />;
    case 'base64-encoder':
      return <Base64EncoderTool />;
    case 'text-encryptor':
      return <TextEncryptorTool />;
    case 'exif-remover':
      return <ExifRemoverTool />;

    // Link & Code
    case 'qr-generator':
      return <QrGeneratorTool />;
    case 'barcode-generator':
      return <BarcodeGeneratorTool />;
    case 'url-encoder':
      return <UrlEncoderTool />;
    case 'qr-scanner':
      return <QrScannerTool />;

    // Everyday Utility
    case 'uuid-generator':
      return <UuidGeneratorTool />;
    case 'unit-converter':
      return <UnitConverterTool />;
    case 'color-converter':
      return <ColorConverterTool />;
    case 'css-gradient-generator':
      return <CssGradientGeneratorTool />;
    case 'random-data-generator':
      return <RandomDataGeneratorTool />;
    case 'white-noise-generator':
      return <WhiteNoiseGeneratorTool />;
    case 'habit-tracker':
      return <HabitTrackerTool />;
    case 'scientific-calculator':
      return <ScientificCalculatorTool />;
    case 'csv-editor':
      return <CsvEditorTool />;

    // Content Creator - Image
    case 'image-resizer':
      return <ImageResizerTool />;
    case 'image-compressor':
      return <ImageCompressorTool />;
    case 'meme-generator':
      return <MemeGeneratorTool />;
    case 'photo-collage':
      return <PhotoCollageTool />;
    case 'image-filters':
      return <ImageFiltersTool />;
    case 'image-watermark':
      return <ImageWatermarkTool />;
    case 'color-palette-extractor':
      return <ColorPaletteExtractorTool />;
    case 'favicon-resizer':
      return <FaviconResizerTool />;
    case 'thumbnail-creator':
      return <ThumbnailCreatorTool />;
    case 'image-format-converter':
      return <ImageFormatConverterTool />;

    // Content Creator - PDF
    case 'image-to-pdf':
      return <ImageToPdfTool />;
    case 'pdf-merge':
      return <PdfMergeTool />;
    case 'pdf-split':
      return <PdfSplitTool />;
    case 'pdf-reorder':
      return <PdfReorderTool />;
    case 'pdf-compressor':
      return <PdfCompressorTool />;
    case 'pdf-rotator':
      return <PdfRotatorTool />;

    // Student
    case 'word-counter':
      return <WordCounterTool />;
    case 'case-converter':
      return <CaseConverterTool />;
    case 'text-to-speech':
      return <TextToSpeechTool />;
    case 'markdown-previewer':
      return <MarkdownPreviewerTool />;
    case 'pomodoro-timer':
      return <PomodoroTimerTool />;
    case 'smart-flashcards':
      return <SmartFlashcardsTool />;
    case 'citation-generator':
      return <CitationGeneratorTool />;
    case 'gpa-calculator':
      return <GpaCalculatorTool />;
    case 'rich-text-editor':
      return <RichTextEditorTool />;
    case 'character-counter':
      return <CharacterCounterTool />;

    default:
      return <ToolComingSoon toolTitle={tool.title} />;
  }
}
