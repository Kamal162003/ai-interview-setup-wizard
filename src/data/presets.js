export const JOB_PRESETS = [
  {
    id: 'frontend-engineer',
    title: 'Senior Frontend Engineer',
    category: 'Engineering',
    company: 'TechCorp Solutions',
    level: 'Senior',
    description: `We are looking for a Senior Frontend Engineer proficient in React, JavaScript (ES6+), TypeScript, Web Performance Optimization, State Management, and CSS Architecture. You will design resilient component libraries, optimize web vitals, and work closely with product teams to build interactive web apps.`,
    defaultQuestions: [
      "Can you walk me through a challenging performance issue you diagnosed in a React application and how you solved it?",
      "How do you approach state management architecture in large-scale single page applications?",
      "Explain how the Web Browser rendering pipeline works, from DOM parsing to layout, paint, and composite.",
      "How do you ensure accessibility (WCAG) and cross-browser compatibility across responsive web interfaces?"
    ]
  },
  {
    id: 'fullstack-developer',
    title: 'Fullstack Software Engineer',
    category: 'Engineering',
    company: 'Innovate Labs',
    level: 'Mid-Senior',
    description: `Seeking a Fullstack Developer experienced in Node.js/Python, React, PostgreSQL/MongoDB, REST/GraphQL APIs, Microservices, and cloud deployments (AWS/Docker). You will build scalable end-to-end features and maintain clean backend architecture.`,
    defaultQuestions: [
      "Walk me through how you design a RESTful API service from scratch, including authentication, database schema design, and rate limiting.",
      "How do you handle database migration and schema updates in a production environment with zero downtime?",
      "Describe a scenario where you had to debug a memory leak or bottleneck between client and server.",
      "What strategies do you use for caching data across backend microservices and client applications?"
    ]
  },
  {
    id: 'system-architect',
    title: 'Distributed Systems Architect',
    category: 'Architecture',
    company: 'CloudScale Inc.',
    level: 'Staff / Lead',
    description: `CloudScale is hiring a Staff System Architect to lead distributed systems architecture, event-driven pipelines (Kafka), database partitioning, high availability, and fault tolerance across global infrastructure.`,
    defaultQuestions: [
      "How would you design a scalable real-time notification system serving 10 million concurrent active users?",
      "Explain the CAP Theorem and trade-offs between consistency, availability, and partition tolerance in distributed databases.",
      "How do you handle message deduplication, idempotent consumers, and out-of-order delivery in event-driven systems?",
      "Describe your approach to designing disaster recovery and failover mechanisms for mission-critical microservices."
    ]
  },
  {
    id: 'product-manager',
    title: 'Technical Product Manager',
    category: 'Product',
    company: 'NextGen SaaS',
    level: 'Mid-Level',
    description: `We need a Product Manager with strong technical acumen to bridge engineering and business goals. You will prioritize product roadmaps, write specs, define metrics (KPIs/OKRs), and conduct user interviews.`,
    defaultQuestions: [
      "How do you prioritize competing feature requests from high-value enterprise customers versus technical debt reduction?",
      "Describe how you measure the success of a major product feature post-launch.",
      "Tell me about a time you had to make a critical product decision with incomplete data.",
      "How do you communicate complex technical trade-offs to non-technical business stakeholders?"
    ]
  },
  {
    id: 'hr-behavioral',
    title: 'General Behavioral & Leadership',
    category: 'HR & Behavioral',
    company: 'Global Enterprise',
    level: 'All Levels',
    description: `Focuses on STAR methodology (Situation, Task, Action, Result), leadership capabilities, conflict resolution, team collaboration, and adaptiveness in fast-paced corporate environments.`,
    defaultQuestions: [
      "Tell me about a time when you disagreed with a manager or senior team member's technical direction. How did you handle it?",
      "Describe a situation where a project missed a deadline or faced a critical failure. What did you learn and do differently?",
      "Give an example of how you mentored a struggling colleague or onboarded a new team member.",
      "How do you manage stress and prioritize workload when multiple high-priority deadlines collide?"
    ]
  }
];

export const PERSONAS = [
  {
    id: 'strict-architect',
    name: 'Dr. Evelyn Vance',
    role: 'Principal Systems Architect',
    avatarBg: 'from-cyan-500 to-blue-600',
    tone: 'Strict, precise, deeply technical, and probing',
    description: 'Focuses heavily on edge cases, architectural trade-offs, security, and exact technical terminology.',
    greeting: "Hello. I've reviewed your background. We have strict technical standards here. Let's begin directly with your experience."
  },
  {
    id: 'friendly-hr',
    name: 'Marcus Chen',
    role: 'Lead Talent Partner',
    avatarBg: 'from-emerald-400 to-teal-600',
    tone: 'Encouraging, supportive, behavioral, and conversational',
    description: 'Helps candidate feel at ease while assessing culture fit, communication, and collaboration style.',
    greeting: "Hi there! Welcome to your interview session. Don't worry, we're here to have a great discussion. Take a deep breath and whenever you're ready, let's start!"
  },
  {
    id: 'tech-lead',
    name: 'Sarah Jenkins',
    role: 'Engineering Team Lead',
    avatarBg: 'from-purple-500 to-indigo-600',
    tone: 'Practical, pragmatic, balanced, and scenario-based',
    description: 'Asks realistic day-to-day engineering questions, code quality practices, and team problem solving.',
    greeting: "Hey! Glad to connect today. I run our core engineering pod, so I'd love to learn more about how you solve everyday technical challenges."
  },
  {
    id: 'behavioral-coach',
    name: 'David Miller',
    role: 'Executive Behavioral Specialist',
    avatarBg: 'from-rose-500 to-pink-600',
    tone: 'Insightful, structured around STAR methodology, empathetic',
    description: 'Probes deeply into leadership, conflict management, project ownership, and growth mindset.',
    greeting: "Welcome. I'll be exploring your behavioral experiences and STAR approach today. Remember to highlight your specific actions and results."
  }
];
