/**
 * Cross-platform Alert Utility
 * 
 * Web: Uses window.alert()
 * Native: Would use Alert from react-native
 */

import { Platform } from './platform';

/**
 * Show a cross-platform alert
 * @param message - The message to display
 * @param title - Optional title (used in React Native)
 */
export function showAlert(message: string, title?: string): void {
  if (Platform.isWeb()) {
    // Web implementation
    if (typeof window !== 'undefined' && typeof window.alert === 'function') {
      // Include title in message if provided
      const fullMessage = title ? `${title}\n\n${message}` : message;
      window.alert(fullMessage);
    } else {
      // Fallback: log to console
      console.log(`[Alert] ${title || 'Alert'}: ${message}`);
    }
  } else {
    // React Native implementation would use:
    // import { Alert } from 'react-native';
    // Alert.alert(title || 'Alert', message);
    
    // For now, log to console as placeholder
    console.log(`[Alert] ${title || 'Alert'}: ${message}`);
  }
}

/**
 * Show a confirmation dialog
 * @param message - The message to display
 * @param onConfirm - Callback when user confirms
 * @param onCancel - Optional callback when user cancels
 */
export function showConfirm(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void {
  if (Platform.isWeb()) {
    // Web implementation
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      const result = window.confirm(message);
      if (result) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    } else {
      // Fallback: assume confirmed
      console.log(`[Confirm] ${message} (auto-confirmed)`);
      onConfirm();
    }
  } else {
    // React Native implementation would use:
    // import { Alert } from 'react-native';
    // Alert.alert('Confirm', message, [
    //   { text: 'Cancel', onPress: onCancel, style: 'cancel' },
    //   { text: 'OK', onPress: onConfirm }
    // ]);
    
    // For now, auto-confirm
    console.log(`[Confirm] ${message} (auto-confirmed)`);
    onConfirm();
  }
}

/**
 * Show a prompt dialog
 * @param message - The message to display
 * @param onSubmit - Callback with user input
 * @param defaultValue - Default value for input
 */
export function showPrompt(
  message: string,
  onSubmit: (value: string | null) => void,
  defaultValue?: string
): void {
  if (Platform.isWeb()) {
    // Web implementation
    if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
      const result = window.prompt(message, defaultValue);
      onSubmit(result);
    } else {
      // Fallback: return default or null
      console.log(`[Prompt] ${message} (auto-submitted)`);
      onSubmit(defaultValue || null);
    }
  } else {
    // React Native implementation would use:
    // import { Alert } from 'react-native';
    // Alert.prompt('Input', message, onSubmit, 'plain-text', defaultValue);
    
    // For now, return default or null
    console.log(`[Prompt] ${message} (auto-submitted)`);
    onSubmit(defaultValue || null);
  }
}

// Export aliases for convenience
export const alert = showAlert;
export const confirm = showConfirm;
export const prompt = showPrompt;
