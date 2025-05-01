import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addReview, getReviews, getAverageRating } from '../lib/database';

export default function CommunityScreen() {
  const colorScheme = useColorScheme();
  const [reviews, setReviews] = useState<any[]>([]);
  const [appName, setAppName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const reviewsData = await getReviews();
      setReviews(reviewsData);
      
      if (appName.trim()) {
        const avg = await getAverageRating(appName.trim());
        setAverageRating(avg);
      } else {
        setAverageRating(null);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!appName.trim() || !comment.trim()) return;
    
    setSubmitting(true);
    try {
      const userId = 'exampleUserId'; // Replace with actual user ID logic
      await addReview(appName.trim(), rating, comment.trim(), userId);
      setAppName('');
      setComment('');
      setRating(3);
      await loadReviews(); // Refresh the list
    } catch (error) {
      console.error('Error adding review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size = 20) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#F8F9FA' }]}>
      <View style={[styles.formContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
          Share Your Experience
        </Text>
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
          }]}
          placeholder="App Name"
          placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
          value={appName}
          onChangeText={(text) => {
            setAppName(text);
            if (text.trim()) {
              loadReviews();
            }
          }}
        />
        
        {averageRating !== null && (
          <View style={styles.averageRatingContainer}>
            <Text style={[styles.averageRatingText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
              Average Rating:
            </Text>
            {renderStars(Math.round(averageRating), 16)}
            <Text style={[styles.averageRatingValue, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
              ({averageRating.toFixed(1)})
            </Text>
          </View>
        )}
        
        <View style={styles.ratingContainer}>
          <Text style={[styles.label, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
            Your Rating:
          </Text>
          <View style={styles.starsInputContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => setRating(star)}
                disabled={submitting}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={28}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TextInput
          style={[styles.commentInput, { 
            backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
          }]}
          placeholder="Your review..."
          placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          editable={!submitting}
        />
        
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!appName.trim() || !comment.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#4A6EB5' : '#2E5AA7'} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.reviewCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
              <View style={styles.reviewHeader}>
                <Text style={[styles.appName, { color: colorScheme === 'dark' ? '#4A6EB5' : '#2E5AA7' }]}>
                  {item.appName}
                </Text>
                {renderStars(item.rating)}
              </View>
              <Text style={[styles.comment, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                {item.comment}
              </Text>
              <Text style={[styles.author, { color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }]}>
                - {item.author} • {new Date(item.timestamp).toLocaleDateString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }]}>
              {appName.trim() ? `No reviews yet for ${appName}. Be the first to share!` : 'Search for an app to see reviews'}
            </Text>
          }
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadReviews}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  averageRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  averageRatingText: {
    marginRight: 8,
    fontSize: 14,
  },
  averageRatingValue: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginRight: 12,
    fontSize: 16,
  },
  starsInputContainer: {
    flexDirection: 'row',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4A6EB5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
  reviewCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  comment: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  author: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});