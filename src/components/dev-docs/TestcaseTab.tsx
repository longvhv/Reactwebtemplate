/**
 * Testcase Tab Component
 * Displays test cases with filters and statistics
 */

import { useMemo, useState } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { Filter, Download, X, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { TestcaseCard } from '../testcases/TestcaseCard';
import { TestcaseStats } from '../testcases/TestcaseStats';
import { testcases, testcaseCategories } from '../../data/testcases';
import { generateTestcasesExcel } from '../../utils/testcaseExcelGenerator';

export function TestcaseTab({ searchQuery }: { searchQuery: string }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const filteredTestcases = useMemo(() => {
    let filtered = testcases;

    if (selectedCategory) {
      filtered = filtered.filter((testcase) => testcase.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter((testcase) => testcase.status === selectedStatus);
    }

    if (selectedPriority) {
      filtered = filtered.filter((testcase) => testcase.priority === selectedPriority);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (testcase) =>
          testcase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          testcase.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, selectedStatus, selectedPriority, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      <TestcaseStats filteredCount={filteredTestcases.length} totalCount={testcases.length} />

      {/* Header with Filters and Download */}
      <div className="space-y-4">
        {/* Category Filter Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Category:</span>
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {testcaseCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Status Filter Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <Button
            variant={selectedStatus === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus(null)}
          >
            All
          </Button>
          {['passed', 'failed', 'pending', 'skipped'].map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Priority Filter Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Priority:</span>
          <Button
            variant={selectedPriority === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPriority(null)}
          >
            All
          </Button>
          {['high', 'medium', 'low'].map((priority) => (
            <Button
              key={priority}
              variant={selectedPriority === priority ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPriority(priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Button>
          ))}
        </div>

        {/* Download and Clear Section */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredTestcases.length}</span>{' '}
            of <span className="font-medium text-foreground">{testcases.length}</span> testcases
          </div>
          <div className="flex items-center gap-2">
            {(selectedCategory || selectedStatus || selectedPriority) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedStatus(null);
                  setSelectedPriority(null);
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
            <Button
              size="default"
              onClick={async () => await generateTestcasesExcel(filteredTestcases)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {t('testcases.download')}
            </Button>
          </div>
        </div>
      </div>

      {/* Testcases List */}
      <div className="space-y-4">
        {filteredTestcases.length > 0 ? (
          filteredTestcases.map((testcase) => <TestcaseCard key={testcase.id} testcase={testcase} />)
        ) : (
          <div className="bg-card rounded-xl border border-border/40 p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('testcases.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
