import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { getRecentTests, type RecentTest, getReviews } from '../lib/database';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user, logout } = useAuth(); // Get auth state and logout function
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [popularReviews, setPopularReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#F8F9FA';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A';
  const cardBackground = colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const secondaryText = colorScheme === 'dark' ? '#AAAAAA' : '#666666';

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const tests = getRecentTests(user.id, 5);
        setRecentTests(tests);
        
        const reviews = await getReviews();
        setPopularReviews(reviews.slice(0, 3));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: textColor, marginBottom: 20 }}>Please login to continue</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getScoreColor = (score: number): string => {
    if (score >= 7) return '#27AE60';
    if (score >= 4) return '#F39C12';
    return '#E74C3C';
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

  const renderReviewItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.reviewCard, { backgroundColor: cardBackground }]}
      onPress={() => router.push('/community')}
    >
      <Text style={[styles.reviewAppName, { color: textColor }]}>
        {item.appName}
      </Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= item.rating ? 'star' : 'star-outline'}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
      <Text 
        style={[styles.reviewText, { color: textColor }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.comment}
      </Text>
      <Text style={[styles.reviewAuthor, { color: secondaryText }]}>
        - {item.author}
      </Text>
    </TouchableOpacity>
  );

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View style={[styles.container, { 
        backgroundColor, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={48} color="#4A6EB5" />
        <Text style={[styles.title, { color: textColor }]}>Ethical AI Evaluator</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Detect bias in educational AI systems using research-backed methodologies
        </Text>
        
        {/* Display current user if logged in */}
        {user && (
          <Text style={[styles.userText, { color: secondaryText }]}>
            Welcome, {user.username}
          </Text>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/new-test')}
        >
          <Ionicons name="flask" size={20} color="white" />
          <Text style={styles.buttonText}>Start New Evaluation</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtonsRow}>
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colorScheme === 'dark' ? '#444' : '#DDD' }]}
            onPress={() => router.push('/resources')}
          >
            <Ionicons name="library" size={20} color="#4A6EB5" />
            <Text style={[styles.secondaryButtonText, { color: textColor }]}>
              Research
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colorScheme === 'dark' ? '#444' : '#DDD' }]}
            onPress={() => router.push('/community')}
          >
            <Ionicons name="people" size={20} color="#4A6EB5" />
            <Text style={[styles.secondaryButtonText, { color: textColor }]}>
              Community
            </Text>
          </TouchableOpacity>
          
          {/* Add Logout Button */}
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colorScheme === 'dark' ? '#444' : '#DDD' }]}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={20} color="#4A6EB5" />
            <Text style={[styles.secondaryButtonText, { color: textColor }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Evaluations Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Evaluations</Text>
        
        {recentTests.length > 0 ? (
          <FlatList
            data={recentTests}
            renderItem={renderTestItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={[styles.emptyState, { backgroundColor: cardBackground }]}>
            <Ionicons name="analytics-outline" size={40} color={secondaryText} />
            <Text style={[styles.emptyStateText, { color: textColor }]}>
              No evaluations yet
            </Text>
          </View>
        )}
      </View>

      {/* Community Reviews Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Community Reviews</Text>
          <TouchableOpacity onPress={() => router.push('/community')}>
            <Text style={[styles.seeAllText, { color: '#4A6EB5' }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {popularReviews.length > 0 ? (
          <FlatList
            data={popularReviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <View style={[styles.emptyState, { backgroundColor: cardBackground }]}>
            <Ionicons name="chatbubble-outline" size={40} color={secondaryText} />
            <Text style={[styles.emptyStateText, { color: textColor }]}>
              No reviews yet
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: secondaryText }]}>
          Developed using UNESCO AI Education Guidelines
        </Text>
      </View>
    </ScrollView>
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
    marginBottom: 12,
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
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 16,
  },
  horizontalList: {
    paddingRight: 24,
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
  reviewCard: {
    width: 280,
    padding: 16,
    borderRadius: 10,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewAppName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewAuthor: {
    fontSize: 12,
    fontStyle: 'italic',
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
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
  },
  userText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});