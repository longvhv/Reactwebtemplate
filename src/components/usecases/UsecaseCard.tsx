/**
 * Usecase Card Component
 * 
 * Displays individual usecase information with table and diagram
 */

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Tag, User, AlertCircle, Check, Table, Image as ImageIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Usecase } from '../../data/usecases';
import { useLanguage } from '../../providers/LanguageProvider';
import { UsecaseTable } from './UsecaseTable';
import { UsecaseDiagram } from './UsecaseDiagram';
import { ScreenshotCaptureModal } from '../ScreenshotCaptureModal';
import { ScreenshotGallery } from '../ScreenshotCapture';

interface UsecaseCardProps {
  usecase: Usecase;
}

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500'
};

const statusColors = {
  completed: 'bg-green-500',
  'in-progress': 'bg-yellow-500',
  planned: 'bg-gray-500'
};

export function UsecaseCard({ usecase }: UsecaseCardProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [showCaptureModal, setShowCaptureModal] = useState(false);

  // Load screenshots from localStorage on mount
  useEffect(() => {
    const storageKey = `usecase_screenshots_${usecase.id}`;
    const savedScreenshots = localStorage.getItem(storageKey);
    
    if (savedScreenshots) {
      try {
        setScreenshots(JSON.parse(savedScreenshots));
      } catch (error) {
        console.error('Error loading screenshots:', error);
      }
    }
  }, [usecase.id]);

  // Save screenshots to localStorage whenever they change
  const saveScreenshots = (newScreenshots: string[]) => {
    const storageKey = `usecase_screenshots_${usecase.id}`;
    localStorage.setItem(storageKey, JSON.stringify(newScreenshots));
    setScreenshots(newScreenshots);
  };

  const handleAddScreenshot = (screenshot: string) => {
    const newScreenshots = [...screenshots, screenshot];
    saveScreenshots(newScreenshots);
  };

  const handleRemoveScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    saveScreenshots(newScreenshots);
  };

  // Get target URL for screenshot
  const getTargetUrl = () => {
    if (usecase.relatedRoute) {
      // Use relative route (will use same origin)
      return usecase.relatedRoute;
    }
    // Fallback to home page
    return '/';
  };

  return (
    <div className="bg-card rounded-xl border border-border/40 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header - Always visible */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Expand Icon */}
          <div className="mt-1">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-primary" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* Title and Badges */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {usecase.id}
                  </Badge>
                  <Badge className={`${priorityColors[usecase.priority]} text-white text-xs`}>
                    {t(`usecases.priority.${usecase.priority}`)}
                  </Badge>
                  <Badge className={`${statusColors[usecase.status]} text-white text-xs`}>
                    {t(`usecases.status.${usecase.status}`)}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-1">{usecase.title}</h3>
                <p className="text-sm text-muted-foreground">{usecase.description}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{usecase.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{usecase.actor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-4 space-y-6 border-t border-border/40">
          {/* Usecase Table */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Table className="w-4 h-4 text-primary" />
              Bảng mô tả Use Case
            </h4>
            <UsecaseTable usecase={usecase} />
          </div>

          {/* Usecase Diagram */}
          <div>
            <UsecaseDiagram usecase={usecase} />
          </div>

          {/* Preconditions */}
          {usecase.preconditions && usecase.preconditions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                {t('usecases.preconditions')}
              </h4>
              <ul className="space-y-1 ml-6">
                {usecase.preconditions.map((condition, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground list-disc">
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Flow */}
          {usecase.steps && usecase.steps.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                {t('usecases.mainFlow')}
              </h4>
              <ol className="space-y-2 ml-6">
                {usecase.steps.map((step, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground list-decimal">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Postconditions */}
          {usecase.postconditions && usecase.postconditions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                {t('usecases.postconditions')}
              </h4>
              <ul className="space-y-1 ml-6">
                {usecase.postconditions.map((condition, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground list-disc">
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternative Flows */}
          {usecase.alternativeFlows && usecase.alternativeFlows.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                {t('usecases.alternativeFlows')}
              </h4>
              <ul className="space-y-1 ml-6">
                {usecase.alternativeFlows.map((flow, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground list-disc">
                    {flow}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exception Flows */}
          {usecase.exceptionFlows && usecase.exceptionFlows.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {t('usecases.exceptionFlows')}
              </h4>
              <ul className="space-y-1 ml-6">
                {usecase.exceptionFlows.map((flow, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground list-disc">
                    {flow}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related APIs */}
          {usecase.relatedAPIs && usecase.relatedAPIs.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">{t('usecases.relatedAPIs')}</h4>
              <div className="flex flex-wrap gap-2">
                {usecase.relatedAPIs.map((api, idx) => (
                  <Badge key={idx} variant="outline" className="font-mono text-xs">
                    {api}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                Ảnh chụp màn hình giao diện
                {usecase.relatedRoute && (
                  <span className="text-xs text-muted-foreground font-normal">
                    ({usecase.relatedRoute})
                  </span>
                )}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCaptureModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Chụp giao diện
              </button>
            </div>
            
            {screenshots.length > 0 ? (
              <ScreenshotGallery 
                screenshots={screenshots} 
                onRemove={handleRemoveScreenshot} 
              />
            ) : (
              <div className="bg-muted/30 rounded-lg border border-dashed border-border p-8 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">
                  Chưa có ảnh chụp màn hình
                </p>
                <p className="text-xs text-muted-foreground">
                  {usecase.relatedRoute 
                    ? `Click "Chụp giao diện" để mở trang ${usecase.relatedRoute} và chụp màn hình`
                    : 'Click "Chụp giao diện" để capture màn hình'}
                </p>
              </div>
            )}
          </div>

          {/* Screenshot Capture Modal */}
          <ScreenshotCaptureModal 
            isOpen={showCaptureModal}
            onClose={() => setShowCaptureModal(false)}
            onCapture={handleAddScreenshot}
            targetUrl={getTargetUrl()}
            usecaseTitle={usecase.title}
          />
        </div>
      )}
    </div>
  );
}