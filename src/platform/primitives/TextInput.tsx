/**
 * Cross-platform TextInput Component (Web Implementation)
 * 
 * This is the web implementation using input/textarea.
 * For React Native, use TextInput.native.tsx
 */

import React, { useState } from 'react';

export interface TextInputProps {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  placeholderTextColor?: string;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  testID?: string;
  accessibilityLabel?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  defaultValue,
  onChangeText,
  onChange,
  onFocus,
  onBlur,
  onSubmitEditing,
  placeholder,
  placeholderTextColor,
  className,
  style,
  multiline = false,
  numberOfLines,
  maxLength,
  editable = true,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  autoComplete,
  autoCorrect = true,
  keyboardType = 'default',
  returnKeyType,
  testID,
  accessibilityLabel,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e);
    onChangeText?.(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      onSubmitEditing?.();
    }
  };

  const keyboardTypeToInputType: Record<string, string> = {
    'default': 'text',
    'email-address': 'email',
    'numeric': 'number',
    'phone-pad': 'tel',
    'url': 'url',
  };

  const autoCapitalizeMap: Record<string, string> = {
    'none': 'off',
    'sentences': 'sentences',
    'words': 'words',
    'characters': 'characters',
  };

  const commonProps = {
    'data-testid': testID,
    className,
    style: {
      ...style,
      ...(placeholderTextColor && {
        '--placeholder-color': placeholderTextColor,
      } as any),
    },
    value,
    defaultValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    placeholder,
    maxLength,
    disabled: !editable,
    autoCapitalize: autoCapitalizeMap[autoCapitalize],
    autoComplete,
    autoCorrect: autoCorrect ? 'on' : 'off',
    'aria-label': accessibilityLabel,
  };

  if (multiline) {
    return (
      <textarea
        {...commonProps}
        rows={numberOfLines}
      />
    );
  }

  return (
    <input
      {...commonProps}
      type={secureTextEntry ? 'password' : keyboardTypeToInputType[keyboardType]}
    />
  );
};

TextInput.displayName = 'TextInput';
