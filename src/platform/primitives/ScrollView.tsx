/**
 * Cross-platform ScrollView Component (Web Implementation)
 * 
 * This is the web implementation using div with overflow.
 * For React Native, use ScrollView.native.tsx
 */

import React from 'react';

export interface ScrollViewProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: React.CSSProperties;
  contentContainerClassName?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollEnabled?: boolean;
  testID?: string;
}

export const ScrollView: React.FC<ScrollViewProps> = ({
  children,
  className,
  style,
  horizontal = false,
  showsHorizontalScrollIndicator = true,
  showsVerticalScrollIndicator = true,
  contentContainerStyle,
  contentContainerClassName,
  onScroll,
  scrollEnabled = true,
  testID,
}) => {
  const scrollbarStyles: React.CSSProperties = {};

  if (!showsHorizontalScrollIndicator || !showsVerticalScrollIndicator) {
    Object.assign(scrollbarStyles, {
      scrollbarWidth: 'none' as any,
      msOverflowStyle: 'none' as any,
    });
  }

  const containerStyle: React.CSSProperties = {
    ...style,
    overflow: scrollEnabled ? (horizontal ? 'auto' : 'auto') : 'hidden',
    overflowX: horizontal ? 'auto' : 'hidden',
    overflowY: horizontal ? 'hidden' : 'auto',
    ...scrollbarStyles,
  };

  const contentStyle: React.CSSProperties = {
    ...contentContainerStyle,
    display: horizontal ? 'flex' : 'block',
    flexDirection: horizontal ? 'row' : undefined,
  };

  return (
    <div
      data-testid={testID}
      className={className}
      style={containerStyle}
      onScroll={onScroll}
    >
      <div
        className={contentContainerClassName}
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
};

ScrollView.displayName = 'ScrollView';
