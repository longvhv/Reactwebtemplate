/**
 * API Endpoints Tab Component
 * Displays API documentation
 */

import { useMemo, useState } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { Filter, Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ApiEndpoint } from '../api/ApiEndpoint';
import { openApiSpec } from '../../data/openapi';

export function ApiEndpointsTab({ searchQuery }: { searchQuery: string }) {
  const { t } = useLanguage();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { info, tags, paths } = openApiSpec;

  const endpoints = useMemo(() => {
    const result: any[] = [];
    Object.entries(paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, details]: [string, any]) => {
        result.push({ method, path, ...details });
      });
    });
    return result;
  }, [paths]);

  const filteredEndpoints = useMemo(() => {
    let filtered = endpoints;

    if (selectedTag) {
      filtered = filtered.filter((endpoint) => endpoint.tags?.includes(selectedTag));
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (endpoint) =>
          endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          endpoint.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [endpoints, selectedTag, searchQuery]);

  return (
    <div className="space-y-6">
      {/* API Info Card */}
      <div className="bg-card rounded-xl border border-border/40 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{info.title}</h2>
            <p className="text-muted-foreground">{info.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">v{info.version}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      {tags && tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Button
            variant={selectedTag === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            {t('api.allTags')}
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag.name}
              variant={selectedTag === tag.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag.name)}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      )}

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.length > 0 ? (
          filteredEndpoints.map((endpoint, index) => (
            <ApiEndpoint key={`${endpoint.method}-${endpoint.path}-${index}`} endpoint={endpoint} />
          ))
        ) : (
          <div className="bg-card rounded-xl border border-border/40 p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('api.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
