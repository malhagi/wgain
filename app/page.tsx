'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Book, FileText, PenTool, TrendingUp } from 'lucide-react';
import { getOrInitializeProgress } from '@/lib/utils/storage';
import { calculateOverallStats, calculateSectionStats } from '@/lib/learning/progressTracker';
import type { UserProgress } from '@/types';

export default function Dashboard() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [overallStats, setOverallStats] = useState<any>(null);

  useEffect(() => {
    const userProgress = getOrInitializeProgress();
    setProgress(userProgress);
    setOverallStats(calculateOverallStats(userProgress));
  }, []);

  const sections = [
    {
      name: 'Vocabulary',
      href: '/vocabulary',
      icon: Book,
      color: 'bg-blue-500',
      stats: progress ? calculateSectionStats(progress, 'vocabulary') : null,
    },
    {
      name: 'Sentences',
      href: '/sentences',
      icon: FileText,
      color: 'bg-green-500',
      stats: progress ? calculateSectionStats(progress, 'sentence') : null,
    },
    {
      name: 'Reading',
      href: '/reading',
      icon: BookOpen,
      color: 'bg-purple-500',
      stats: progress ? calculateSectionStats(progress, 'reading') : null,
    },
    {
      name: 'Writing',
      href: '/writing',
      icon: PenTool,
      color: 'bg-orange-500',
      stats: null,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
      {/* Header with iOS style */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1 text-black tracking-tight">包子 HSK 3</h1>
        <p className="text-sm text-blue-600 font-medium">Chinese Learning Made Easy</p>
      </div>

      {overallStats && (
        <div className="ios-card p-5 mb-6 transition-ios">
          <h2 className="text-lg font-bold mb-4 flex items-center text-black">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-2 shadow-sm">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            Overall Progress
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200/50 shadow-sm transition-ios hover:shadow-md active:scale-95">
              <div className="text-xs font-bold text-blue-900 mb-1">Total Items</div>
              <div className="text-3xl font-bold text-blue-600">{overallStats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200/50 shadow-sm transition-ios hover:shadow-md active:scale-95">
              <div className="text-xs font-bold text-purple-900 mb-1">New</div>
              <div className="text-3xl font-bold text-purple-600">{overallStats.new}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200/50 shadow-sm transition-ios hover:shadow-md active:scale-95">
              <div className="text-xs font-bold text-orange-900 mb-1">Learning</div>
              <div className="text-3xl font-bold text-orange-600">{overallStats.learning}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200/50 shadow-sm transition-ios hover:shadow-md active:scale-95">
              <div className="text-xs font-bold text-green-900 mb-1">Mastered</div>
              <div className="text-3xl font-bold text-green-600">{overallStats.mastered}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const progressPercent = section.stats && section.stats.total > 0
            ? Math.round((section.stats.mastered / section.stats.total) * 100)
            : 0;

          return (
            <Link
              key={section.href}
              href={section.href}
              className="block ios-card p-5 transition-ios hover:shadow-lg active:scale-98"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`${section.color} w-12 h-12 rounded-2xl flex items-center justify-center mr-3 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-bold text-black">{section.name}</h2>
                </div>
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {section.stats && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold text-black">
                    <span>Progress</span>
                    <span className="text-blue-600">{section.stats.mastered} / {section.stats.total}</span>
                  </div>
                  <div className="w-full h-3 bg-blue-50 rounded-full overflow-hidden border border-blue-100">
                    <div
                      className={`h-full ${section.color} transition-all duration-500 ease-out rounded-full`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-orange-600">📚 Learning: {section.stats.learning}</span>
                    <span className="text-blue-600">🔄 Review: {section.stats.review}</span>
                  </div>
                </div>
              )}

              {!section.stats && (
                <p className="text-sm font-semibold text-blue-600">Coming soon... 🚀</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
