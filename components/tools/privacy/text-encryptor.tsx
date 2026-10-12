'use client';

import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { ProcessButton } from '@/components/ProcessButton';

export function TextEncryptorTool() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [text, setText] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derive AES-GCM key from password and salt using PBKDF2
  const deriveKey = async (passphrase: string, salt: Uint8Array): Promise<CryptoKey> => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const handleProcess = async () => {
    setError(null);
    if (!text.trim()) {
      setError('Please provide text to process.');
      return;
    }
    if (!password) {
      setError('Please provide a secret passphrase.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'encrypt') {
        const enc = new TextEncoder();
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        const ciphertextBuffer = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
          key,
          enc.encode(text)
        );

        // Package salt, iv, and ciphertext as base64
        const payload = {
          v: 1,
          s: btoa(String.fromCharCode(...salt)),
          iv: btoa(String.fromCharCode(...iv)),
          ct: btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer))),
        };

        setResult(btoa(JSON.stringify(payload)));
      } else {
        // Decrypt
        let parsedPayload;
        try {
          const jsonStr = atob(text.trim());
          parsedPayload = JSON.parse(jsonStr);
        } catch {
          throw new Error('Invalid encrypted format. Please paste a valid encrypted string.');
        }

        const { s, iv, ct } = parsedPayload;
        if (!s || !iv || !ct) throw new Error('Missing encryption metadata in payload.');

        const salt = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
        const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
        const ciphertext = Uint8Array.from(atob(ct), (c) => c.charCodeAt(0));

        const key = await deriveKey(password, salt);
        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: ivBytes.buffer as ArrayBuffer },
          key,
          ciphertext.buffer as ArrayBuffer
        );

        const dec = new TextDecoder();
        setResult(dec.decode(decryptedBuffer));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Decryption failed. Check passphrase or input data.');
      setResult('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode switch */}
      <div className="flex rounded-lg bg-gray-100 p-1 w-fit">
        <button
          type="button"
          onClick={() => {
            setMode('encrypt');
            setResult('');
            setError(null);
          }}
          className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition ${
            mode === 'encrypt' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock className="h-4 w-4" /> Encrypt (AES-256)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('decrypt');
            setResult('');
            setError(null);
          }}
          className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition ${
            mode === 'decrypt' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Unlock className="h-4 w-4" /> Decrypt
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'encrypt' ? 'Plaintext to Encrypt' : 'Encrypted Ciphertext'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={mode === 'encrypt' ? 'Type confidential text...' : 'Paste encrypted string here...'}
            className="w-full rounded-xl border border-gray-300 p-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passphrase</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter strong passphrase..."
              className="w-full rounded-xl border border-gray-300 p-3 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <ProcessButton
          onClick={handleProcess}
          isLoading={isLoading}
          label={mode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}
          loadingLabel={mode === 'encrypt' ? 'Encrypting...' : 'Decrypting...'}
        />
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">
              {mode === 'encrypt' ? 'Encrypted Result' : 'Decrypted Plaintext'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            rows={4}
            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-xs font-mono text-gray-800 outline-none select-all break-all"
          />
        </div>
      )}
    </div>
  );
}
