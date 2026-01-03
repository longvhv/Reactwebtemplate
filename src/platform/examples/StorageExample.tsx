/**
 * Storage Example
 * 
 * Demonstrates cross-platform storage using AsyncStorage
 */

import React, { useState, useEffect } from 'react';
import { View } from '../primitives/View';
import { Text } from '../primitives/Text';
import { Touchable } from '../primitives/Touchable';
import { platformStorage, StorageHelpers } from '../storage';
import { AsyncStorage } from '../storage/AsyncStorage';
import { showAlert } from '../utils/alert'; // ✅ Use platform-safe alert

interface User {
  name: string;
  email: string;
  age: number;
}

export function StorageExample() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [allKeys, setAllKeys] = useState<string[]>([]);

  // Load user on mount
  useEffect(() => {
    loadUser();
    loadAllKeys();
  }, []);

  const loadUser = async () => {
    const savedUser = await StorageHelpers.getJSON<User>('user');
    if (savedUser) {
      setUser(savedUser);
      setName(savedUser.name);
      setEmail(savedUser.email);
      setAge(savedUser.age.toString());
    }
  };

  const loadAllKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();
    setAllKeys(keys);
  };

  const saveUser = async () => {
    if (!name || !email || !age) {
      showAlert('Please fill all fields'); // ✅ Platform-safe alert
      return;
    }

    const userData: User = {
      name,
      email,
      age: parseInt(age),
    };

    await StorageHelpers.setJSON('user', userData);
    setUser(userData);
    await loadAllKeys();
    showAlert('User saved successfully!'); // ✅ Platform-safe alert
  };

  const clearUser = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setName('');
    setEmail('');
    setAge('');
    await loadAllKeys();
    showAlert('User cleared!'); // ✅ Platform-safe alert
  };

  const clearAll = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setName('');
    setEmail('');
    setAge('');
    setAllKeys([]);
    showAlert('All storage cleared!'); // ✅ Platform-safe alert
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4" style={styles.container}>
        {/* Current User */}
        {user && (
          <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
            <Text className="text-xl font-bold mb-2" style={styles.title}>
              Saved User
            </Text>
            <Text className="text-gray-600">Name: {user.name}</Text>
            <Text className="text-gray-600">Email: {user.email}</Text>
            <Text className="text-gray-600">Age: {user.age}</Text>
          </View>
        )}

        {/* User Form */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-4" style={styles.title}>
            Save User Data
          </Text>

          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              className="border border-gray-300 rounded-lg px-4 py-2"
              style={styles.input}
            />
          </View>

          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              className="border border-gray-300 rounded-lg px-4 py-2"
              style={styles.input}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-4 py-2"
              style={styles.input}
            />
          </View>

          <View className="flex-row gap-2" style={styles.buttonRow}>
            <Touchable
              onPress={saveUser}
              className="flex-1 bg-indigo-600 px-4 py-3 rounded-lg"
              style={styles.button}
            >
              <Text className="text-white text-center font-semibold">Save</Text>
            </Touchable>

            <Touchable
              onPress={clearUser}
              className="flex-1 bg-red-600 px-4 py-3 rounded-lg"
              style={[styles.button, { backgroundColor: '#dc2626' }]}
            >
              <Text className="text-white text-center font-semibold">Clear</Text>
            </Touchable>
          </View>
        </View>

        {/* Storage Keys */}
        <View className="mb-6 p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-2" style={styles.title}>
            All Storage Keys ({allKeys.length})
          </Text>
          {allKeys.length === 0 ? (
            <Text className="text-gray-500 italic">No keys in storage</Text>
          ) : (
            <View style={styles.keyList}>
              {allKeys.map((key, index) => (
                <View
                  key={key}
                  className="px-3 py-2 bg-gray-100 rounded-lg mb-2"
                  style={styles.keyItem}
                >
                  <Text className="text-sm font-mono text-gray-700">{key}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Advanced Operations */}
        <View className="p-4 bg-white rounded-lg shadow" style={styles.card}>
          <Text className="text-xl font-bold mb-4" style={styles.title}>
            Advanced Operations
          </Text>

          <Touchable
            onPress={async () => {
              const hasUser = await StorageHelpers.hasKey('user');
              showAlert(`User exists: ${hasUser ? 'Yes' : 'No'}`);
            }}
            className="mb-2 bg-blue-600 px-4 py-3 rounded-lg"
            style={styles.button}
          >
            <Text className="text-white text-center font-semibold">
              Check if 'user' exists
            </Text>
          </Touchable>

          <Touchable
            onPress={async () => {
              const keys = ['user', 'theme', 'language'];
              const items = await AsyncStorage.multiGet(keys);
              console.log('Multi-get result:', items);
              showAlert(`Fetched ${items.length} items. Check console.`);
            }}
            className="mb-2 bg-purple-600 px-4 py-3 rounded-lg"
            style={[styles.button, { backgroundColor: '#9333ea' }]}
          >
            <Text className="text-white text-center font-semibold">
              Multi-get Example
            </Text>
          </Touchable>

          <Touchable
            onPress={clearAll}
            className="bg-red-600 px-4 py-3 rounded-lg"
            style={[styles.button, { backgroundColor: '#dc2626' }]}
          >
            <Text className="text-white text-center font-semibold">
              Clear All Storage
            </Text>
          </Touchable>
        </View>
      </View>
    </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keyList: {
    marginTop: 8,
  },
  keyItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 8,
  },
});