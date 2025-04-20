// Type definitions
export interface RecentTest {
  id: number;
  name: string;
  date: string;
  score: number;
  testType: string;
  userId: string;
  details?: Record<string, unknown>;
}

export interface TestTemplate {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  steps: string[];
  metrics: string[];
}

export interface TestResult {
  id: number;
  testId: number;
  templateId: number;
  result: 'PASS' | 'FAIL' | 'WARNING';
  notes: string;
  userId: string;
  timestamp: string;
}

export interface Review {
  id: number;
  appName: string;
  rating: number;
  comment: string;
  author: string;
  userId: string;
  timestamp: string;
}

// In-memory storage
let recentTests: RecentTest[] = [];
let testResults: TestResult[] = [];
let reviews: Review[] = [];
let nextTestId = 1;
let nextResultId = 1;
let nextReviewId = 1;

// Default templates
const defaultTemplates: TestTemplate[] = [
  {
    id: 1,
    title: 'Gender Bias',
    description: 'Evaluate gender stereotypes in AI responses',
    icon: 'male-female-outline',
    color: '#4A6EB5',
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
    id: 2,
    title: 'Cultural Bias',
    description: 'Assess cultural representation and sensitivity',
    icon: 'earth-outline',
    color: '#50A162',
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
    id: 3,
    title: 'Privacy Compliance',
    description: 'Evaluate data privacy and security practices',
    icon: 'shield-checkmark-outline',
    color: '#7D3C98',
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

// Database initialization
export const initDatabase = (): void => {
  console.log('In-memory database initialized');
};

// Test management functions
export const addRecentTest = (
  name: string, 
  score: number,
  testType: string,
  userId: string,
  details: Record<string, unknown> = {}
): number => {
  try {
    const id = nextTestId++;
    
    const newTest: RecentTest = {
      id,
      name,
      date: new Date().toISOString(),
      score,
      testType,
      userId,
      details
    };
    
    recentTests.push(newTest);
    console.log(`Added test ${id}: ${name} for user ${userId}`);
    return id;
  } catch (error) {
    console.error('Error adding test:', error);
    return -1;
  }
};

export const getRecentTests = (userId: string, limit: number = 5): RecentTest[] => {
  try {
    return [...recentTests]
      .filter(test => test.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent tests:', error);
    return [];
  }
};

export const getTestById = (id: number, userId: string): RecentTest | null => {
  try {
    return recentTests.find(test => test.id === id && test.userId === userId) || null;
  } catch (error) {
    console.error('Error getting test by ID:', error);
    return null;
  }
};

// Test result functions
export const addTestResult = (
  testId: number,
  templateId: number,
  result: 'PASS' | 'FAIL' | 'WARNING',
  userId: string,
  notes: string = ''
): number => {
  try {
    const id = nextResultId++;
    
    const newResult: TestResult = {
      id,
      testId,
      templateId,
      result,
      notes,
      userId,
      timestamp: new Date().toISOString()
    };
    
    testResults.push(newResult);
    console.log(`Added test result ${id} for test ${testId} by user ${userId}`);
    return id;
  } catch (error) {
    console.error('Error adding test result:', error);
    return -1;
  }
};

export const getTestResults = (testId: number, userId: string): TestResult[] => {
  try {
    return testResults
      .filter(result => result.testId === testId && result.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch (error) {
    console.error('Error getting test results:', error);
    return [];
  }
};

// Template functions
export const getTestTemplates = (): TestTemplate[] => {
  try {
    return [...defaultTemplates];
  } catch (error) {
    console.error('Error getting test templates:', error);
    return [];
  }
};

export const getTemplateById = (id: number): TestTemplate | null => {
  try {
    return defaultTemplates.find(template => template.id === id) || null;
  } catch (error) {
    console.error('Error getting template by ID:', error);
    return null;
  }
};

// Review functions
export const addReview = (
  appName: string,
  rating: number,
  comment: string,
  userId: string,
  author: string = 'Anonymous'
): number => {
  try {
    const id = nextReviewId++;
    
    const newReview: Review = {
      id,
      appName,
      rating,
      comment,
      author,
      userId,
      timestamp: new Date().toISOString()
    };
    
    reviews.push(newReview);
    console.log(`Added review ${id} for app ${appName} by user ${userId}`);
    return id;
  } catch (error) {
    console.error('Error adding review:', error);
    return -1;
  }
};

export const getReviews = (options?: { appName?: string; userId?: string }): Review[] => {
  try {
    let filteredReviews = [...reviews];
    
    if (options?.appName) {
      filteredReviews = filteredReviews.filter(
        review => review.appName.toLowerCase().includes((options.appName ?? '').toLowerCase())
      );
    }
    
    if (options?.userId) {
      filteredReviews = filteredReviews.filter(
        review => review.userId === options.userId
      );
    }
    
    return filteredReviews.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const getAverageRating = (appName: string, userId?: string): number | null => {
  try {
    let appReviews = reviews.filter(review => review.appName === appName);
    
    if (userId) {
      appReviews = appReviews.filter(review => review.userId === userId);
    }
    
    if (appReviews.length === 0) return null;
    
    const total = appReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / appReviews.length;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return null;
  }
};

// Utility functions
export const deleteTest = (id: number, userId: string): void => {
  try {
    const index = recentTests.findIndex(test => test.id === id && test.userId === userId);
    if (index !== -1) {
      recentTests.splice(index, 1);
    }
    
    testResults = testResults.filter(result => 
      result.testId !== id && result.userId === userId
    );
    console.log(`Deleted test ${id} and associated results for user ${userId}`);
  } catch (error) {
    console.error('Error deleting test:', error);
  }
};

export const deleteReview = (id: number, userId: string): void => {
  try {
    const index = reviews.findIndex(review => 
      review.id === id && review.userId === userId
    );
    if (index !== -1) {
      reviews.splice(index, 1);
      console.log(`Deleted review ${id} for user ${userId}`);
    }
  } catch (error) {
    console.error('Error deleting review:', error);
  }
};

export const clearAllTests = (): void => {
  try {
    recentTests = [];
    testResults = [];
    nextTestId = 1;
    nextResultId = 1;
    console.log('Cleared all tests and results');
  } catch (error) {
    console.error('Error clearing all tests:', error);
  }
};

export const clearAllReviews = (): void => {
  try {
    reviews = [];
    nextReviewId = 1;
    console.log('Cleared all reviews');
  } catch (error) {
    console.error('Error clearing reviews:', error);
  }
};

// Initialize with empty data (no sample data)
initDatabase();