// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useColorScheme } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleLogin = async () => {
    if (username.trim()) {
      await login(username);
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#F8F9FA' }]}>
      <Text style={[styles.title, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
        Enter Your Username
      </Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colorScheme === 'dark' ? '#252525' : '#FFFFFF',
          color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
        }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogin}
        disabled={!username.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4A6EB5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});