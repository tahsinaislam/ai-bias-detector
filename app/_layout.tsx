import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';

function LayoutContent() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerRight: () => (
            <Ionicons 
              name="information-circle" 
              size={24} 
              color={colorScheme === 'dark' ? '#4A6EB5' : '#2E5AA7'} 
              style={{ marginRight: 15 }}
            />
          )
        }} 
      />
      <Stack.Screen name="new-test" options={{ title: 'Bias Evaluation' }} />
      <Stack.Screen name="report" options={{ title: 'Assessment Report' }} />
      <Stack.Screen name="resources" options={{ title: 'Research Library' }} />
      <Stack.Screen name="settings" options={{ title: 'App Settings' }} />
      <Stack.Screen name="community" options={{ title: 'Community Reviews' }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}