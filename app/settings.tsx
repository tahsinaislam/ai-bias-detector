import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#F8F9FA';
  const cardColor = colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = colorScheme === 'dark' ? '#AAAAAA' : '#666666';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingText}>
            <Ionicons name="moon" size={20} color={secondaryTextColor} />
            <Text style={[styles.settingLabel, { color: textColor, marginLeft: 12 }]}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#4A6EB5' }}
            thumbColor={darkMode ? '#FFFFFF' : '#F4F3F4'}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingText}>
            <Ionicons name="notifications" size={20} color={secondaryTextColor} />
            <Text style={[styles.settingLabel, { color: textColor, marginLeft: 12 }]}>Enable Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#4A6EB5' }}
            thumbColor={notifications ? '#FFFFFF' : '#F4F3F4'}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Privacy</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingText}>
            <Ionicons name="analytics" size={20} color={secondaryTextColor} />
            <Text style={[styles.settingLabel, { color: textColor, marginLeft: 12 }]}>Share Analytics</Text>
          </View>
          <Switch
            value={analytics}
            onValueChange={setAnalytics}
            trackColor={{ false: '#767577', true: '#4A6EB5' }}
            thumbColor={analytics ? '#FFFFFF' : '#F4F3F4'}
          />
        </View>

        <TouchableOpacity style={styles.privacyButton}>
          <Text style={[styles.privacyButtonText, { color: '#4A6EB5' }]}>View Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.aboutCard, { backgroundColor: cardColor }]}>
        <Ionicons name="shield-checkmark" size={32} color="#4A6EB5" />
        <Text style={[styles.appName, { color: textColor }]}>Ethical AI Evaluator</Text>
        <Text style={[styles.versionText, { color: secondaryTextColor }]}>Version 1.0.0</Text>
        <Text style={[styles.aboutText, { color: secondaryTextColor }]}>
          Developed in accordance with UNESCO AI Education Guidelines
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
  },
  privacyButton: {
    paddingVertical: 16,
    marginTop: 8,
  },
  privacyButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 8,
  },
  versionText: {
    fontSize: 14,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});