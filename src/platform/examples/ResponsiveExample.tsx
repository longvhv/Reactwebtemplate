/**
 * Responsive Design Example
 * 
 * Demonstrates responsive layouts using platform hooks
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from '../index';
import {
  useBreakpoint,
  usePlatformDimensions,
  useOrientation,
} from '../hooks';

export function ResponsiveExample() {
  const { isMobile, isTablet, isDesktop, width } = useBreakpoint();
  const dimensions = usePlatformDimensions();
  const { isPortrait, isLandscape } = useOrientation();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4" style={styles.container}>
        {/* Dimensions Info */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Screen Dimensions
          </Text>
          <Text className="text-gray-600">Width: {dimensions.width}px</Text>
          <Text className="text-gray-600">Height: {dimensions.height}px</Text>
          <Text className="text-gray-600">Scale: {dimensions.scale}x</Text>
          <Text className="text-gray-600">Font Scale: {dimensions.fontScale}x</Text>
        </View>

        {/* Breakpoint Info */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Current Breakpoint
          </Text>
          <Text className="text-gray-600">
            Mobile ({'<'}768px): {isMobile ? '✅' : '❌'}
          </Text>
          <Text className="text-gray-600">
            Tablet (768-1024px): {isTablet ? '✅' : '❌'}
          </Text>
          <Text className="text-gray-600">
            Desktop ({'>'}1024px): {isDesktop ? '✅' : '❌'}
          </Text>
        </View>

        {/* Orientation Info */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Orientation
          </Text>
          <Text className="text-gray-600">
            Portrait: {isPortrait ? '✅' : '❌'}
          </Text>
          <Text className="text-gray-600">
            Landscape: {isLandscape ? '✅' : '❌'}
          </Text>
        </View>

        {/* Responsive Layout */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Responsive Layout
          </Text>
          <View
            style={[
              styles.grid,
              {
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 8 : 16,
              },
            ]}
          >
            <View className="flex-1 p-4 bg-blue-100 rounded-lg" style={styles.gridItem}>
              <Text className="text-blue-900 font-semibold">Item 1</Text>
            </View>
            <View className="flex-1 p-4 bg-green-100 rounded-lg" style={styles.gridItem}>
              <Text className="text-green-900 font-semibold">Item 2</Text>
            </View>
            <View className="flex-1 p-4 bg-purple-100 rounded-lg" style={styles.gridItem}>
              <Text className="text-purple-900 font-semibold">Item 3</Text>
            </View>
          </View>
          <Text className="mt-4 text-sm text-gray-500">
            {isMobile && 'Mobile: Stacked vertically'}
            {isTablet && 'Tablet: 2 columns'}
            {isDesktop && 'Desktop: 3 columns'}
          </Text>
        </View>

        {/* Responsive Typography */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Responsive Typography
          </Text>
          <Text
            style={{
              fontSize: isMobile ? 14 : isTablet ? 16 : 18,
              lineHeight: isMobile ? 20 : isTablet ? 24 : 28,
            }}
          >
            This text changes size based on screen width. On mobile it's 14px, 
            on tablet 16px, and on desktop 18px.
          </Text>
        </View>

        {/* Adaptive Container */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Adaptive Container
          </Text>
          <View
            style={{
              maxWidth: isDesktop ? 800 : isTablet ? 600 : '100%',
              marginHorizontal: 'auto',
              padding: isMobile ? 12 : 20,
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
            }}
          >
            <Text className="text-center">
              This container has adaptive max-width and padding
            </Text>
          </View>
        </View>

        {/* Grid Columns */}
        <View className="p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Responsive Grid
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: isMobile
                    ? `${100 / 2 - 1}%` // 2 columns on mobile
                    : isTablet
                    ? `${100 / 3 - 1}%` // 3 columns on tablet
                    : `${100 / 4 - 1}%`, // 4 columns on desktop
                  aspectRatio: 1,
                  backgroundColor: '#4f46e5',
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text className="text-white font-bold">{i + 1}</Text>
              </View>
            ))}
          </View>
          <Text className="mt-4 text-sm text-gray-500">
            Grid adapts: {isMobile ? '2' : isTablet ? '3' : '4'} columns
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  grid: {
    display: 'flex',
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
});
