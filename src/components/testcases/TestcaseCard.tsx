/**
 * TestcaseCard Component
 * 
 * Display individual testcase with expand/collapse functionality
 */

import { memo, useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Minus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Testcase } from '../../data/testcases';
import { useLanguage } from '../../providers/LanguageProvider';

interface TestcaseCardProps {
  testcase: Testcase;
}

/**
 * Get status color and icon
 */
function getStatusDisplay(status: Testcase['status']) {
  switch (status) {
    case 'passed':
      return {
        color: 'text-emerald-600 bg-emerald-50',
        icon: CheckCircle,
        label: 'Passed'
      };
    case 'failed':
      return {
        color: 'text-red-600 bg-red-50',
        icon: XCircle,
        label: 'Failed'
      };
    case 'pending':
      return {
        color: 'text-amber-600 bg-amber-50',
        icon: Clock,
        label: 'Pending'
      };
    case 'skipped':
      return {
        color: 'text-gray-600 bg-gray-50',
        icon: Minus,
        label: 'Skipped'
      };
  }
}

/**
 * Get priority color
 */
function getPriorityColor(priority: Testcase['priority']) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
  }
}

export const TestcaseCard = memo(({ testcase }: TestcaseCardProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const statusDisplay = getStatusDisplay(testcase.status);
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="bg-card rounded-xl border border-border/40 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                {testcase.id}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(testcase.priority)}>
                {testcase.priority.toUpperCase()}
              </Badge>
              <Badge variant="secondary">
                {testcase.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-base mb-1 line-clamp-2">
              {testcase.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {testcase.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${statusDisplay.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-xs font-medium">{statusDisplay.label}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border/40 p-4 space-y-4 bg-muted/10">
          {/* Preconditions */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Preconditions:</h4>
            <ul className="space-y-1">
              {testcase.preconditions.map((cond, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{cond}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Test Steps:</h4>
            <ol className="space-y-1.5">
              {testcase.steps.map((step, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                  <span className="font-medium text-primary">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Expected Result */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Expected Result:</h4>
            <p className="text-sm text-muted-foreground bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
              {testcase.expectedResult}
            </p>
          </div>

          {/* Actual Result (if exists) */}
          {testcase.actualResult && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Actual Result:</h4>
              <p className={`text-sm p-3 rounded-lg border ${
                testcase.status === 'passed' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
              }`}>
                {testcase.actualResult}
              </p>
            </div>
          )}

          {/* Related Items */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-border/40">
            {testcase.relatedUsecase && (
              <div className="text-xs">
                <span className="text-muted-foreground">Related Usecase: </span>
                <Badge variant="outline" className="ml-1">{testcase.relatedUsecase}</Badge>
              </div>
            )}
            {testcase.relatedAPI && testcase.relatedAPI.length > 0 && (
              <div className="text-xs">
                <span className="text-muted-foreground">Related APIs: </span>
                {testcase.relatedAPI.map((api, idx) => (
                  <Badge key={idx} variant="outline" className="ml-1">{api}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {testcase.tags && testcase.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {testcase.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Meta Info */}
          {(testcase.author || testcase.lastUpdated) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40">
              {testcase.author && <span>Author: {testcase.author}</span>}
              {testcase.lastUpdated && <span>Last Updated: {testcase.lastUpdated}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TestcaseCard.displayName = 'TestcaseCard';
