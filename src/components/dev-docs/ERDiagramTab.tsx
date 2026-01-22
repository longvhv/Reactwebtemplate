/**
 * ERD Diagram Tab Component
 * Displays Entity Relationship Diagram
 */

import { useState } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { GitBranch, Filter, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ERDiagram } from '../database/ERDiagram';
import { getFeatureGroups, generateERDForGroups } from '../../data/database-schema';

export function ERDiagramTab() {
  const { t } = useLanguage();
  const [selectedFeatureGroups, setSelectedFeatureGroups] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="bg-card rounded-xl border border-border/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {t('database.filterGroups')}
            </span>
            {selectedFeatureGroups.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedFeatureGroups.length}
              </Badge>
            )}
          </div>
          {selectedFeatureGroups.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setSelectedFeatureGroups([])}
            >
              <X className="w-3 h-3 mr-1" />
              {t('database.clear')}
            </Button>
          )}
        </div>

        {/* Feature Group Badges */}
        <div className="flex flex-wrap gap-2">
          {getFeatureGroups().map((group) => {
            const isSelected = selectedFeatureGroups.includes(group);
            return (
              <Badge
                key={group}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1.5"
                onClick={() => {
                  if (isSelected) {
                    setSelectedFeatureGroups(selectedFeatureGroups.filter((g) => g !== group));
                  } else {
                    setSelectedFeatureGroups([...selectedFeatureGroups, group]);
                  }
                }}
              >
                {group}
              </Badge>
            );
          })}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted-foreground mt-3">
          {selectedFeatureGroups.length === 0
            ? '💡 Chọn nhóm tính năng để lọc sơ đồ ERD'
            : `✓ Đang hiển thị ${selectedFeatureGroups.length} nhóm`}
        </p>
      </div>

      {/* ERD Diagram Card */}
      <div className="bg-card rounded-xl border border-border/40 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GitBranch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('database.erdTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('database.erdSubtitle')}</p>
            </div>
          </div>
          <ERDiagram diagram={generateERDForGroups(selectedFeatureGroups)} />
        </div>
      </div>
    </div>
  );
}
