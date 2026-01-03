/**
 * Cross-platform Touchable Components (Web Implementation)
 * 
 * Provides TouchableOpacity and Pressable for web using button/div
 * For React Native, use Touchable.native.tsx
 */

import React, { useState } from 'react';

export interface TouchableOpacityProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  activeOpacity?: number;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
}

export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  className,
  style,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  disabled = false,
  activeOpacity = 0.7,
  testID,
  accessibilityLabel,
  accessibilityRole,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
      onPressIn?.();
    }
  };

  const handleMouseUp = () => {
    if (!disabled) {
      setIsPressed(false);
      onPressOut?.();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onPress?.();
    }
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    opacity: isPressed ? activeOpacity : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.15s ease',
    border: 'none',
    background: 'transparent',
    padding: 0,
  };

  return (
    <button
      data-testid={testID}
      className={className}
      style={computedStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      aria-label={accessibilityLabel}
      role={accessibilityRole}
      type="button"
    >
      {children}
    </button>
  );
};

TouchableOpacity.displayName = 'TouchableOpacity';

export interface PressableProps {
  children?: React.ReactNode | ((state: { pressed: boolean; hovered: boolean }) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties | ((state: { pressed: boolean; hovered: boolean }) => React.CSSProperties);
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
}

export const Pressable: React.FC<PressableProps> = ({
  children,
  className,
  style,
  onPress,
  onPressIn,
  onPressOut,
  disabled = false,
  testID,
  accessibilityLabel,
  accessibilityRole,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
      onPressIn?.();
    }
  };

  const handleMouseUp = () => {
    if (!disabled) {
      setIsPressed(false);
      onPressOut?.();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onPress?.();
    }
  };

  const state = { pressed: isPressed, hovered: isHovered };
  const computedStyle = typeof style === 'function' ? style(state) : style;
  const computedChildren = typeof children === 'function' ? children(state) : children;

  return (
    <button
      data-testid={testID}
      className={className}
      style={{
        ...computedStyle,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        background: 'transparent',
        padding: 0,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      disabled={disabled}
      aria-label={accessibilityLabel}
      role={accessibilityRole}
      type="button"
    >
      {computedChildren}
    </button>
  );
};

Pressable.displayName = 'Pressable';
