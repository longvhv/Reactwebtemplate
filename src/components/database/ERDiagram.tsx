import { memo, useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useLanguage } from "../../providers/LanguageProvider";

interface ERDiagramProps {
  diagram: string;
}

/**
 * ERDiagram Component
 * Hiển thị sơ đồ quan hệ ERD bằng Mermaid.js
 */
export const ERDiagram = memo(({ diagram }: ERDiagramProps) => {
  const { t } = useLanguage();
  const mermaidRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!mermaidRef.current) return;

      // Initialize Mermaid with theme settings
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        flowchart: {
          curve: 'basis',
          padding: 20,
        },
      });

      try {
        // Clear previous content
        mermaidRef.current.innerHTML = '';
        
        // Generate unique ID for the diagram
        const id = `mermaid-${Date.now()}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(id, diagram);
        
        // Insert the SVG
        mermaidRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        mermaidRef.current.innerHTML = `<pre class="text-xs text-muted-foreground overflow-auto">${diagram}</pre>`;
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className="bg-card rounded-xl border border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 px-6 py-4 border-b border-border/40">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
          </svg>
          {t('database.erdTitle')}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t('database.erdDescription')}
        </p>
      </div>

      {/* Diagram Container */}
      <div ref={containerRef} className="p-6 bg-gradient-to-br from-background to-muted/10">
        <div 
          ref={mermaidRef}
          className="flex items-center justify-center min-h-[400px] overflow-x-auto"
        />
      </div>

      {/* Footer Note */}
      <div className="bg-muted/20 px-6 py-3 border-t border-border/40">
        <p className="text-xs text-muted-foreground text-center">
          {t('database.erdNote')}
        </p>
      </div>
    </div>
  );
});

ERDiagram.displayName = "ERDiagram";