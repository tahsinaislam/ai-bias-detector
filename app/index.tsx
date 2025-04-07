import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#F8F9FA';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={48} color="#4A6EB5" />
        <Text style={[styles.title, { color: textColor }]}>Ethical AI Evaluator</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Detect bias in educational AI systems using research-backed methodologies
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/new-test')}
        >
          <Ionicons name="flask" size={20} color="white" />
          <Text style={styles.buttonText}>Start New Evaluation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.secondaryButton, { borderColor: colorScheme === 'dark' ? '#444' : '#DDD' }]}
          onPress={() => router.push('/resources')}
        >
          <Ionicons name="library" size={20} color="#4A6EB5" />
          <Text style={[styles.secondaryButtonText, { color: textColor }]}>
            Research Library
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colorScheme === 'dark' ? '#AAA' : '#666' }]}>
          Developed using UNESCO AI Education Guidelines
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  buttonGroup: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4A6EB5',
    padding: 18,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
  },
});