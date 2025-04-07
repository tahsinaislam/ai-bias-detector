import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const colorScheme = useColorScheme();
  
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
    </Stack>
  );
}