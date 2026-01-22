/**
 * SRS (Software Requirements Specification) Tab Component
 * Displays use cases and requirements
 */

import { useMemo, useState } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { FileText, Download, Filter, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { UsecaseCard } from '../usecases/UsecaseCard';
import { usecases, usecaseCategories } from '../../data/usecases';
import { generateAllUsecasesDocx } from '../../utils/usecaseDocGenerator';

export function SRSTab({ searchQuery }: { searchQuery: string }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredUsecases = useMemo(() => {
    let filtered = usecases;

    if (selectedCategory) {
      filtered = filtered.filter((usecase) => usecase.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (usecase) =>
          usecase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          usecase.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header with Download Button */}
      <div className="flex items-center justify-between gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            {t('usecases.allCategories')}
          </Button>
          {usecaseCategories.map((category) => (
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

        {/* Download Button */}
        <Button
          size="default"
          onClick={() => generateAllUsecasesDocx(usecases)}
          className="gap-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          {t('usecases.download')}
        </Button>
      </div>

      {/* Usecases List */}
      <div className="space-y-4">
        {filteredUsecases.length > 0 ? (
          filteredUsecases.map((usecase) => <UsecaseCard key={usecase.id} usecase={usecase} />)
        ) : (
          <div className="bg-card rounded-xl border border-border/40 p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('usecases.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
