/**
 * Cross-platform UI Primitives
 * 
 * Exports platform-specific implementations:
 * - Web: Uses HTML elements (div, span, img, etc.)
 * - Native: Uses React Native components (View, Text, Image, etc.)
 * 
 * Usage:
 * import { View, Text, Image } from '@/platform/primitives';
 */

export { View } from './View';
export type { ViewProps } from './View';

export { Text } from './Text';
export type { TextProps } from './Text';

export { TouchableOpacity, Pressable } from './Touchable';
export type { TouchableOpacityProps, PressableProps } from './Touchable';

export { ScrollView } from './ScrollView';
export type { ScrollViewProps } from './ScrollView';

export { Image } from './Image';
export type { ImageProps } from './Image';

export { TextInput } from './TextInput';
export type { TextInputProps } from './TextInput';

// Re-export platform utilities
export { Platform, Dimensions, StyleSheet, PixelRatio } from '../utils/platform';
