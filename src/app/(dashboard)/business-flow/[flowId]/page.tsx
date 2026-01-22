'use client';

/**
 * Business Flow Detail Page - Main Implementation
 * 
 * Location: /app/(dashboard)/business-flow/[flowId]/page.tsx
 * Purpose: Next.js App Router ready - Code chính ở đây
 * 
 * Displays detailed information about a specific business flow
 */

import { useState, useEffect } from 'react';
import { useNavigation, useParams } from '@/shims/router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BookOpen,
  GitBranch,
  Code,
  Database,
  FileText,
  TestTube,
  Activity,
  Workflow,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { systemModules } from '@/data/system-modules';

// Tab Components
import { UserStoryTab } from '@/components/business-flow/UserStoryTab';
import { ActivityDiagramTab } from '@/components/business-flow/ActivityDiagramTab';
import { SequenceDiagramTab } from '@/components/business-flow/SequenceDiagramTab';
import { DetailSpecTab } from '@/components/business-flow/DetailSpecTab';
import { FlowApiEndpointsTab } from '@/components/business-flow/FlowApiEndpointsTab';
import { FlowDatabaseTableTab } from '@/components/business-flow/FlowDatabaseTableTab';
import { FlowTestcaseTab } from '@/components/business-flow/FlowTestcaseTab';

export default function BusinessFlowDetailPage() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { flowId } = useParams<{ flowId: string }>();
  const [flow, setFlow] = useState<any>(null);
  const [module, setModule] = useState<any>(null);

  // Load flow data
  useEffect(() => {
    if (flowId) {
      // Find the flow in systemModules
      for (const mod of systemModules) {
        const foundFlow = mod.flows.find((f) => f._id === flowId);
        if (foundFlow) {
          setFlow(foundFlow);
          setModule(mod);
          break;
        }
      }
    }
  }, [flowId]);

  if (!flow || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{t('businessFlow.loading')}</p>
          <Button onClick={() => navigation.push('/dev-docs')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Banner */}
      <div className="bg-card border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="space-y-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigation.push('/dev-docs')}
              className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('businessFlow.backToDocs')}
            </Button>

            {/* Flow Header */}
            <div className="flex items-start justify-between gap-4">
              {/* Left: Module Icon + Flow Info */}
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div
                    className="absolute inset-0 blur-lg opacity-30 rounded-2xl"
                    style={{ backgroundColor: module.color }}
                  ></div>
                  <div
                    className="relative p-4 rounded-xl shadow-md"
                    style={{
                      backgroundColor: `${module.color}15`,
                      borderColor: `${module.color}30`,
                      borderWidth: '1px',
                    }}
                  >
                    <Workflow className="w-8 h-8" style={{ color: module.color }} />
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-mono">
                      {flow.code}
                    </Badge>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${module.color}10`,
                        color: module.color,
                        borderColor: `${module.color}20`,
                        borderWidth: '1px',
                      }}
                    >
                      {module.name}
                    </Badge>
                    <Badge
                      className={
                        flow.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                          : flow.status === 'in-progress'
                          ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                          : 'border-border/60'
                      }
                    >
                      {flow.status === 'completed'
                        ? `✓ ${t('businessFlow.completed')}`
                        : flow.status === 'in-progress'
                        ? `⏳ ${t('businessFlow.inProgress')}`
                        : `📋 ${t('businessFlow.planned')}`}
                    </Badge>
                    {flow.priority === 'high' && (
                      <Badge variant="destructive">{t('businessFlow.highPriority')}</Badge>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {flow.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
                      {flow.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium text-foreground">{flow.usecases.length}</span>
                      {t('businessFlow.usecases')}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <TestTube className="w-4 h-4" />
                      <span className="font-medium text-foreground">{flow.testcases.length}</span>
                      {t('businessFlow.testcases')}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Code className="w-4 h-4" />
                      <span className="font-medium text-foreground">{flow.api_endpoints.length}</span>
                      {t('businessFlow.apis')}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Database className="w-4 h-4" />
                      <span className="font-medium text-foreground">{flow.database_tables.length}</span>
                      {t('businessFlow.tables')}
                    </span>
                    {flow.completion_percentage !== undefined && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-1.5 font-medium text-primary">
                          {flow.completion_percentage}% {t('businessFlow.completionRate')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <Tabs defaultValue="user-story" className="space-y-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm p-1">
            <TabsList className="w-full justify-start bg-transparent border-none rounded-lg p-0 h-auto gap-1 flex-wrap">
              <TabsTrigger
                value="user-story"
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businessFlow.tabs.userStory')}</span>
                <span className="sm:hidden">Story</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity-diagram"
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businessFlow.tabs.activityDiagram')}</span>
                <span className="sm:hidden">Activity</span>
              </TabsTrigger>
              <TabsTrigger
                value="sequence-diagram"
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <GitBranch className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businessFlow.tabs.sequenceDiagram')}</span>
                <span className="sm:hidden">Sequence</span>
              </TabsTrigger>
              <TabsTrigger
                value="detail-spec"
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businessFlow.tabs.detailSpec')}</span>
                <span className="sm:hidden">Spec</span>
              </TabsTrigger>
              <TabsTrigger
                value="api"
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businessFlow.tabs.apiEndpoints')}</span>
                <span className="sm:hidden">API</span>
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businessFlow.tabs.databaseTable')}</span>
                <span className="sm:hidden">DB</span>
              </TabsTrigger>
              <TabsTrigger
                value="testcase"
                className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 px-4 py-2.5"
              >
                <TestTube className="w-4 h-4" />
                <span className="hidden sm:inline">{t('businessFlow.tabs.testcase')}</span>
                <span className="sm:hidden">Test</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents with fade-in animation */}
          <div className="animate-in fade-in duration-300">
            <TabsContent value="user-story" className="mt-0">
              <UserStoryTab flow={flow} module={module} />
            </TabsContent>

            <TabsContent value="activity-diagram" className="mt-0">
              <ActivityDiagramTab flow={flow} module={module} />
            </TabsContent>

            <TabsContent value="sequence-diagram" className="mt-0">
              <SequenceDiagramTab flow={flow} module={module} />
            </TabsContent>

            <TabsContent value="detail-spec" className="mt-0">
              <DetailSpecTab flow={flow} module={module} />
            </TabsContent>

            <TabsContent value="api" className="mt-0">
              <FlowApiEndpointsTab flow={flow} module={module} />
            </TabsContent>

            <TabsContent value="database" className="mt-0">
              <FlowDatabaseTableTab flow={flow} module={module} />
            </TabsContent>

            <TabsContent value="testcase" className="mt-0">
              <FlowTestcaseTab flow={flow} module={module} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
