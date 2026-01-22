'use client';

/**
 * Developer Documentation Page - Main Implementation
 * 
 * Location: /app/(dashboard)/dev-docs/page.tsx
 * Purpose: Next.js App Router ready - Code chính ở đây
 * 
 * Structure: 6 Tabs với header actions
 */

import { useState } from 'react';
import { useNavigation } from '@/shims/router';
import { 
  BookOpen, 
  Layers, 
  GitBranch, 
  Database, 
  Code, 
  FileText, 
  TestTube,
  RefreshCw,
  Download,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Tab Components
import { SystemModulesTab } from '@/components/dev-docs/SystemModulesTab';
import { ERDiagramTab } from '@/components/dev-docs/ERDiagramTab';
import { DatabaseTablesTab } from '@/components/dev-docs/DatabaseTablesTab';
import { ApiEndpointsTab } from '@/components/dev-docs/ApiEndpointsTab';
import { SRSTab } from '@/components/dev-docs/SRSTab';
import { TestcaseTab } from '@/components/dev-docs/TestcaseTab';

export default function DevDocsPage() {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Xuất tài liệu thành công!');
  };

  const handleUpdate = () => {
    // TODO: Implement update/sync functionality
    alert('Cập nhật tài liệu thành công!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Banner */}
      <div className="bg-card border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Tài Liệu Developer
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Tự động sinh tài liệu chuyên nghiệp
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={handleUpdate}
                className="gap-2 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Cập nhật</span>
              </Button>
              <Button
                variant="default"
                size="default"
                onClick={handleExport}
                className="gap-2 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Xuất tài liệu</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <Tabs defaultValue="modules" className="space-y-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm p-1">
            <TabsList className="w-full justify-start bg-transparent border-none rounded-lg p-0 h-auto gap-1">
              <TabsTrigger 
                value="modules" 
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">System Modules</span>
                <span className="sm:hidden">Modules</span>
              </TabsTrigger>
              <TabsTrigger 
                value="erd" 
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <GitBranch className="w-4 h-4" />
                <span className="hidden sm:inline">ERD Diagram</span>
                <span className="sm:hidden">ERD</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tables" 
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">Database Tables</span>
                <span className="sm:hidden">Tables</span>
              </TabsTrigger>
              <TabsTrigger 
                value="api" 
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">API Endpoints</span>
                <span className="sm:hidden">API</span>
              </TabsTrigger>
              <TabsTrigger 
                value="srs" 
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">SRS Document</span>
                <span className="sm:hidden">SRS</span>
              </TabsTrigger>
              <TabsTrigger 
                value="testcases" 
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <TestTube className="w-4 h-4" />
                <span className="hidden sm:inline">Test Cases</span>
                <span className="sm:hidden">Tests</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents with fade-in animation */}
          <div className="animate-in fade-in duration-300">
            {/* Tab 1: System Modules */}
            <TabsContent value="modules" className="mt-0">
              <SystemModulesTab />
            </TabsContent>

            {/* Tab 2: ERD Diagram */}
            <TabsContent value="erd" className="mt-0">
              <ERDiagramTab />
            </TabsContent>

            {/* Tab 3: Database Tables */}
            <TabsContent value="tables" className="mt-0">
              <DatabaseTablesTab searchQuery={searchQuery} />
            </TabsContent>

            {/* Tab 4: API Endpoints */}
            <TabsContent value="api" className="mt-0">
              <ApiEndpointsTab searchQuery={searchQuery} />
            </TabsContent>

            {/* Tab 5: SRS (Usecases) */}
            <TabsContent value="srs" className="mt-0">
              <SRSTab searchQuery={searchQuery} />
            </TabsContent>

            {/* Tab 6: Testcases */}
            <TabsContent value="testcases" className="mt-0">
              <TestcaseTab searchQuery={searchQuery} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
