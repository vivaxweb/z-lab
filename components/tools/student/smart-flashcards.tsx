'use client';

import React, { useState } from 'react';
import { Plus, Trash2, RotateCw, Check, X, Shuffle, Download, Upload } from 'lucide-react';
import { downloadBlob } from '@/lib/download-utils';

interface Card {
  id: string;
  front: string;
  back: string;
}

const DEFAULT_CARDS: Card[] = [
  {
    id: '1',
    front: 'What is the Time Complexity of Binary Search?',
    back: 'O(log n) logarithmic time complexity.',
  },
  {
    id: '2',
    front: 'What is Client-Side Computing?',
    back: 'Running operations and algorithms directly within the user\'s local browser/device without sending data to a remote backend server.',
  },
  {
    id: '3',
    front: 'What does AES-256 stand for in cryptography?',
    back: 'Advanced Encryption Standard with a 256-bit symmetric key length.',
  },
  {
    id: '4',
    front: 'What is the Web Crypto API?',
    back: 'A native JavaScript API providing cryptographic operations (hashing, signing, key generation, encryption) directly in modern browsers.',
  },
];

export function SmartFlashcardsTool() {
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [mode, setMode] = useState<'study' | 'edit'>('study');
  const [newFront, setNewFront] = useState<string>('');
  const [newBack, setNewBack] = useState<string>('');
  const [score, setScore] = useState<{ known: number; review: number }>({ known: 0, review: 0 });

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = (known: boolean) => {
    setIsFlipped(false);
    if (known) setScore((prev) => ({ ...prev, known: prev.known + 1 }));
    else setScore((prev) => ({ ...prev, review: prev.review + 1 }));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const card: Card = {
      id: crypto.randomUUID(),
      front: newFront.trim(),
      back: newBack.trim(),
    };
    setCards([...cards, card]);
    setNewFront('');
    setNewBack('');
  };

  const deleteCard = (id: string) => {
    if (cards.length <= 1) return;
    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);
    if (currentIndex >= updated.length) setCurrentIndex(0);
  };

  const exportDeck = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'flashcards_deck.json');
  };

  const importDeck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0) {
          setCards(imported);
          setCurrentIndex(0);
          setIsFlipped(false);
        }
      } catch {
        alert('Invalid JSON flashcard file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('study');
              setIsFlipped(false);
            }}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${
              mode === 'study' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Study Mode
          </button>
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${
              mode === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Deck Editor ({cards.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'study' && (
            <button
              type="button"
              onClick={shuffleCards}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
              title="Shuffle deck"
            >
              <Shuffle className="h-3.5 w-3.5" /> Shuffle
            </button>
          )}
          <button
            type="button"
            onClick={exportDeck}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            title="Download JSON deck"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <label className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer">
            <Upload className="h-3.5 w-3.5" /> Import
            <input type="file" accept=".json" onChange={importDeck} className="hidden" />
          </label>
        </div>
      </div>

      {mode === 'study' ? (
        <div className="space-y-6">
          {/* Card Progress */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-green-600 font-bold">Known: {score.known}</span>
              <span className="text-amber-600 font-bold">Review: {score.review}</span>
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative h-72 w-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center justify-center text-center select-none"
          >
            <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {isFlipped ? 'Answer' : 'Question'} (Click to flip)
            </span>

            <p className="text-lg font-bold text-gray-900 max-w-lg leading-relaxed">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>

            <span className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-gray-400">
              <RotateCw className="h-3.5 w-3.5" /> Tap to reveal
            </span>
          </div>

          {/* Action rating buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleNext(false)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 text-xs font-bold text-amber-800 hover:bg-amber-100 shadow-sm transition"
            >
              <X className="h-4 w-4" /> Need Review
            </button>
            <button
              type="button"
              onClick={() => handleNext(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-6 py-3 text-xs font-bold text-green-800 hover:bg-green-100 shadow-sm transition"
            >
              <Check className="h-4 w-4" /> I Knew It
            </button>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Add New Card Form */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3">
            <span className="text-xs font-bold uppercase text-gray-700 block">Add New Card</span>
            <input
              type="text"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="Front (Question / Prompt)..."
              className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-xs outline-none focus:border-blue-500"
            />
            <textarea
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              rows={2}
              placeholder="Back (Answer / Explanation)..."
              className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-xs outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addCard}
              disabled={!newFront.trim() || !newBack.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" /> Add to Deck
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {cards.map((c, idx) => (
              <div
                key={c.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-xs shadow-sm"
              >
                <div className="flex-1 space-y-1">
                  <span className="font-bold text-gray-400">Card #{idx + 1}</span>
                  <p className="font-semibold text-gray-900">{c.front}</p>
                  <p className="text-gray-500">{c.back}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCard(c.id)}
                  disabled={cards.length <= 1}
                  className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
