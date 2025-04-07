import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RESOURCES = [
  {
    title: "UNESCO AI Education Guidelines",
    description: "Global standards for ethical AI implementation in education systems",
    url: "https://unesdoc.unesco.org/ark:/48223/pf0000373432",
    icon: "earth",
    category: "Framework"
  },
  {
    title: "OECD AI Principles",
    description: "International policy guidelines for trustworthy AI development",
    url: "https://oecd.ai/en/ai-principles",
    icon: "globe",
    category: "Policy"
  },
  {
    title: "Algorithmic Bias in Education",
    description: "Research paper analyzing bias in learning algorithms (Williamson 2019)",
    url: "https://journals.sagepub.com/doi/full/10.1177/1745499919829680",
    icon: "document-text",
    category: "Research"
  },
  {
    title: "AI Fairness 360 Toolkit",
    description: "Open-source library with 70+ fairness metrics from IBM Research",
    url: "https://aif360.mybluemix.net/",
    icon: "hammer",
    category: "Tool"
  },
  {
    title: "EU AI Act (Education Provisions)",
    description: "Regulatory framework for AI systems in educational contexts",
    url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
    icon: "shield-checkmark",
    category: "Regulation"
  }
];

export default function ResourcesScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#F8F9FA';
  const cardColor = colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A';
  const secondaryTextColor = colorScheme === 'dark' ? '#AAAAAA' : '#666666';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Research Library</Text>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          Authoritative resources on AI ethics in education
        </Text>
      </View>

      {RESOURCES.map((resource, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: cardColor }]}
          onPress={() => Linking.openURL(resource.url)}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F0F0F0' }]}>
              <Ionicons name={resource.icon as any} size={20} color="#4A6EB5" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: textColor }]}>{resource.title}</Text>
              <Text style={[styles.cardCategory, { color: '#4A6EB5' }]}>{resource.category}</Text>
            </View>
            <Ionicons name="open-outline" size={20} color={secondaryTextColor} />
          </View>
          <Text style={[styles.cardDescription, { color: secondaryTextColor }]}>{resource.description}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: secondaryTextColor }]}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
  },
});