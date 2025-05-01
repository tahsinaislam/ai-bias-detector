import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface User {
  id: string;
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (username: string, password: string): Promise<boolean> => {
    try {

      const existingUsers = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(existingUsers);
      
      if (users.some((u: User) => u.username === username)) {
        Alert.alert('Error', 'Username already exists');
        return false;
      }

      const newUser = { 
        id: Date.now().toString(), 
        username, 
        password
      };

      await AsyncStorage.setItem('users', JSON.stringify([...users, newUser]));
      
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const existingUsers = await AsyncStorage.getItem('users') || '[]';
      const users = JSON.parse(existingUsers);
      
      const foundUser = users.find((u: User) => 
        u.username === username && u.password === password
      );

      if (foundUser) {
        await AsyncStorage.setItem('user', JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      } else {
        Alert.alert('Error', 'Invalid username or password');
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);