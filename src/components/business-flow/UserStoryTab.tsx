/**
 * User Story Tab Component
 * Displays user stories following international 3C model (Card, Conversation, Confirmation)
 * Format: AS A ... I WANT ... SO THAT ...
 * Acceptance Criteria: Detailed table format
 */

import { BookOpen, CheckCircle2, Circle, Clock, Tag, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserStoriesByFlowId, getUserStoryStats } from '../../data/user-stories';
import { Badge } from '../ui/badge';

interface UserStoryTabProps {
  flow: any;
  module: any;
}

export function UserStoryTab({ flow, module }: UserStoryTabProps) {
  const { t } = useTranslation();
  const userStories = getUserStoriesByFlowId(flow._id);
  const stats = getUserStoryStats(flow._id);
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());

  const toggleStory = (storyId: string) => {
    const newExpanded = new Set(expandedStories);
    if (newExpanded.has(storyId)) {
      newExpanded.delete(storyId);
    } else {
      newExpanded.add(storyId);
    }
    setExpandedStories(newExpanded);
  };

  if (userStories.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('businessFlow.userStory.noStories')}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t('businessFlow.userStory.noStoriesDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-xl border border-primary/10 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('businessFlow.userStory.overview')}</h3>
            <p className="text-2xl font-bold text-foreground">{stats.total} {t('businessFlow.userStory.stories')}</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">{t('businessFlow.userStory.completed')}:</span>
                <span className="font-semibold">{stats.completed}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-muted-foreground">{t('businessFlow.userStory.inProgress')}:</span>
                <span className="font-semibold">{stats.inProgress}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">{t('businessFlow.userStory.storyPoints')}:</span>
                <span className="font-semibold">{stats.totalStoryPoints}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">{t('businessFlow.userStory.estimatedHours')}:</span>
                <span className="font-semibold">{stats.totalEstimatedHours}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Stories List */}
      <div className="space-y-6">
        {userStories.map((story, index) => {
          const isExpanded = expandedStories.has(story.id);
          
          return (
            <div
              key={story.id}
              className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              style={{
                animation: 'slide-in-up 0.4s ease-out',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Story Header */}
              <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent px-6 py-4 border-b border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs">
                        {story.id}
                      </Badge>
                      <Badge
                        className={
                          story.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                            : story.status === 'in-progress'
                            ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                            : story.status === 'ready'
                            ? 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {story.status === 'completed'
                          ? `✓ ${t('businessFlow.userStory.status.completed')}`
                          : story.status === 'in-progress'
                          ? `⏳ ${t('businessFlow.userStory.status.inProgress')}`
                          : story.status === 'ready'
                          ? `✓ ${t('businessFlow.userStory.status.ready')}`
                          : `📝 ${t('businessFlow.userStory.status.draft')}`}
                      </Badge>
                      {story.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          🔥 {t('businessFlow.userStory.priority.high')}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {story.storyPoints && (
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="font-medium">{story.storyPoints}</span>
                        <span className="text-xs">{t('businessFlow.userStory.sp')}</span>
                      </div>
                    )}
                    {story.estimatedHours && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{story.estimatedHours}{t('businessFlow.userStory.hours')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6 space-y-6">
                {/* Card - User Story Template */}
                <div className="relative bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/20 p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                  
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">
                        {t('businessFlow.userStory.card.title')}
                      </h4>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 pt-0.5">
                        <Badge variant="outline" className="bg-background font-semibold text-xs">
                          {t('businessFlow.userStory.card.asA')}
                        </Badge>
                      </div>
                      <p className="flex-1 text-foreground leading-relaxed">{story.asA}</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 pt-0.5">
                        <Badge variant="outline" className="bg-background font-semibold text-xs">
                          {t('businessFlow.userStory.card.iWant')}
                        </Badge>
                      </div>
                      <p className="flex-1 text-foreground leading-relaxed">{story.iWant}</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-20 pt-0.5">
                        <Badge variant="outline" className="bg-background font-semibold text-xs">
                          {t('businessFlow.userStory.card.soThat')}
                        </Badge>
                      </div>
                      <p className="flex-1 text-foreground leading-relaxed font-medium text-primary/90">
                        {story.soThat}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toggle Acceptance Criteria */}
                <button
                  onClick={() => toggleStory(story.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 rounded-lg bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all group/toggle"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-sm">
                      {t('businessFlow.userStory.acceptance.title')}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({story.acceptanceCriteria.length} {t('businessFlow.userStory.acceptance.features')})
                      </span>
                    </h4>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover/toggle:text-emerald-600 transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover/toggle:text-emerald-600 transition-colors" />
                  )}
                </button>

                {/* Confirmation - Acceptance Criteria Table */}
                {isExpanded && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {story.acceptanceCriteria.map((ac) => (
                      <div
                        key={ac.id}
                        className="bg-card/50 rounded-lg border border-border/50 overflow-hidden hover:border-primary/30 transition-colors"
                      >
                        {/* AC Header */}
                        <div className="bg-gradient-to-r from-muted/50 to-transparent px-5 py-3 border-b border-border/50">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <Badge variant="outline" className="font-mono font-semibold">
                                {ac.id}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-foreground">{ac.feature}</h5>
                            </div>
                            <div>
                              <Badge
                                className={
                                  ac.status === 'passed'
                                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                                    : ac.status === 'failed'
                                    ? 'bg-red-500/10 text-red-700 border-red-500/30'
                                    : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                }
                              >
                                {ac.status === 'passed' ? '✓' : ac.status === 'failed' ? '✗' : '⏳'}{' '}
                                {t(`businessFlow.userStory.acceptance.status.${ac.status}`)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* AC Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/30">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/50">
                                  {t('businessFlow.userStory.acceptance.description')}
                                </th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/50">
                                  {t('businessFlow.userStory.acceptance.criteria')}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Description Column */}
                              <tr>
                                <td className="px-5 py-4 align-top border-b border-border/30 bg-card/30">
                                  <div className="space-y-3">
                                    <p className="text-sm text-foreground leading-relaxed">
                                      {ac.description}
                                    </p>
                                    
                                    {ac.descriptionSteps && ac.descriptionSteps.length > 0 && (
                                      <div className="space-y-2 mt-4">
                                        {ac.descriptionSteps.map((step) => (
                                          <div key={step.step} className="flex items-start gap-2">
                                            <Badge variant="outline" className="text-xs font-mono flex-shrink-0">
                                              {step.step}
                                            </Badge>
                                            <p className="text-sm text-foreground leading-relaxed">
                                              {step.content}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Acceptance Criteria Column */}
                                <td className="px-5 py-4 align-top border-b border-border/30">
                                  <div className="space-y-4">
                                    {ac.criteria.map((criterion) => (
                                      <div key={criterion.number} className="space-y-2">
                                        <div className="flex items-start gap-2">
                                          <span className="font-semibold text-sm text-primary flex-shrink-0">
                                            {criterion.number}.
                                          </span>
                                          <p className="text-sm text-foreground leading-relaxed">
                                            {criterion.description}
                                          </p>
                                        </div>
                                        
                                        {criterion.details && criterion.details.length > 0 && (
                                          <div className="ml-6 space-y-2">
                                            {criterion.details.map((detail, idx) => (
                                              <div key={idx} className="space-y-1">
                                                <div className="flex items-start gap-2">
                                                  <span className="text-primary text-sm flex-shrink-0 mt-0.5">
                                                    •
                                                  </span>
                                                  <p className="text-sm text-foreground leading-relaxed">
                                                    {detail.content}
                                                  </p>
                                                </div>
                                                
                                                {detail.subItems && detail.subItems.length > 0 && (
                                                  <div className="ml-6 space-y-1">
                                                    {detail.subItems.map((subItem, subIdx) => (
                                                      <div key={subIdx} className="flex items-start gap-2">
                                                        <span className="text-muted-foreground text-sm flex-shrink-0">
                                                          ◦
                                                        </span>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                          {subItem}
                                                        </p>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Conversation - Additional Details */}
                {(story.notes || story.businessValue || story.technicalNotes) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    {story.businessValue && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Business Value
                        </h5>
                        <p className="text-sm text-foreground leading-relaxed">{story.businessValue}</p>
                      </div>
                    )}
                    
                    {story.technicalNotes && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Technical Notes
                        </h5>
                        <p className="text-sm text-foreground leading-relaxed font-mono text-xs">
                          {story.technicalNotes}
                        </p>
                      </div>
                    )}
                    
                    {story.notes && (
                      <div className="space-y-2 md:col-span-2">
                        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Notes
                        </h5>
                        <p className="text-sm text-foreground leading-relaxed">{story.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}