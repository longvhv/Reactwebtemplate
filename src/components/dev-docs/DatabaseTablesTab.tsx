/**
 * Database Tables Tab Component
 * Displays database schema tables
 */

import { useMemo } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { Database, BookOpen, GitBranch, Search } from 'lucide-react';
import { DatabaseTable } from '../database/DatabaseTable';
import { databaseSchema } from '../../data/database-schema';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export function DatabaseTablesTab({ searchQuery }: { searchQuery: string }) {
  const { t } = useLanguage();

  const filteredTables = useMemo(() => {
    if (!searchQuery) return databaseSchema;

    return databaseSchema.filter(
      (table) =>
        table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.columns.some(
          (col) =>
            col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            col.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/40 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('database.totalTables')}</p>
              <p className="text-2xl font-bold">{databaseSchema.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border/40 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('database.totalColumns')}</p>
              <p className="text-2xl font-bold">
                {databaseSchema.reduce((sum, table) => sum + table.columns.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border/40 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <GitBranch className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('database.relationships')}</p>
              <p className="text-2xl font-bold">
                {databaseSchema.reduce(
                  (sum, table) => sum + table.columns.filter((c) => c.foreignKey).length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables List with Accordion */}
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
                      <Database className="w-4 h-4 text-primary" />
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
    </div>
  );
}
