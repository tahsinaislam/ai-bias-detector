import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { getRecentTests, type RecentTest, addSampleData } from '../lib/database';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#F8F9FA';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A';
  const cardBackground = colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const secondaryText = colorScheme === 'dark' ? '#AAAAAA' : '#666666';

  useEffect(() => {
    // Load recent tests from database
    const loadTests = () => {
      try {
        // Make sure we have some sample data
        addSampleData();
        
        // Get the most recent tests
        const tests = getRecentTests(10);
        setRecentTests(tests);
      } catch (error) {
        console.error('Error loading tests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTests();
  }, []);

  const getScoreColor = (score: number): string => {
    if (score >= 7) return '#27AE60'; // Green for good scores
    if (score >= 4) return '#F39C12'; // Orange for medium scores
    return '#E74C3C'; // Red for poor scores
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Render a test item
  const renderTestItem = ({ item }: { item: RecentTest }) => (
    <TouchableOpacity 
      style={[styles.testCard, { backgroundColor: cardBackground }]}
      onPress={() => router.push({ pathname: '/report', params: { testId: item.id } })}
    >
      <View style={styles.testInfo}>
        <Text style={[styles.testName, { color: textColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.testDate, { color: secondaryText }]}>
          {formatDate(item.date)}
        </Text>
      </View>
      <View style={[
        styles.scoreContainer, 
        { backgroundColor: getScoreColor(item.score) }
      ]}>
        <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );

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

      <View style={styles.recentTestsSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Evaluations</Text>
        
        {loading ? (
          <Text style={[styles.loadingText, { color: secondaryText }]}>Loading evaluations...</Text>
        ) : recentTests.length > 0 ? (
          <FlatList
            data={recentTests}
            renderItem={renderTestItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={[styles.emptyState, { backgroundColor: cardBackground }]}>
            <Ionicons name="analytics-outline" size={40} color={secondaryText} />
            <Text style={[styles.emptyStateText, { color: textColor }]}>
              No evaluations yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: secondaryText }]}>
              Start a new evaluation to see results here
            </Text>
          </View>
        )}
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
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
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
    marginBottom: 24,
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
  recentTestsSection: {
    flex: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  testCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  testDate: {
    fontSize: 12,
  },
  scoreContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 24,
  },
  emptyState: {
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
  },
});