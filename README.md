# AI Bias Detector for Educational AI Systems

A mobile application prototype designed to help teachers identify and address bias in AI-driven educational technologies through accessible evaluation tools and community-driven insights.

## 📋 Abstract

The increasing integration of artificial intelligence (AI) in education has raised concerns about algorithmic bias and its impact on student outcomes. Despite growing awareness, many educators lack accessible tools to detect and mitigate bias in AI-driven educational technologies. This project presents the development of a mobile application designed to help teachers identify AI bias using research-backed methodologies, incorporating UNESCO and OECD AI ethics guidelines.

## 🎯 Problem Statement

AI systems in education often inherit biases present in their training data, potentially reinforcing harmful stereotypes or leading to inequitable outcomes for students. Studies reveal that AI systems frequently perpetuate biases related to gender, race, and socioeconomic status. This application addresses the critical gap between complex technical bias detection solutions and the practical needs of educators.

## 🚀 Live Application

**Access the application:** [https://ai-bias-detector--k2vj1rntpa.expo.app](https://ai-bias-detector--k2vj1rntpa.expo.app)

### Getting Started

1. Visit the login page: [https://ai-bias-detector--hz0e8wgzop.expo.app/login](https://ai-bias-detector--hz0e8wgzop.expo.app/login)
2. Tap "Need an account? Register" at the bottom
3. Enter a username and password
4. Tap "Register"
5. You'll automatically be logged in and redirected to the home screen

## ✨ Key Features

### 🔍 Bias Detection Module
- **Structured Assessment Workflows**: Guided evaluation protocols for three primary bias types:
  - **Gender Bias**: Detection of stereotypical gender associations in AI outputs
  - **Cultural Bias**: Identification of representation imbalances and cultural assumptions
  - **Privacy & Data Handling**: Assessment of AI systems' compliance with educational privacy standards
- **Simple Scoring System**: PASS/FAIL evaluation approach for accessibility
- **Step-by-Step Guidance**: Break down complex evaluation processes into manageable tasks

### 👥 Community Features
- **Review System**: Structured interface for submitting and viewing AI tool evaluations
- **Rating Mechanism**: 5-star rating system for quick assessment of AI tool quality
- **Experience Sharing**: Platform for educators to share findings and insights
- **Filtering Functionality**: Find relevant reviews based on AI tool names

### 📚 Resource Library
- **Curated Educational Materials**: Access to authoritative resources on AI ethics in education
- **UNESCO & OECD Guidelines**: Integration of international AI ethics frameworks
- **Reference Materials**: High-quality resources from recognized research institutions

## 🛠️ Technical Implementation

### Technology Stack
- **Frontend**: React Native (v0.72.3) for cross-platform mobile development
- **Navigation**: Expo Router for seamless screen transitions
- **State Management**: React Context API for authentication, local component state for screen-specific data
- **Data Storage**: In-memory storage (designed for future SQLite integration)
- **Platform**: iOS and Android compatible through single codebase

### Architecture
```
├── Authentication System
│   ├── Simplified user management
│   └── Username-based login (prototype stage)
├── Bias Detection Module
│   ├── Structured evaluation protocols
│   ├── Guided assessment workflows
│   └── Binary scoring system
├── Community Platform
│   ├── Review submission system
│   ├── Rating mechanism
│   └── Content filtering
└── Resource Library
    ├── Curated content access
    └── External resource linking
```

### Design Principles
- **Mobile-First**: Optimized for devices commonly available in educational settings
- **Accessibility**: Usable by teachers without technical expertise in AI or data science
- **Adaptive Interface**: Supports both light and dark modes for various usage environments
- **Learnability**: Step-by-step workflows with visual cues and descriptive guidance

## 📊 Research Foundation

### Theoretical Framework
Based on UNESCO AI Education Guidelines (2021) with four key evaluation domains:
1. **Data Representation and Equity**
2. **Algorithmic Fairness and Transparency**
3. **Educational Appropriateness and Inclusivity**
4. **Governance and Accountability**

### Supporting Research
- Mobile platforms achieve significantly higher engagement rates among teachers compared to web platforms
- Community-based approaches to AI governance in education show greater effectiveness than isolated expert models
- Teachers prefer streamlined interfaces with clear guidance and step-by-step workflows

## 🎥 Demo

Watch the project presentation: [Loom Video](https://www.loom.com/share/c66061fd97a8443bb15c90abab6dc61d?sid=709e259c-aec6-44d5-ae73-f70da970833c)

## 📝 Usage Instructions

### For Individual Teachers
1. **Start New Evaluation**: Begin bias assessment of an AI tool using guided protocols
2. **Follow Assessment Steps**: Complete structured evaluation for gender, cultural, and privacy bias
3. **Review Results**: Receive immediate feedback on assessment progress
4. **Access Resources**: Explore educational materials on AI ethics

### For Community Engagement
1. **Share Experiences**: Submit reviews and ratings for AI tools you've evaluated
2. **Learn from Others**: Browse community reviews to identify potentially problematic tools
3. **Collaborative Learning**: Engage with other educators' findings and insights

## ⚠️ Current Limitations

### Technical Limitations
- **Prototype Status**: Simplified implementation focused on concept demonstration
- **Limited Bias Types**: Focuses on three primary bias categories (gender, cultural, privacy)
- **Binary Assessment**: PASS/FAIL system may miss subtle bias manifestations
- **In-Memory Storage**: Data persistence requires future database implementation
- **Basic Authentication**: Simple username system without production-level security

### Scope Limitations
- **Educational Context**: Does not differentiate between K-12 and higher education settings
- **Cultural Framework**: Based primarily on Western conceptualizations of fairness
- **Digital Literacy**: Assumes baseline mobile technology familiarity among users
- **Community Moderation**: Lacks comprehensive content moderation tools

## 🔮 Future Development

### Enhanced Functionality
- **Advanced Bias Detection**: More sophisticated protocols with validated accuracy
- **Database Integration**: Persistent storage with data synchronization capabilities
- **Security Implementation**: Production-ready authentication and data protection
- **Expanded Bias Categories**: Include socioeconomic and linguistic bias detection

### User Experience Improvements
- **Empirical Validation**: Comprehensive usability testing with diverse teacher populations
- **Cultural Adaptation**: Incorporate diverse cultural frameworks for global contexts
- **Accessibility Enhancements**: Support for varying levels of digital literacy

### Community Platform Evolution
- **Moderation Tools**: Comprehensive content quality assurance
- **Collaborative Features**: Structured case studies and group evaluation workflows
- **Institutional Integration**: Potential integration with school district systems

## 👩‍💻 Author

**Tahsina Islam**  
📧 tislam36@gatech.edu  
🎓 Georgia Institute of Technology

## 📁 Project Structure

```
final-project-code/
├── src/
│   ├── screens/
│   │   ├── login.tsx          # Authentication interface
│   │   ├── index.tsx          # Dashboard/home screen
│   │   ├── evaluation.tsx     # Bias assessment workflows
│   │   ├── community.tsx      # Review and rating system
│   │   └── resources.tsx      # Educational resource library
│   ├── components/            # Reusable UI components
│   └── utils/                 # Helper functions and utilities
├── Final Paper.pdf            # Complete research documentation
├── Final Presentation.pdf     # Project presentation materials
└── Catalog.pdf               # Project content and access instructions
```

## 🔗 References

This implementation is grounded in peer-reviewed research including:
- UNESCO AI Education Guidelines (2021)
- OECD AI Ethics Frameworks
- Mobile learning effectiveness studies (Brown & Davis, 2022)
- Teacher technology adoption research
- AI bias detection methodologies in educational contexts

## 🤝 Contributing

This is a research prototype developed as part of an academic project. The implementation demonstrates concept viability and establishes a foundation for future development in making AI ethics actionable in educational contexts.

---

*This project contributes to both practice and research by demonstrating how technical solutions can bridge the gap between AI ethics principles and practical educational needs, laying groundwork for future work in educator empowerment for AI oversight.*
