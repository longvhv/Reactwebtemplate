/**
 * Cross-platform View Component (Web Implementation)
 * 
 * This is the web implementation using div.
 * For React Native, use View.native.tsx
 */

import React from 'react';

export interface ViewProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  testID?: string;
}

export const View: React.FC<ViewProps> = ({
  children,
  className,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  id,
  role,
  testID,
  ...ariaProps
}) => {
  return (
    <div
      id={id}
      data-testid={testID}
      className={className}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role={role}
      {...ariaProps}
    >
      {children}
    </div>
  );
};

View.displayName = 'View';
