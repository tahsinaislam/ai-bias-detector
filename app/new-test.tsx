import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// UNESCO-aligned test protocols
const TEST_PROTOCOLS = [
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
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [currentNotes, setCurrentNotes] = useState("");

  const handleRunTest = (protocolId: string) => {
    setActiveProtocol(protocolId);
  };

  const recordTestResult = (result: string) => {
    if (activeProtocol) {
      setTestResults(prev => ({
        ...prev,
        [activeProtocol]: result
      }));
      setActiveProtocol(null);
      setCurrentNotes("");
    }
  };

  const generateReport = () => {
    const completedTests = Object.keys(testResults).length;
    const score = completedTests > 0 
      ? Math.floor((Object.values(testResults).filter(r => r === 'PASS').length / completedTests) * 100)
      : 0;

    router.push({
      pathname: '/report',
      params: { 
        score: score.toString(),
        testData: JSON.stringify({
          protocols: TEST_PROTOCOLS.map(p => p.id),
          results: testResults
        })
      }
    });
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

        {TEST_PROTOCOLS.map(protocol => (
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
          </View>
        ))}

        {activeProtocol && (
          <View style={[styles.testModal, { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
              Conducting: {TEST_PROTOCOLS.find(p => p.id === activeProtocol)?.title}
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
    marginBottom: 24,
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