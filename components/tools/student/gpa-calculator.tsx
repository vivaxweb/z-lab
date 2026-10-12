'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Award, RotateCcw } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const US_GRADES: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0.0,
};

const CGPA_GRADES: Record<string, number> = {
  O: 10.0,
  'A+': 9.0,
  A: 8.0,
  'B+': 7.0,
  B: 6.0,
  C: 5.0,
  P: 4.0,
  F: 0.0,
};

const DEFAULT_COURSES: Course[] = [
  { id: '1', name: 'Computer Science 101', grade: 'A', credits: 4 },
  { id: '2', name: 'Calculus I', grade: 'A-', credits: 4 },
  { id: '3', name: 'Academic Writing & Research', grade: 'B+', credits: 3 },
  { id: '4', name: 'Physics Mechanics', grade: 'A', credits: 3 },
];

export function GpaCalculatorTool() {
  const [scale, setScale] = useState<'4.0' | '10.0'>('4.0');
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);

  const gradeMap = scale === '4.0' ? US_GRADES : CGPA_GRADES;

  const { gpa, totalCredits, totalPoints } = useMemo(() => {
    let pts = 0;
    let creds = 0;

    courses.forEach((c) => {
      const pointVal = gradeMap[c.grade] ?? (scale === '4.0' ? 4.0 : 8.0);
      pts += pointVal * c.credits;
      creds += c.credits;
    });

    const calculatedGpa = creds > 0 ? (pts / creds).toFixed(2) : '0.00';
    return { gpa: calculatedGpa, totalCredits: creds, totalPoints: pts.toFixed(1) };
  }, [courses, gradeMap, scale]);

  const addCourse = () => {
    const defaultGrade = scale === '4.0' ? 'A' : 'A+';
    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: `Course ${courses.length + 1}`,
      grade: defaultGrade,
      credits: 3,
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  const resetCourses = () => {
    setCourses(DEFAULT_COURSES);
  };

  const getDistinction = (num: number) => {
    if (scale === '4.0') {
      if (num >= 3.8) return { label: 'Summa Cum Laude / Dean\'s List', color: 'text-green-700 bg-green-50' };
      if (num >= 3.5) return { label: 'Magna Cum Laude', color: 'text-blue-700 bg-blue-50' };
      if (num >= 3.0) return { label: 'Good Standing', color: 'text-indigo-700 bg-indigo-50' };
      return { label: 'Academic Alert', color: 'text-amber-700 bg-amber-50' };
    } else {
      if (num >= 9.0) return { label: 'Outstanding (First Class Distinction)', color: 'text-green-700 bg-green-50' };
      if (num >= 8.0) return { label: 'First Class', color: 'text-blue-700 bg-blue-50' };
      if (num >= 6.5) return { label: 'Second Class', color: 'text-indigo-700 bg-indigo-50' };
      return { label: 'Pass', color: 'text-amber-700 bg-amber-50' };
    }
  };

  const distinction = getDistinction(Number(gpa));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Scale Switcher */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setScale('4.0');
              setCourses(DEFAULT_COURSES);
            }}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${
              scale === '4.0' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            USA 4.0 Scale (GPA)
          </button>
          <button
            type="button"
            onClick={() => {
              setScale('10.0');
              setCourses([
                { id: '1', name: 'Course 1', grade: 'O', credits: 4 },
                { id: '2', name: 'Course 2', grade: 'A+', credits: 4 },
                { id: '3', name: 'Course 3', grade: 'A', credits: 3 },
              ]);
            }}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${
              scale === '10.0' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            10.0 Scale (CGPA)
          </button>
        </div>

        <button
          type="button"
          onClick={resetCourses}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* GPA Banner Result */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            {scale === '4.0' ? 'Calculated GPA (4.0 Max)' : 'Calculated CGPA (10.0 Max)'}
          </span>
          <div className="flex items-baseline gap-2 justify-center sm:justify-start">
            <span className="font-mono text-5xl font-black text-blue-900">{gpa}</span>
            <span className="text-sm font-semibold text-gray-400">/ {scale}</span>
          </div>
          <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${distinction.color}`}>
            <Award className="h-3.5 w-3.5" /> {distinction.label}
          </div>
        </div>

        <div className="flex sm:flex-col gap-4 text-xs text-gray-600 font-medium">
          <div className="bg-white/80 rounded-xl px-4 py-2 border shadow-sm">
            <span className="text-gray-400 block text-[10px] uppercase">Total Credits</span>
            <span className="font-bold text-gray-800 text-sm">{totalCredits}</span>
          </div>
          <div className="bg-white/80 rounded-xl px-4 py-2 border shadow-sm">
            <span className="text-gray-400 block text-[10px] uppercase">Grade Points</span>
            <span className="font-bold text-gray-800 text-sm">{totalPoints}</span>
          </div>
        </div>
      </div>

      {/* Course List Rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Course Breakdown</span>
          <button
            type="button"
            onClick={addCourse}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Course
          </button>
        </div>

        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-12 items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:border-blue-300 transition"
            >
              <div className="col-span-6 sm:col-span-6">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  className="w-full rounded-md border border-gray-200 p-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-blue-400"
                  placeholder="Course Name..."
                />
              </div>

              <div className="col-span-3 sm:col-span-3">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-gray-50 p-1.5 text-xs font-bold text-blue-700 outline-none"
                >
                  {Object.keys(gradeMap).map((g) => (
                    <option key={g} value={g}>
                      {g} ({gradeMap[g]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-2">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-md border border-gray-200 p-1.5 text-xs font-semibold text-center outline-none"
                  title="Credits"
                />
              </div>

              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length <= 1}
                  className="p-1 text-gray-300 hover:text-red-600 disabled:opacity-20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
