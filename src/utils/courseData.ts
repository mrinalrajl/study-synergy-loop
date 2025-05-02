
// Course categories by field
export const COURSE_CATEGORIES = {
  "AI & Machine Learning": [
    { title: "Introduction to Machine Learning", description: "Learn the fundamentals of ML algorithms and applications", level: "Beginner" },
    { title: "Deep Learning Specialization", description: "Master neural networks and deep learning techniques", level: "Intermediate" },
    { title: "Generative AI with LLMs", description: "Build and fine-tune large language models", level: "Advanced" },
    { title: "Computer Vision with PyTorch", description: "Image processing and object detection techniques", level: "Intermediate" },
    { title: "Natural Language Processing", description: "Text analysis and language understanding with AI", level: "Intermediate" },
    { title: "Reinforcement Learning", description: "Build intelligent agents that learn from their environment", level: "Advanced" }
  ],
  "Finance & Business": [
    { title: "Financial Markets", description: "Understanding stocks, bonds, and investment strategies", level: "Beginner" },
    { title: "Blockchain & Cryptocurrency", description: "Explore decentralized finance technologies", level: "Intermediate" },
    { title: "Financial Analysis & Modeling", description: "Build predictive financial models with Excel and Python", level: "Advanced" },
    { title: "Investment Management", description: "Portfolio optimization and risk assessment techniques", level: "Intermediate" },
    { title: "Corporate Finance", description: "Financial decision-making for business growth", level: "Advanced" },
    { title: "Personal Financial Planning", description: "Strategic planning for individual financial goals", level: "Beginner" }
  ],
  "Software Development": [
    { title: "Full-Stack Web Development", description: "Build responsive web applications with modern frameworks", level: "Intermediate" },
    { title: "Mobile App Development", description: "Create cross-platform mobile applications", level: "Intermediate" },
    { title: "Cloud Computing & DevOps", description: "Infrastructure automation and deployment pipelines", level: "Advanced" },
    { title: "Software Architecture", description: "Design scalable and maintainable software systems", level: "Advanced" },
    { title: "API Development", description: "Build robust and secure APIs for your applications", level: "Intermediate" },
    { title: "Test-Driven Development", description: "Write better code with automated testing", level: "Intermediate" }
  ],
  "Engineering & Design": [
    { title: "Electrical Engineering Fundamentals", description: "Circuit analysis, electronics, and power systems", level: "Beginner" },
    { title: "Mechanical Design & Simulation", description: "3D modeling and finite element analysis", level: "Intermediate" },
    { title: "Architectural Visualization", description: "Create photorealistic architectural renders", level: "Intermediate" },
    { title: "Sustainable Engineering Practices", description: "Environmentally conscious design and analysis", level: "Advanced" },
    { title: "Control Systems Engineering", description: "Design and analysis of feedback control systems", level: "Advanced" },
    { title: "Robotics Engineering", description: "Design and programming of robotic systems", level: "Advanced" }
  ]
};

// Predefined suggestions for different topics
export const TOPIC_SUGGESTIONS: Record<string, string[]> = {
  "javascript": [
    "JavaScript Fundamentals",
    "Advanced JS Concepts",
    "JavaScript Frameworks Comparison",
    "Functional Programming in JS",
    "Building Real-time Apps with JavaScript"
  ],
  "machine learning": [
    "ML Fundamentals",
    "Neural Networks",
    "Natural Language Processing",
    "Computer Vision",
    "ML in Production Environments"
  ],
  "python": [
    "Python for Beginners",
    "Data Science with Python",
    "Machine Learning with Python",
    "Web Development with Django",
    "Python for Automation"
  ],
  "design": [
    "UI/UX Fundamentals",
    "Design Systems",
    "Responsive Design Patterns",
    "Color Theory for Digital Designers",
    "Interface Animation Principles"
  ],
  "finance": [
    "Investment Strategies",
    "Financial Planning",
    "Stock Market Analysis",
    "Personal Finance Management",
    "Corporate Finance Essentials"
  ],
  "engineering": [
    "Electrical Circuit Analysis",
    "Mechanical Design Principles",
    "Civil Engineering Fundamentals",
    "Engineering Ethics",
    "Computational Engineering Methods"
  ]
};

// Generic suggestions when no specific match is found
export const DEFAULT_SUGGESTIONS = [
  "Course recommendations for beginners",
  "Advanced learning paths",
  "Most popular tech courses",
  "Career transition guidance",
  "Skill assessment help",
  "Learning schedule optimization"
];

// Learning levels for users to select
export const LEARNING_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

// Learning goals templates
export const LEARNING_GOALS = [
  "Get a job in tech",
  "Improve current skills",
  "Change career paths",
  "Launch a project/startup",
  "Academic research",
  "Personal interest",
  "Prepare for interviews"
];

// Latest courses by category (added based on user requirements)
export const LATEST_COURSES = {
  "AI & Machine Learning": [
    { title: "AI Ethics and Governance", description: "Ethical considerations and regulatory frameworks for AI", level: "Intermediate" },
    { title: "Graph Neural Networks", description: "Advanced techniques for graph-based data", level: "Advanced" }
  ],
  "Finance & Business": [
    { title: "ESG Investing", description: "Environmental, social and governance criteria in investing", level: "Intermediate" },
    { title: "Fintech Innovations", description: "Latest trends and technologies disrupting finance", level: "Intermediate" }
  ],
  "Software Development": [
    { title: "Web3 Development", description: "Building decentralized applications on blockchain", level: "Advanced" },
    { title: "Low-Code Development", description: "Rapid application development with minimal coding", level: "Beginner" }
  ],
  "Engineering & Design": [
    { title: "Quantum Computing Basics", description: "Introduction to quantum computing principles", level: "Advanced" },
    { title: "IoT Systems Design", description: "Designing connected device ecosystems", level: "Intermediate" }
  ]
};
