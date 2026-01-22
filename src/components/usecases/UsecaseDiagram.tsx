/**
 * Usecase Diagram Component
 * 
 * Displays a simple use case diagram using SVG
 */

import { Usecase } from '../../data/usecases';

interface UsecaseDiagramProps {
  usecase: Usecase;
}

export function UsecaseDiagram({ usecase }: UsecaseDiagramProps) {
  // Extract system actions from steps
  const systemActions = usecase.steps
    .filter(step => step.toLowerCase().includes('hệ thống'))
    .slice(0, 3); // Limit to 3 main actions

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h4 className="text-sm font-semibold mb-4 text-center">Sơ đồ Use Case</h4>
      <svg 
        viewBox="0 0 600 400" 
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* System boundary */}
        <rect
          x="200"
          y="50"
          width="350"
          height="300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="text-border"
        />
        <text
          x="375"
          y="40"
          textAnchor="middle"
          className="text-xs font-semibold fill-current"
        >
          Hệ thống
        </text>

        {/* Actor (stick figure) */}
        <g transform="translate(80, 180)">
          {/* Head */}
          <circle cx="0" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Body */}
          <line x1="0" y1="15" x2="0" y2="50" stroke="currentColor" strokeWidth="2" />
          {/* Arms */}
          <line x1="-20" y1="30" x2="20" y2="30" stroke="currentColor" strokeWidth="2" />
          {/* Legs */}
          <line x1="0" y1="50" x2="-15" y2="80" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="50" x2="15" y2="80" stroke="currentColor" strokeWidth="2" />
          {/* Label */}
          <text
            x="0"
            y="100"
            textAnchor="middle"
            className="text-xs font-medium fill-current"
          >
            {usecase.actor}
          </text>
        </g>

        {/* Main Use Case (ellipse) */}
        <ellipse
          cx="375"
          cy="200"
          rx="100"
          ry="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        <text
          x="375"
          y="200"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium fill-current text-center"
        >
          <tspan x="375" dy="-0.5em">{usecase.title.split(' ').slice(0, 2).join(' ')}</tspan>
          <tspan x="375" dy="1.2em">{usecase.title.split(' ').slice(2).join(' ')}</tspan>
        </text>

        {/* Connection line from actor to use case */}
        <line
          x1="110"
          y1="200"
          x2="275"
          y2="200"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground"
        />

        {/* Extended/Related Use Cases (if any) */}
        {systemActions.length > 0 && systemActions[0] && (
          <>
            <ellipse
              cx="375"
              cy="100"
              rx="80"
              ry="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              className="text-muted-foreground"
            />
            <text
              x="375"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-current text-muted-foreground"
            >
              {systemActions[0].substring(0, 30)}...
            </text>
            {/* Include/Extend arrow */}
            <line
              x1="375"
              y1="160"
              x2="375"
              y2="130"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3,3"
              markerEnd="url(#arrowhead)"
              className="text-muted-foreground"
            />
            <text
              x="385"
              y="145"
              className="text-[9px] fill-current italic text-muted-foreground"
            >
              «include»
            </text>
          </>
        )}

        {systemActions.length > 1 && systemActions[1] && (
          <>
            <ellipse
              cx="375"
              cy="300"
              rx="80"
              ry="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              className="text-muted-foreground"
            />
            <text
              x="375"
              y="300"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-current text-muted-foreground"
            >
              {systemActions[1].substring(0, 30)}...
            </text>
            {/* Include/Extend arrow */}
            <line
              x1="375"
              y1="240"
              x2="375"
              y2="270"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3,3"
              markerEnd="url(#arrowhead)"
              className="text-muted-foreground"
            />
            <text
              x="385"
              y="255"
              className="text-[9px] fill-current italic text-muted-foreground"
            >
              «include»
            </text>
          </>
        )}

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="currentColor"
              className="text-muted-foreground"
            />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
