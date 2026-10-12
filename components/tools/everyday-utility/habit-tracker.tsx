'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Flame, RotateCcw } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  days: boolean[]; // 7 days (Mon..Sun)
  streak: number;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Read for 20 minutes', days: [true, true, true, false, true, false, false], streak: 3 },
  { id: '2', name: 'Exercise / Workout', days: [true, false, true, true, false, true, false], streak: 2 },
  { id: '3', name: 'Drink 2L Water', days: [true, true, true, true, true, false, false], streak: 5 },
  { id: '4', name: 'Daily Code Practice', days: [true, true, true, true, false, false, false], streak: 4 },
];

export function HabitTrackerTool() {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [newHabitName, setNewHabitName] = useState<string>('');

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zlab_habits');
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => setHabits(parsed));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    try {
      localStorage.setItem('zlab_habits', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleDay = (habitId: string, dayIndex: number) => {
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const newDays = [...h.days];
        newDays[dayIndex] = !newDays[dayIndex];
        const completedCount = newDays.filter(Boolean).length;
        return { ...h, days: newDays, streak: completedCount };
      }
      return h;
    });
    saveHabits(updated);
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName.trim(),
      days: [false, false, false, false, false, false, false],
      streak: 0,
    };
    const updated = [...habits, newHabit];
    saveHabits(updated);
    setNewHabitName('');
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
  };

  const resetCurrentWeek = () => {
    const updated = habits.map((h) => ({
      ...h,
      days: [false, false, false, false, false, false, false],
      streak: 0,
    }));
    saveHabits(updated);
  };

  // Overall weekly score
  const totalChecksPossible = habits.length * 7;
  const totalCompleted = habits.reduce(
    (sum, h) => sum + h.days.filter(Boolean).length,
    0
  );
  const weeklyCompletionRate =
    totalChecksPossible > 0 ? Math.round((totalCompleted / totalChecksPossible) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner Overview */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Weekly Habit Momentum
          </span>
          <div className="flex items-baseline gap-2 justify-center sm:justify-start">
            <span className="font-mono text-4xl font-black text-gray-900">{weeklyCompletionRate}%</span>
            <span className="text-xs font-semibold text-gray-500">of weekly goals completed</span>
          </div>
          <p className="text-xs text-gray-500">
            {totalCompleted} check-ins across {habits.length} habits this week.
          </p>
        </div>

        <button
          type="button"
          onClick={resetCurrentWeek}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Week
        </button>
      </div>

      {/* Add Habit Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addHabit();
          }}
          placeholder="Enter a new daily habit (e.g., Floss teeth, Meditate 10m)..."
          className="flex-1 rounded-xl border border-gray-300 p-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addHabit}
          disabled={!newHabitName.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Habit
        </button>
      </div>

      {/* Habits Matrix Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-1/3">Habit</th>
                <th className="py-3 px-2 text-center w-16">Streak</th>
                {DAYS_OF_WEEK.map((day) => (
                  <th key={day} className="py-3 px-2 text-center w-10">
                    {day}
                  </th>
                ))}
                <th className="py-3 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {habits.map((habit) => (
                <tr key={habit.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-gray-900 truncate max-w-[200px]">
                    {habit.name}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                      <Flame className="h-3 w-3 fill-current text-amber-500" />
                      {habit.streak}
                    </span>
                  </td>
                  {habit.days.map((checked, dayIdx) => (
                    <td key={dayIdx} className="py-3.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => toggleDay(habit.id, dayIdx)}
                        className={`h-7 w-7 rounded-lg flex items-center justify-center transition border ${
                          checked
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                        title={`${DAYS_OF_WEEK[dayIdx]}: ${checked ? 'Completed' : 'Pending'}`}
                      >
                        {checked && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>
                    </td>
                  ))}
                  <td className="py-3.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1 text-gray-300 hover:text-red-600"
                      title="Delete habit"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
