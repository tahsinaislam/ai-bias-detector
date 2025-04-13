import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTestById, getTestResults } from '../lib/database';

interface ReportParams {
  testId?: string;
}

export default function ReportScreen() {
  const params = useLocalSearchParams() as ReportParams;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [score, setScore] = useState<number | null>(null);
  const [testDetails, setTestDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestData = async () => {
      if (!params.testId) {
        setLoading(false);
        return;
      }

      try {
        const testId = parseInt(params.testId);
        
        // Get test data from database
        const testData = await getTestById(testId);
        if (testData) {
          setScore(testData.score);
          setTestDetails(testData.details);
        }
        
        // Get test results
        const results = await getTestResults(testId);
        console.log('Test results:', results);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading test data:', error);
        setLoading(false);
      }
    };

    loadTestData();
  }, [params.testId]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#4CAF50';
    if (score >= 5) return '#FFC107';
    return '#F44336';
  };

  const getRecommendation = (score: number | null) => {
    if (score === null) return "No assessment data available";
    if (score >= 8) return "Meets UNESCO standards for ethical AI in education";
    if (score >= 5) return "Moderate risk - Use with monitoring and safeguards";
    return "High risk - Not recommended for educational use";
  };

  if (loading) {
    return (
      <View style={[styles.container, { 
        backgroundColor: colorScheme === 'dark' ? '#121212' : '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center'
      }]}>
        <Text style={{ color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }}>
          Loading report data...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#F8F9FA' }]}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]} 
          onPress={() => router.push('/')}
        >
          <Ionicons name="arrow-back" size={22} color={colorScheme === 'dark' ? '#FFFFFF' : '#4A6EB5'} />
          <Text style={[styles.backButtonText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#4A6EB5' }]}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.headerCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={[styles.headerTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }]}>
          AI Ethics Assessment Report
        </Text>
        
        {score !== null ? (
          <>
            <View style={styles.scoreContainer}>
              <View style={[styles.scoreCircle, { backgroundColor: getScoreColor(score) }]}>
                <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
              </View>
              <Text style={[styles.scoreLabel, { color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }]}>
                Overall Score
              </Text>
            </View>

            <View style={styles.recommendationContainer}>
              <Ionicons 
                name="bulb-outline" 
                size={20} 
                color={colorScheme === 'dark' ? '#4A6EB5' : '#2E5AA7'} 
              />
              <Text style={[styles.recommendationText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }]}>
                {getRecommendation(score)}
              </Text>
            </View>
          </>
        ) : (
          <Text style={[styles.noDataText, { color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }]}>
            No assessment data available
          </Text>
        )}
      </View>

      {testDetails && testDetails.results && (
        <View style={[styles.detailsCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.detailsTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }]}>
            Detailed Findings
          </Text>

          {Object.entries(testDetails.results).map(([testId, result]) => (
            <View key={testId} style={styles.testResultItem}>
              <View style={styles.testResultHeader}>
                <View style={[
                  styles.resultIndicator,
                  { backgroundColor: result === 'PASS' ? '#4CAF50' : '#F44336' }
                ]} />
                <Text style={[styles.testName, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }]}>
                  {testId.replace('-', ' ')}
                </Text>
              </View>
              <Text style={[styles.testResult, { color: result === 'PASS' ? '#4CAF50' : '#F44336' }]}>
                {result === 'PASS' ? 'Met Standards' : 'Potential Issues Found'}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.footerCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={[styles.footerTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }]}>
          Methodology
        </Text>
        <Text style={[styles.footerText, { color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }]}>
          Assessment based on UNESCO's AI Education Guidelines and OECD AI Principles. Tests evaluate for bias, fairness, and transparency in educational AI systems.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.returnHomeButton, { backgroundColor: '#4A6EB5' }]}
        onPress={() => router.push('/')}
      >
        <Ionicons name="home" size={20} color="white" />
        <Text style={styles.returnHomeButtonText}>Return to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButtonContainer: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  headerCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 16,
    marginTop: 8,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  recommendationText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  detailsCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  testResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  testResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  testName: {
    fontSize: 16,
  },
  testResult: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  returnHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  returnHomeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});