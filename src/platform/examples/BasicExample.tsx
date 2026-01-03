/**
 * Basic Platform Usage Example
 * 
 * This example demonstrates the basic usage of platform primitives
 * that work on both web and React Native
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  StyleSheet,
} from '../index';

export function BasicExample() {
  const [text, setText] = React.useState('');
  const [count, setCount] = React.useState(0);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4" style={styles.container}>
        {/* Platform Info */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Platform Information
          </Text>
          <Text className="text-gray-600">
            Current Platform: {Platform.OS}
          </Text>
          <Text className="text-gray-600">
            Is Web: {Platform.isWeb() ? 'Yes' : 'No'}
          </Text>
          <Text className="text-gray-600">
            Is Native: {Platform.isNative() ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Image Example */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Image Component
          </Text>
          <Image
            source={{ uri: 'https://picsum.photos/400/300' }}
            className="w-full h-48 rounded-lg"
            style={styles.image}
            alt="Example image"
            resizeMode="cover"
          />
        </View>

        {/* TextInput Example */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Text Input
          </Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type something..."
            className="border border-gray-300 rounded-lg px-4 py-2"
            style={styles.input}
          />
          <Text className="mt-2 text-gray-600">
            You typed: {text || '(nothing yet)'}
          </Text>
        </View>

        {/* TouchableOpacity Example */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Touchable Button
          </Text>
          <TouchableOpacity
            onPress={() => setCount(count + 1)}
            className="bg-indigo-600 px-6 py-3 rounded-lg"
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold">
              Press me! (Count: {count})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Platform-Specific Styling */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Platform-Specific Styling
          </Text>
          <View
            className="p-4 bg-blue-100 rounded-lg"
            style={Platform.select({
              web: {
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
              native: {
                elevation: 4,
              },
              default: {},
            })}
          >
            <Text className="text-blue-900">
              This view has platform-specific shadows
            </Text>
          </View>
        </View>

        {/* Multiple Touches */}
        <View className="p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            Multiple Buttons
          </Text>
          <View className="flex-row gap-2" style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setCount(count - 1)}
              className="flex-1 bg-red-600 px-4 py-2 rounded-lg"
              style={styles.smallButton}
            >
              <Text className="text-white text-center">-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCount(0)}
              className="flex-1 bg-gray-600 px-4 py-2 rounded-lg"
              style={styles.smallButton}
            >
              <Text className="text-white text-center">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCount(count + 1)}
              className="flex-1 bg-green-600 px-4 py-2 rounded-lg"
              style={styles.smallButton}
            >
              <Text className="text-white text-center">+</Text>
            </TouchableOpacity>
          </View>
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
  image: {
    width: '100%',
    height: 192,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
