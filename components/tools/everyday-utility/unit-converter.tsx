'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';

type UnitCategory = 'length' | 'mass' | 'temperature' | 'speed' | 'data';

interface UnitDef {
  label: string;
  factor: number; // Factor relative to base unit
}

const CATEGORY_UNITS: Record<UnitCategory, Record<string, UnitDef>> = {
  length: {
    m: { label: 'Meter (m)', factor: 1 },
    km: { label: 'Kilometer (km)', factor: 1000 },
    cm: { label: 'Centimeter (cm)', factor: 0.01 },
    mm: { label: 'Millimeter (mm)', factor: 0.001 },
    mi: { label: 'Mile (mi)', factor: 1609.344 },
    yd: { label: 'Yard (yd)', factor: 0.9144 },
    ft: { label: 'Foot (ft)', factor: 0.3048 },
    in: { label: 'Inch (in)', factor: 0.0254 },
  },
  mass: {
    kg: { label: 'Kilogram (kg)', factor: 1 },
    g: { label: 'Gram (g)', factor: 0.001 },
    mg: { label: 'Milligram (mg)', factor: 0.000001 },
    lb: { label: 'Pound (lb)', factor: 0.45359237 },
    oz: { label: 'Ounce (oz)', factor: 0.028349523 },
    ton: { label: 'Metric Ton (t)', factor: 1000 },
  },
  temperature: {
    c: { label: 'Celsius (°C)', factor: 1 },
    f: { label: 'Fahrenheit (°F)', factor: 1 },
    k: { label: 'Kelvin (K)', factor: 1 },
  },
  speed: {
    mps: { label: 'Meters/second (m/s)', factor: 1 },
    kmh: { label: 'Kilometers/hour (km/h)', factor: 0.2777777778 },
    mph: { label: 'Miles/hour (mph)', factor: 0.44704 },
    knot: { label: 'Knot (kn)', factor: 0.5144444444 },
  },
  data: {
    b: { label: 'Bytes (B)', factor: 1 },
    kb: { label: 'Kilobytes (KB)', factor: 1024 },
    mb: { label: 'Megabytes (MB)', factor: 1024 * 1024 },
    gb: { label: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
    tb: { label: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 },
  },
};

export function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [fromValue, setFromValue] = useState<number | ''>(1);

  const units = CATEGORY_UNITS[category];

  // Reset units when category changes
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(CATEGORY_UNITS[cat]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const convertedValue = useMemo(() => {
    if (fromValue === '' || isNaN(Number(fromValue))) return '';
    const val = Number(fromValue);

    if (category === 'temperature') {
      if (fromUnit === toUnit) return val;
      // Convert fromUnit to Celsius
      let celsius = val;
      if (fromUnit === 'f') celsius = (val - 32) * (5 / 9);
      if (fromUnit === 'k') celsius = val - 273.15;

      // Convert Celsius to toUnit
      if (toUnit === 'c') return parseFloat(celsius.toFixed(4));
      if (toUnit === 'f') return parseFloat((celsius * (9 / 5) + 32).toFixed(4));
      if (toUnit === 'k') return parseFloat((celsius + 273.15).toFixed(4));
      return celsius;
    }

    const fromFactor = units[fromUnit]?.factor || 1;
    const toFactor = units[toUnit]?.factor || 1;
    const baseValue = val * fromFactor;
    const result = baseValue / toFactor;
    return parseFloat(result.toFixed(6));
  }, [category, fromUnit, toUnit, fromValue, units]);

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {(['length', 'mass', 'temperature', 'speed', 'data'] as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Converter inputs */}
      <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4">
        {/* From side */}
        <div className="md:col-span-3 space-y-2">
          <label className="block text-xs font-semibold text-gray-600">From</label>
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full rounded-xl border border-gray-300 p-3 text-lg font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm outline-none"
          >
            {Object.entries(units).map(([key, def]) => (
              <option key={key} value={key}>
                {def.label}
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="md:col-span-1 flex justify-center py-2 md:py-0">
          <button
            type="button"
            onClick={handleSwap}
            className="rounded-full border border-gray-200 bg-white p-2.5 text-gray-600 hover:bg-gray-100 hover:text-blue-600 shadow-sm transition"
            title="Swap units"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        {/* To side */}
        <div className="md:col-span-3 space-y-2">
          <label className="block text-xs font-semibold text-gray-600">To</label>
          <input
            type="text"
            readOnly
            value={convertedValue}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-lg font-bold text-blue-600 outline-none"
          />
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm outline-none"
          >
            {Object.entries(units).map(([key, def]) => (
              <option key={key} value={key}>
                {def.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
