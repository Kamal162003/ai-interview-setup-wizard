export const INTERVIEW_QUESTIONS = {
  'frontend-engineer': [
    {
      id: 'fe-1',
      question: "How would you optimize the load time and rendering performance of a large-scale React application handling high-frequency real-time data?",
      topic: "Performance & Rendering",
      difficulty: "Advanced",
      hint: "Think about virtualized lists, memoization (useMemo/React.memo), Web Workers, and DOM batching.",
      keyCriteria: ["Virtualization", "Memoization", "Web Workers", "Code Splitting", "Concurrent React"],
      sampleFeedback: {
        score: 92,
        strengths: "Excellent mention of windowing large lists and offloading data processing to Web Workers.",
        tips: "Also consider discussing React 18 useDeferredValue for non-urgent render transitions."
      }
    },
    {
      id: 'fe-2',
      question: "Explain the differences between client-side state management solutions like Redux Toolkit, Zustand, and React Context. When would you choose one over another?",
      topic: "State Architecture",
      difficulty: "Intermediate",
      hint: "Compare boilerplate, bundle size, re-render triggers, and selector-based subscriptions.",
      keyCriteria: ["Selector Subscriptions", "Re-render Scope", "Boilerplate", "DevTools Support"],
      sampleFeedback: {
        score: 88,
        strengths: "Great distinction between global context re-renders and atomic selector subscriptions.",
        tips: "Elaborate slightly more on SSR hydration sync with server stores."
      }
    },
    {
      id: 'fe-3',
      question: "Describe your strategy for building a resilient CSS & UI Component Library with accessibility (a11y) and dark mode theme tokens.",
      topic: "Design Systems & A11y",
      difficulty: "Intermediate",
      hint: "Mention CSS custom properties, WAI-ARIA roles, focus management, and design token architecture.",
      keyCriteria: ["CSS Variables", "ARIA Roles", "Focus Trap", "Contrast Ratios", "Keyboard Nav"],
      sampleFeedback: {
        score: 95,
        strengths: "Comprehensive coverage of ARIA keyboard navigation patterns and HSL theme tokens.",
        tips: "Spot on! You covered accessibility and design system scalability thoroughly."
      }
    }
  ],
  'fullstack-developer': [
    {
      id: 'fs-1',
      question: "How do you design a secure RESTful API endpoint with JWT authentication, rate limiting, and input validation in Node.js/Express?",
      topic: "API Design & Security",
      difficulty: "Advanced",
      hint: "Discuss middleware chains, token expiration, Redis rate limiters, and Zod/Joi schema validation.",
      keyCriteria: ["JWT Refresh Tokens", "Redis Rate Limiting", "Schema Validation", "CORS & Headers"],
      sampleFeedback: {
        score: 90,
        strengths: "Clear architectural flow covering token storage security and Redis sliding-window limiters.",
        tips: "Remember to mention HTTP-only secure cookies for JWT storage."
      }
    },
    {
      id: 'fs-2',
      question: "When scaling a database for a web app experiencing rapid traffic growth, how do you evaluate indexing, read replicas, and database partitioning?",
      topic: "Databases & Scaling",
      difficulty: "Advanced",
      hint: "Analyze query execution plans, read/write splitting, vertical scaling vs horizontal sharding.",
      keyCriteria: ["B-Tree Indexes", "Read Replicas", "Sharding Keys", "Connection Pooling"],
      sampleFeedback: {
        score: 86,
        strengths: "Strong understanding of read replica separation and connection pool exhaustion.",
        tips: "Detail the risks of cross-shard joins when choosing sharding keys."
      }
    }
  ],
  'system-architect': [
    {
      id: 'sa-1',
      question: "Design an event-driven architecture for a global payment processing system requiring strict idempotency, fault tolerance, and sub-second latency.",
      topic: "Distributed Systems",
      difficulty: "Staff Level",
      hint: "Consider Kafka event logs, transactional outbox pattern, distributed locks, and saga orchestration.",
      keyCriteria: ["Idempotency Keys", "Kafka Partitioning", "Saga Pattern", "Outbox Pattern", "Dead Letter Queue"],
      sampleFeedback: {
        score: 94,
        strengths: "Outstanding explanation of the Transactional Outbox pattern and Idempotent Consumers.",
        tips: "Consider addressing multi-region active-active database replication tradeoffs."
      }
    },
    {
      id: 'sa-2',
      question: "How do you handle graceful degradation and circuit breaking in a microservice ecosystem during peak flash sales?",
      topic: "Resilience & Reliability",
      difficulty: "Staff Level",
      hint: "Discuss Hystrix/Resilience4j circuit breakers, fallback strategies, and load shedding.",
      keyCriteria: ["Circuit Breaker States", "Fallback Logic", "Load Shedding", "Rate Throttling"],
      sampleFeedback: {
        score: 89,
        strengths: "Good breakdown of half-open circuit states and shedding non-critical user traffic.",
        tips: "Add metrics tracking via Prometheus alerts for rapid automated failover."
      }
    }
  ],
  'product-manager': [
    {
      id: 'pm-1',
      question: "How do you prioritize competing feature requests from enterprise clients vs core user experience improvements using prioritization frameworks?",
      topic: "Product Strategy",
      difficulty: "Mid-Senior",
      hint: "Reference RICE or Kano models, strategic alignment, engineering effort vs business value.",
      keyCriteria: ["RICE Framework", "ROI Calculation", "Stakeholder Alignment", "KPI Tracking"],
      sampleFeedback: {
        score: 91,
        strengths: "Thoughtful application of the RICE framework balancing revenue impact and tech debt.",
        tips: "Mention setting explicit quantitative success metrics for post-launch evaluation."
      }
    }
  ],
  'hr-behavioral': [
    {
      id: 'hr-1',
      question: "Tell me about a time when you disagreed with a colleague or manager's technical direction. How did you resolve the conflict constructively?",
      topic: "Conflict Resolution & Collaboration",
      difficulty: "All Levels",
      hint: "Use STAR (Situation, Task, Action, Result). Focus on active listening, empathy, data-driven reasoning, and shared project outcomes.",
      keyCriteria: ["STAR Method", "Empathy", "Objective Data", "Team Alignment"],
      sampleFeedback: {
        score: 93,
        strengths: "Excellent demonstration of empathy, focusing on objective data rather than personal friction.",
        tips: "Highlight the lasting positive impact on the team culture or process."
      }
    },
    {
      id: 'hr-2',
      question: "Describe a situation where a project missed a critical deadline or encountered unexpected failure. What did you learn and implement afterwards?",
      topic: "Accountability & Growth Mindset",
      difficulty: "All Levels",
      hint: "Emphasize personal ownership, blameless post-mortem analysis, and preventative guardrails.",
      keyCriteria: ["Accountability", "Blameless Post-Mortem", "Systemic Safeguards", "Growth Mindset"],
      sampleFeedback: {
        score: 89,
        strengths: "Clear sense of accountability and proactive steps taken during the blameless retrospective.",
        tips: "Specify any automated alerts or CI gates added as a direct result."
      }
    }
  ]
};
