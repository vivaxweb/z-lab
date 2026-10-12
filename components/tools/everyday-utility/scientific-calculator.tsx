'use client';

import React, { useState } from 'react';
import { Delete, History } from 'lucide-react';

export function ScientificCalculatorTool() {
  const [display, setDisplay] = useState<string>('0');
  const [equation, setEquation] = useState<string>('');
  const [isRad, setIsRad] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);

  const appendChar = (char: string) => {
    setDisplay((prev) => (prev === '0' || prev === 'Error' ? char : prev + char));
  };

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  };

  const evaluateScientific = (funcName: string) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      switch (funcName) {
        case 'sin':
          res = isRad ? Math.sin(val) : Math.sin((val * Math.PI) / 180);
          break;
        case 'cos':
          res = isRad ? Math.cos(val) : Math.cos((val * Math.PI) / 180);
          break;
        case 'tan':
          res = isRad ? Math.tan(val) : Math.tan((val * Math.PI) / 180);
          break;
        case 'sqrt':
          if (val < 0) throw new Error('Invalid');
          res = Math.sqrt(val);
          break;
        case 'sqr':
          res = val * val;
          break;
        case 'inv':
          if (val === 0) throw new Error('Div 0');
          res = 1 / val;
          break;
        case 'log':
          if (val <= 0) throw new Error('Invalid');
          res = Math.log10(val);
          break;
        case 'ln':
          if (val <= 0) throw new Error('Invalid');
          res = Math.log(val);
          break;
        case 'fact': {
          if (val < 0 || val > 170) throw new Error('Invalid');
          let f = 1;
          for (let i = 2; i <= Math.floor(val); i++) f *= i;
          res = f;
          break;
        }
        case 'abs':
          res = Math.abs(val);
          break;
      }

      const formatted = parseFloat(res.toFixed(8)).toString();
      setHistory((prev) => [`${funcName}(${val}) = ${formatted}`, ...prev.slice(0, 9)]);
      setDisplay(formatted);
    } catch {
      setDisplay('Error');
    }
  };

  const calculateResult = () => {
    try {
      // Clean and sanitize mathematical expression
      let expr = display.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, `${Math.PI}`).replace(/e/g, `${Math.E}`);
      // Simple safe evaluation via Function constructor limited to math characters
      if (/[^0-9+\-*/().%\s^]/.test(expr)) {
        throw new Error('Invalid expression');
      }
      expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
      expr = expr.replace(/\^/g, '**');

      const result = Function(`'use strict'; return (${expr})`)();
      if (!isFinite(result)) throw new Error('Infinite');

      const formatted = parseFloat(Number(result).toFixed(8)).toString();
      setHistory((prev) => [`${display} = ${formatted}`, ...prev.slice(0, 9)]);
      setEquation(`${display} =`);
      setDisplay(formatted);
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Calculator Body */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-lg space-y-4">
        {/* Screen */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 text-right">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-1">
            <button
              type="button"
              onClick={() => setIsRad(!isRad)}
              className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-700 uppercase"
            >
              {isRad ? 'RAD' : 'DEG'}
            </button>
            <span className="truncate">{equation}</span>
          </div>
          <div className="font-mono text-3xl font-extrabold text-gray-900 tracking-tight select-all truncate">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-5 gap-2 text-xs font-bold">
          {/* Row 1: Sci Functions */}
          <button
            type="button"
            onClick={() => evaluateScientific('sin')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            sin
          </button>
          <button
            type="button"
            onClick={() => evaluateScientific('cos')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            cos
          </button>
          <button
            type="button"
            onClick={() => evaluateScientific('tan')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            tan
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-xl bg-red-50 text-red-600 p-2.5 hover:bg-red-100"
          >
            AC
          </button>
          <button
            type="button"
            onClick={backspace}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200 flex items-center justify-center"
          >
            <Delete className="h-4 w-4" />
          </button>

          {/* Row 2: Powers & Roots */}
          <button
            type="button"
            onClick={() => evaluateScientific('sqrt')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            √
          </button>
          <button
            type="button"
            onClick={() => evaluateScientific('sqr')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            x²
          </button>
          <button
            type="button"
            onClick={() => appendChar('^')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            xʸ
          </button>
          <button
            type="button"
            onClick={() => appendChar('(')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            (
          </button>
          <button
            type="button"
            onClick={() => appendChar(')')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            )
          </button>

          {/* Row 3: Log & 7-9 */}
          <button
            type="button"
            onClick={() => evaluateScientific('log')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            log
          </button>
          <button
            type="button"
            onClick={() => appendChar('7')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => appendChar('8')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => appendChar('9')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => appendChar('÷')}
            className="rounded-xl bg-blue-50 text-blue-600 p-2.5 hover:bg-blue-100"
          >
            ÷
          </button>

          {/* Row 4: Ln & 4-6 */}
          <button
            type="button"
            onClick={() => evaluateScientific('ln')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            ln
          </button>
          <button
            type="button"
            onClick={() => appendChar('4')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => appendChar('5')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => appendChar('6')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => appendChar('×')}
            className="rounded-xl bg-blue-50 text-blue-600 p-2.5 hover:bg-blue-100"
          >
            ×
          </button>

          {/* Row 5: Factorial & 1-3 */}
          <button
            type="button"
            onClick={() => evaluateScientific('fact')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            x!
          </button>
          <button
            type="button"
            onClick={() => appendChar('1')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => appendChar('2')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => appendChar('3')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => appendChar('-')}
            className="rounded-xl bg-blue-50 text-blue-600 p-2.5 hover:bg-blue-100"
          >
            -
          </button>

          {/* Row 6: Pi & 0 & = */}
          <button
            type="button"
            onClick={() => appendChar('π')}
            className="rounded-xl bg-gray-100 p-2.5 text-gray-700 hover:bg-gray-200"
          >
            π
          </button>
          <button
            type="button"
            onClick={() => appendChar('0')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => appendChar('.')}
            className="rounded-xl bg-gray-50 border p-2.5 text-gray-900 hover:bg-gray-100"
          >
            .
          </button>
          <button
            type="button"
            onClick={calculateResult}
            className="rounded-xl bg-blue-600 text-white p-2.5 hover:bg-blue-700 shadow-sm"
          >
            =
          </button>
          <button
            type="button"
            onClick={() => appendChar('+')}
            className="rounded-xl bg-blue-50 text-blue-600 p-2.5 hover:bg-blue-100"
          >
            +
          </button>
        </div>
      </div>

      {/* History reel */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-gray-600 uppercase tracking-wider text-[11px]">
            <History className="h-3.5 w-3.5 text-blue-600" /> Calculation History
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {history.map((item, i) => (
              <div
                key={i}
                className="font-mono text-gray-600 hover:text-blue-600 cursor-pointer p-1 rounded hover:bg-white"
                onClick={() => {
                  const val = item.split('=')[1]?.trim();
                  if (val) setDisplay(val);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
