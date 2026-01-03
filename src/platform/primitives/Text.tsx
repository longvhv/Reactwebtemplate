/**
 * Cross-platform Text Component (Web Implementation)
 * 
 * This is the web implementation using span.
 * For React Native, use Text.native.tsx
 */

import React from 'react';

export interface TextProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  testID?: string;
  role?: string;
  'aria-label'?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  className,
  style,
  onClick,
  numberOfLines,
  ellipsizeMode,
  selectable = true,
  testID,
  role,
  ...ariaProps
}) => {
  const computedStyle: React.CSSProperties = {
    ...style,
    userSelect: selectable ? undefined : 'none',
  };

  if (numberOfLines) {
    Object.assign(computedStyle, {
      overflow: 'hidden',
      textOverflow: ellipsizeMode === 'clip' ? 'clip' : 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: numberOfLines,
      WebkitBoxOrient: 'vertical' as any,
    });
  }

  return (
    <span
      data-testid={testID}
      className={className}
      style={computedStyle}
      onClick={onClick}
      role={role}
      {...ariaProps}
    >
      {children}
    </span>
  );
};

Text.displayName = 'Text';
