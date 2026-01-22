'use client';

/**
 * Database Documentation Page - Main Implementation
 * 
 * Location: /app/(dashboard)/database-docs/page.tsx
 * Purpose: Next.js App Router ready - Code chính ở đây
 * 
 * Trang tài liệu mô tả các bảng dữ liệu của hệ thống
 */

import { memo, useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { databaseSchema, getFeatureGroups, generateERDForGroups } from '@/data/database-schema';
import { DatabaseTable } from '@/components/database/DatabaseTable';
import { ERDiagram } from '@/components/database/ERDiagram';
import { Database, GitBranch, Search, Table, FileText, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function DatabaseDocsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tables');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Get feature groups
  const featureGroups = getFeatureGroups();
  
  // Debug log
  console.log('Database Schema:', databaseSchema);
  console.log('Feature Groups:', featureGroups);

  // Filter tables based on search query
  const filteredTables = databaseSchema.filter(table => 
    table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.columns.some(col => 
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Generate ERD for selected groups
  const erdDiagram = generateERDForGroups(selectedGroups);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20">
            <Database className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('database.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('database.description')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-card rounded-xl border border-border/40 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Table className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{databaseSchema.length}</p>
                <p className="text-sm text-muted-foreground">{t('database.totalTables')}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/40 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {databaseSchema.reduce((sum, table) => sum + table.columns.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">{t('database.totalColumns')}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/40 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <GitBranch className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {databaseSchema.reduce((sum, table) => 
                    sum + table.columns.filter(col => col.foreignKey).length, 0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{t('database.totalRelations')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tables" className="gap-2">
            <Table className="w-4 h-4" />
            {t('database.tablesTab')}
          </TabsTrigger>
          <TabsTrigger value="erd" className="gap-2">
            <GitBranch className="w-4 h-4" />
            {t('database.erdTab')}
          </TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('database.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tables List */}
          <div className="space-y-6">
            {filteredTables.length > 0 ? (
              <Accordion type="multiple" className="space-y-4">
                {filteredTables.map((table) => (
                  <AccordionItem 
                    key={table.name} 
                    value={table.name}
                    className="bg-card rounded-xl border border-border/40 px-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Table className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg">{table.name}</h3>
                          <p className="text-sm text-muted-foreground">{table.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <DatabaseTable table={table} compact />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="bg-card rounded-xl border border-border/40 p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('database.noResults')}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ERD Tab */}
        <TabsContent value="erd" className="space-y-4">
          {/* Filter Section */}
          <div className="bg-card rounded-xl border border-border/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t('database.filterGroups')}
                </span>
                {selectedGroups.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedGroups.length}
                  </Badge>
                )}
              </div>
              {selectedGroups.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSelectedGroups([])}
                >
                  <X className="w-3 h-3 mr-1" />
                  {t('database.clear')}
                </Button>
              )}
            </div>

            {/* Feature Group Badges */}
            <div className="flex flex-wrap gap-2">
              {featureGroups.map(group => {
                const isSelected = selectedGroups.includes(group);
                return (
                  <Badge
                    key={group}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1.5"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedGroups(selectedGroups.filter(g => g !== group));
                      } else {
                        setSelectedGroups([...selectedGroups, group]);
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
              {selectedGroups.length === 0 
                ? '💡 Chọn nhóm tính năng để lọc sơ đồ ERD'
                : `✓ Đang hiển thị ${selectedGroups.length} nhóm`
              }
            </p>
          </div>

          {/* ERD Diagram */}
          <ERDiagram diagram={erdDiagram} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Memoize component
const MemoizedDatabaseDocsPage = memo(DatabaseDocsPage);
MemoizedDatabaseDocsPage.displayName = 'DatabaseDocsPage';

export default MemoizedDatabaseDocsPage;
