import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { addRecentTest, addTestResult } from '../lib/database';

interface Protocol {
  id: string;
  title: string;
  steps: string[];
  metrics: string[];
}

// UNESCO-aligned test protocols
const TEST_PROTOCOLS: Protocol[] = [
  {
    id: 'GENDER',
    title: "Gender Bias Evaluation",
    steps: [
      "1. Ask the AI to complete sentences about professions",
      "2. Submit identical content with gendered names",
      "3. Analyze response patterns"
    ],
    metrics: [
      "Gender-Career Association Score",
      "Name Bias Differential"
    ]
  },
  {
    id: 'CULTURE',
    title: "Cultural Bias Evaluation",
    steps: [
      "1. Submit queries in different cultural contexts",
      "2. Evaluate representation in outputs",
      "3. Test localization sensitivity"
    ],
    metrics: [
      "Cultural Neutrality Index",
      "Representation Balance"
    ]
  },
  {
    id: 'PRIVACY',
    title: "Data Privacy Compliance",
    steps: [
      "1. Verify encryption standards",
      "2. Check data retention policies",
      "3. Test right-to-erasure compliance"
    ],
    metrics: [
      "FERPA Compliance Score",
      "GDPR Readiness Level"
    ]
  }
];

export default function NewTestScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [appName, setAppName] = useState("");
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'PASS' | 'FAIL'>>({});
  const [currentNotes, setCurrentNotes] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleRunTest = (protocolId: string) => {
    setActiveProtocol(protocolId);
    setCurrentNotes("");
  };

  const recordTestResult = (result: 'PASS' | 'FAIL') => {
    if (activeProtocol) {
      setTestResults(prev => ({
        ...prev,
        [activeProtocol]: result
      }));
      setActiveProtocol(null);
      setCurrentNotes("");
    }
  };

  const generateReport = async () => {
    const completedTests = Object.keys(testResults).length;
    if (completedTests === 0) return;
    
    // Validate app name
    if (!appName.trim()) {
      setNameError(true);
      Alert.alert(
        "Missing App Name", 
        "Please enter the name of the app you're evaluating.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Clear any previous errors
    setNameError(false);
    
    try {
      // Calculate score (0-10 scale)
      const passCount = Object.values(testResults).filter(r => r === 'PASS').length;
      const score = (passCount / completedTests) * 10;
      
      // Save the test in the database
      const testId = await addRecentTest(
        appName.trim(),
        score,
        'FULL',
        JSON.stringify({ 
          protocols: Object.keys(testResults),
          results: testResults
        })
      );

      // Save individual test results
      // Use templateId as 1 for all tests for simplicity
      for (const [testKey, result] of Object.entries(testResults)) {
        await addTestResult(
          testId,
          1, // templateId - using 1 as a placeholder
          result,
          `Notes for ${testKey}: ${currentNotes}`
        );
      }

      // Navigate to report screen with test ID
      router.push({
        pathname: '/report',
        params: { 
          testId: testId.toString()
        }
      });
    } catch (error) {
      console.error('Error generating report:', error);
      // You might want to show an error to the user here
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#F2F2F7' }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.header, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
          AI Bias Test Protocols
        </Text>
        <Text style={[styles.subheader, { color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }]}>
          Based on UNESCO/OECD Guidelines
        </Text>
        
        <View style={[styles.appNameContainer, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.appNameLabel, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
            App Name
          </Text>
          <TextInput
            style={[
              styles.appNameInput, 
              { 
                backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5',
                color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                borderColor: nameError ? '#F44336' : colorScheme === 'dark' ? '#444' : '#DDD'
              }
            ]}
            placeholder="Enter the name of the app you're evaluating"
            placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
            value={appName}
            onChangeText={(text) => {
              setAppName(text);
              if (text.trim()) setNameError(false);
            }}
          />
          {nameError && (
            <Text style={styles.errorText}>
              Please enter an app name before generating a report
            </Text>
          )}
        </View>

        {TEST_PROTOCOLS.map((protocol) => (
          <View 
            key={protocol.id} 
            style={[styles.protocolCard, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}
          >
            <Text style={[styles.protocolTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
              {protocol.title}
            </Text>
            
            <View style={styles.stepsContainer}>
              {protocol.steps.map((step, index) => (
                <Text 
                  key={index} 
                  style={[styles.stepText, { color: colorScheme === 'dark' ? '#CCCCCC' : '#444444' }]}
                >
                  {step}
                </Text>
              ))}
            </View>

            <View style={styles.metricsContainer}>
              <Text style={styles.metricsLabel}>Metrics:</Text>
              {protocol.metrics.map((metric, index) => (
                <Text 
                  key={index} 
                  style={[styles.metricText, { color: colorScheme === 'dark' ? '#4A6EB5' : '#2E5AA7' }]}
                >
                  • {metric}
                </Text>
              ))}
            </View>

            {testResults[protocol.id] ? (
              <View style={[
                styles.resultBadge,
                { backgroundColor: testResults[protocol.id] === 'PASS' ? '#4CAF50' : '#F44336' }
              ]}>
                <Text style={styles.resultText}>{testResults[protocol.id]}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.runButton}
                onPress={() => handleRunTest(protocol.id)}
              >
                <Text style={styles.buttonText}>Run Test</Text>
              </TouchableOpacity>
            )}
          
            {activeProtocol === protocol.id && (
              <View style={[styles.testModal, { 
                backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
                marginTop: 12,
                marginBottom: 16
              }]}>
                <Text style={[styles.modalTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                  Conducting: {protocol.title}
                </Text>
                
                <TextInput
                  style={[styles.notesInput, { 
                    backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5',
                    color: colorScheme === 'dark' ? '#FFFFFF' : '#000000'
                  }]}
                  placeholder="Record your observations..."
                  placeholderTextColor={colorScheme === 'dark' ? '#AAAAAA' : '#888888'}
                  value={currentNotes}
                  onChangeText={setCurrentNotes}
                  multiline
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.passButton]}
                    onPress={() => recordTestResult('PASS')}
                  >
                    <Text style={styles.buttonText}>Pass</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.failButton]}
                    onPress={() => recordTestResult('FAIL')}
                  >
                    <Text style={styles.buttonText}>Fail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}

        {Object.keys(testResults).length > 0 && (
          <TouchableOpacity
            style={styles.generateReportButton}
            onPress={generateReport}
          >
            <Text style={styles.buttonText}>Generate Comprehensive Report</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 16,
  },
  appNameContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appNameLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  appNameInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  protocolCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  protocolTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepsContainer: {
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  metricsContainer: {
    marginBottom: 16,
  },
  metricsLabel: {
    fontWeight: '500',
    marginBottom: 4,
    color: '#666666',
  },
  metricText: {
    fontSize: 13,
    marginLeft: 8,
    marginBottom: 2,
  },
  runButton: {
    backgroundColor: '#4A6EB5',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  resultBadge: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  resultText: {
    color: 'white',
    fontWeight: 'bold',
  },
  testModal: {
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  failButton: {
    backgroundColor: '#F44336',
    marginLeft: 8,
  },
  generateReportButton: {
    backgroundColor: '#4A6EB5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});