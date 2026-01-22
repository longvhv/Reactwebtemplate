/**
 * System Modules Tab Component
 * Displays modules and their business flows - Simplified Card Design
 */

import { useState } from 'react';
import { useNavigation } from '@/shims/router';
import { useLanguage } from '../../providers/LanguageProvider';
import {
  Shield,
  Users,
  BookOpen,
  Settings,
  Bell,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { systemModules, getModuleStats } from '../../data/system-modules';

const iconMap: Record<string, any> = {
  Shield,
  Users,
  BookOpen,
  Settings,
  Bell,
  Layers,
};

export function SystemModulesTab() {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Module Cards List */}
      {systemModules.map((module) => {
        const Icon = iconMap[module.icon];
        const stats = getModuleStats(module);
        const isExpanded = expandedModule === module._id;

        return (
          <div key={module._id} className="space-y-3">
            {/* Module Card */}
            <div
              onClick={() => setExpandedModule(isExpanded ? null : module._id)}
              className="group bg-card rounded-xl border border-border/50 p-6 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-5">
                {/* Icon with gradient background */}
                <div className="relative flex-shrink-0">
                  <div
                    className="absolute inset-0 blur-lg opacity-30 rounded-2xl"
                    style={{ backgroundColor: module.color }}
                  ></div>
                  <div
                    className="relative p-4 rounded-xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                      backgroundColor: `${module.color}15`,
                      borderColor: `${module.color}30`,
                      borderWidth: '1px',
                    }}
                  >
                    {Icon && <Icon className="w-7 h-7" style={{ color: module.color }} />}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {module.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium"
                      style={{
                        backgroundColor: `${module.color}10`,
                        color: module.color,
                        borderColor: `${module.color}20`,
                        borderWidth: '1px',
                      }}
                    >
                      {module.code}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground font-medium">
                      {stats.totalFlows} luồng nghiệp vụ
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-emerald-600 font-medium">
                      {stats.completedFlows} hoàn thành
                    </span>
                    {stats.inProgressFlows > 0 && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-amber-600 font-medium">
                          {stats.inProgressFlows} đang thực hiện
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow with smooth rotation */}
                <ChevronRight
                  className={`w-5 h-5 text-muted-foreground transition-all duration-300 flex-shrink-0 ${
                    isExpanded ? 'rotate-90 text-primary' : 'group-hover:translate-x-1 group-hover:text-primary'
                  }`}
                />
              </div>
            </div>

            {/* Expanded Business Flows with animation */}
            {isExpanded && (
              <div className="ml-8 space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="relative pl-6 space-y-2 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-primary/30 before:to-transparent">
                  {module.flows.map((flow, index) => (
                    <div
                      key={flow._id}
                      onClick={() => navigation.push(`/business-flow/${flow._id}`)}
                      className="group/flow bg-card/50 backdrop-blur-sm rounded-lg border border-border/40 p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          {/* Header */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-mono text-xs border-border/60">
                              {flow.code}
                            </Badge>
                            <Badge
                              variant={
                                flow.status === 'completed'
                                  ? 'default'
                                  : flow.status === 'in-progress'
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className={`text-xs ${
                                flow.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                                  : flow.status === 'in-progress'
                                  ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                  : 'border-border/60'
                              }`}
                            >
                              {flow.status === 'completed'
                                ? '✓ Hoàn thành'
                                : flow.status === 'in-progress'
                                ? '⏳ Đang thực hiện'
                                : '📋 Kế hoạch'}
                            </Badge>
                            {flow.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">
                                🔥 Ưu tiên cao
                              </Badge>
                            )}
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-1 group-hover/flow:text-primary transition-colors">
                              {flow.name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {flow.description}
                            </p>
                          </div>

                          {/* Mini Stats */}
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <span className="font-medium text-foreground">{flow.usecases.length}</span>
                              Usecases
                            </span>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <span className="font-medium text-foreground">{flow.testcases.length}</span>
                              Testcases
                            </span>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <span className="font-medium text-foreground">{flow.api_endpoints.length}</span>
                              APIs
                            </span>
                            {flow.completion_percentage !== undefined && (
                              <>
                                <span className="text-border">•</span>
                                <span className="flex items-center gap-1 font-medium text-primary">
                                  {flow.completion_percentage}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}