import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useColorScheme } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleAuth = async () => {
    const success = isLogin 
      ? await login(username, password)
      : await register(username, password);
    
    if (success) {
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#F8F9FA' }]}>
      <Text style={[styles.title, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
        {isLogin ? 'Login' : 'Register'}
      </Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colorScheme === 'dark' ? '#252525' : '#FFFFFF',
          color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
        }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: colorScheme === 'dark' ? '#252525' : '#FFFFFF',
          color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
        }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={!username.trim() || !password.trim()}
      >
        <Text style={styles.buttonText}>
          {isLogin ? 'Login' : 'Register'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={[styles.toggleText, { color: colorScheme === 'dark' ? '#4A6EB5' : '#2E5AA7' }]}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Text>
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
  toggleText: {
    textAlign: 'center',
    marginTop: 15,
  },
});