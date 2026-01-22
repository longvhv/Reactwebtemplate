/**
 * TestcaseStats Component
 * 
 * Display test statistics with visual progress
 */

import { memo } from 'react';
import { CheckCircle, XCircle, Clock, Minus, TrendingUp } from 'lucide-react';
import { getTestcaseStats } from '../../data/testcases';

interface TestcaseStatsProps {
  filteredCount?: number;
  totalCount?: number;
}

export const TestcaseStats = memo(({ filteredCount, totalCount }: TestcaseStatsProps) => {
  const stats = getTestcaseStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">TOTAL</span>
          <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
          {filteredCount !== undefined && filteredCount !== totalCount 
            ? `${filteredCount}/${stats.total}`
            : stats.total
          }
        </div>
        <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
          Test cases
        </div>
      </div>

      {/* Passed */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">PASSED</span>
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
          {stats.passed}
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
          {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}% pass rate
        </div>
      </div>

      {/* Failed */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-xl p-4 border border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-red-700 dark:text-red-300">FAILED</span>
          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-2xl font-bold text-red-900 dark:text-red-100">
          {stats.failed}
        </div>
        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
          {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}% fail rate
        </div>
      </div>

      {/* Pending */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">PENDING</span>
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
          {stats.pending}
        </div>
        <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
          Awaiting execution
        </div>
      </div>

      {/* Skipped */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">SKIPPED</span>
          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.skipped}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Not executed
        </div>
      </div>
    </div>
  );
});

TestcaseStats.displayName = 'TestcaseStats';
