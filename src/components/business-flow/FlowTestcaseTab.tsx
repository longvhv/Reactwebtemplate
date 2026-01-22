/**
 * Flow Testcase Tab Component
 * Displays testcases for the business flow
 */

import { useTranslation } from 'react-i18next';

interface FlowTestcaseTabProps {
  flow: any;
  module: any;
}

export function FlowTestcaseTab({ flow, module }: FlowTestcaseTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Placeholder */}
      <div className="bg-card rounded-xl border border-border/50 p-8 text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">🧪</span>
          </div>
          <h3 className="text-lg font-semibold">{t('businessFlow.testcaseTab.title')}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t('businessFlow.testcaseTab.description')}
          </p>
          <div className="pt-4">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
              <span className="font-medium">{t('businessFlow.flowLabel')}</span>
              <span>{flow.code}</span>
              <span>•</span>
              <span>{t('businessFlow.countTestcases', { count: flow.testcases.length })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
