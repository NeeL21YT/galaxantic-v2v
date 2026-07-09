/**
 * lib/data/placeholder.ts
 *
 * All placeholder data for Stage 1B dashboard pages.
 * Replace with real API calls in Stage 2.
 */

import type {
  User,
  Opportunity,
  Milestone,
  ResumeItem,
  ChatMessage,
  ActivityItem,
  SkillGap,
  NotificationSetting,
} from "@/types/dashboard";

/* ── Current User ───────────────────────────────────────────── */

export const PLACEHOLDER_USER: User = {
  id: "u1",
  name: "Priya Sharma",
  email: "priya@example.com",
  avatarUrl: undefined,
  role: "Product Manager",
  joinedAt: "2025-01-15",
  careerReadiness: 72,
};

/* ── Opportunities ──────────────────────────────────────────── */

export const PLACEHOLDER_OPPORTUNITIES: Opportunity[] = [
  {
    id: "o1",
    title: "Product Manager – Growth",
    company: "Zomato",
    location: "Bengaluru, IN",
    type: "job",
    matchPercent: 94,
    deadline: "2025-08-15",
    isBookmarked: true,
    logoPlaceholder: "🍽",
    tags: ["Full-Time", "Hybrid", "₹25–35 LPA"],
  },
  {
    id: "o2",
    title: "Women in Tech Fellowship",
    company: "Google",
    location: "Remote",
    type: "fellowship",
    matchPercent: 88,
    deadline: "2025-07-30",
    isBookmarked: false,
    logoPlaceholder: "🌐",
    tags: ["Fellowship", "6 months", "Stipend"],
  },
  {
    id: "o3",
    title: "Startup Product Intern",
    company: "Razorpay",
    location: "Mumbai, IN",
    type: "internship",
    matchPercent: 81,
    deadline: "2025-08-01",
    isBookmarked: false,
    logoPlaceholder: "💳",
    tags: ["Internship", "3 months", "PPO"],
  },
  {
    id: "o4",
    title: "SheBuilds Hackathon",
    company: "Nasscom",
    location: "Hyderabad, IN",
    type: "hackathon",
    matchPercent: 77,
    deadline: "2025-07-25",
    isBookmarked: true,
    logoPlaceholder: "🏆",
    tags: ["Hackathon", "₹2L Prize", "Weekend"],
  },
  {
    id: "o5",
    title: "STEM Scholarship 2025",
    company: "Tata Trust",
    location: "Pan-India",
    type: "scholarship",
    matchPercent: 73,
    deadline: "2025-09-10",
    isBookmarked: false,
    logoPlaceholder: "🎓",
    tags: ["Scholarship", "₹1L", "Annual"],
  },
  {
    id: "o6",
    title: "Associate Product Manager",
    company: "Swiggy",
    location: "Bengaluru, IN",
    type: "job",
    matchPercent: 69,
    deadline: "2025-08-20",
    isBookmarked: false,
    logoPlaceholder: "🛵",
    tags: ["Full-Time", "On-site", "₹18–22 LPA"],
  },
];

/* ── Roadmap Milestones ─────────────────────────────────────── */

export const PLACEHOLDER_MILESTONES: Milestone[] = [
  // 30-day phase
  {
    id: "m1",
    phase: 30,
    title: "Resume & Profile Refresh",
    description: "Update resume with career break framing, optimise LinkedIn.",
    dueDate: "2025-07-20",
    status: "completed",
    tasks: ["Update work experience", "Add career break narrative", "Upload new headshot"],
  },
  {
    id: "m2",
    phase: 30,
    title: "Skill Assessment",
    description: "Complete AI skill gap analysis and identify top 3 areas to upskill.",
    dueDate: "2025-07-27",
    status: "in-progress",
    tasks: ["Complete skill quiz", "Review AI suggestions", "Enrol in one course"],
  },
  {
    id: "m3",
    phase: 30,
    title: "Network Activation",
    description: "Reconnect with 10 professional contacts and attend 1 event.",
    dueDate: "2025-08-05",
    status: "upcoming",
    tasks: ["Draft reconnect messages", "Identify 10 contacts", "Find local event"],
  },
  // 60-day phase
  {
    id: "m4",
    phase: 60,
    title: "Apply to 5 Opportunities",
    description: "Submit targeted applications to matched roles and fellowships.",
    dueDate: "2025-08-25",
    status: "upcoming",
    tasks: ["Shortlist 5 roles", "Customise resume", "Write cover letters"],
  },
  {
    id: "m5",
    phase: 60,
    title: "Interview Preparation",
    description: "Complete AI mock interviews and prepare STAR format answers.",
    dueDate: "2025-09-05",
    status: "upcoming",
    tasks: ["5 mock interviews", "Prepare 10 STAR stories", "Research target companies"],
  },
  // 90-day phase
  {
    id: "m6",
    phase: 90,
    title: "Offer Negotiation Prep",
    description: "Learn salary benchmarking and offer negotiation techniques.",
    dueDate: "2025-09-25",
    status: "upcoming",
    tasks: ["Research market salaries", "Practice negotiation scripts", "Review benefits"],
  },
  {
    id: "m7",
    phase: 90,
    title: "Land First Role / Opportunity",
    description: "Accept offer and prepare for successful onboarding.",
    dueDate: "2025-10-10",
    status: "upcoming",
    tasks: ["Accept offer", "Give notice / transition plan", "Onboarding checklist"],
  },
];

/* ── Resume Items ───────────────────────────────────────────── */

export const PLACEHOLDER_RESUMES: ResumeItem[] = [
  {
    id: "r1",
    filename: "priya_sharma_pm_resume_v3.pdf",
    uploadedAt: "2025-07-08",
    score: 72,
    status: "analyzed",
    suggestions: [
      "Add quantifiable impact metrics to bullet points",
      "Include a career break narrative section",
      "Highlight leadership experience more prominently",
      "Tailor summary for PM roles",
    ],
  },
  {
    id: "r2",
    filename: "priya_sharma_pm_resume_v2.pdf",
    uploadedAt: "2025-06-15",
    score: 58,
    status: "analyzed",
    suggestions: [
      "Update to current date format",
      "Remove outdated skills section",
    ],
  },
];

/* ── Chat Messages ──────────────────────────────────────────── */

export const PLACEHOLDER_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "c1",
    sender: "ai",
    content:
      "Hi Priya! 👋 I'm your AI Career Coach. I can help with your resume, interview prep, career roadmap, or finding the right opportunities. What would you like to work on today?",
    timestamp: "2025-07-09T09:00:00Z",
  },
  {
    id: "c2",
    sender: "user",
    content: "I've been on a career break for 2 years. How do I explain this in interviews?",
    timestamp: "2025-07-09T09:01:00Z",
  },
  {
    id: "c3",
    sender: "ai",
    content:
      "That's a great question, and very common! Here's a powerful framework to reframe your career break:\n\n**1. Be honest and confident** — Don't apologise. Career breaks are increasingly normalised.\n\n**2. Use the PAR formula:**\n- **Problem**: Why you took the break (family, health, personal growth)\n- **Action**: What you did during the break (upskilling, volunteering, projects)\n- **Result**: How it made you stronger\n\n**Example:** \"I took a planned career break to care for a family member. During that time, I completed a Product Management certification, mentored 3 junior professionals, and built a side project with 500+ users. I'm now more focused and resilient than ever.\"\n\nWould you like help crafting your personal narrative?",
    timestamp: "2025-07-09T09:01:30Z",
  },
  {
    id: "c4",
    sender: "user",
    content: "Yes! Can you help me write my personal narrative?",
    timestamp: "2025-07-09T09:02:00Z",
  },
  {
    id: "c5",
    sender: "ai",
    content:
      "Absolutely! Let's build it together. Tell me:\n\n1. How long was your break and what was the primary reason?\n2. What did you do during the break? (Any courses, projects, volunteering?)\n3. What type of roles are you targeting now?",
    timestamp: "2025-07-09T09:02:30Z",
  },
];

export const SUGGESTED_PROMPTS = [
  "Help me explain my career gap",
  "Review my resume bullet points",
  "Prepare me for PM interviews",
  "What skills should I learn next?",
  "Find opportunities matching my profile",
  "Write my LinkedIn summary",
];

/* ── Activity Feed ──────────────────────────────────────────── */

export const PLACEHOLDER_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    icon: "📄",
    title: "Resume Analysed",
    description: "AI scored your resume 72/100 with 4 suggestions",
    time: "2h ago",
  },
  {
    id: "a2",
    icon: "🎯",
    title: "3 New Opportunities",
    description: "Matched to Zomato PM, Google Fellowship, Razorpay Intern",
    time: "5h ago",
  },
  {
    id: "a3",
    icon: "✅",
    title: "Milestone Completed",
    description: "Resume & Profile Refresh — marked done",
    time: "1d ago",
  },
  {
    id: "a4",
    icon: "🤖",
    title: "AI Coach Session",
    description: "Discussed career break narrative strategy",
    time: "1d ago",
  },
  {
    id: "a5",
    icon: "🔖",
    title: "Opportunity Bookmarked",
    description: "Saved Women in Tech Fellowship – Google",
    time: "2d ago",
  },
];

/* ── Skill Gaps ─────────────────────────────────────────────── */

export const PLACEHOLDER_SKILL_GAPS: SkillGap[] = [
  { skill: "Data Analysis", current: 40, target: 80, priority: "high" },
  { skill: "SQL", current: 25, target: 70, priority: "high" },
  { skill: "Agile / Scrum", current: 65, target: 85, priority: "medium" },
  { skill: "User Research", current: 70, target: 90, priority: "medium" },
  { skill: "Roadmapping Tools", current: 55, target: 80, priority: "low" },
];

/* ── Notifications ──────────────────────────────────────────── */

export const PLACEHOLDER_NOTIFICATIONS: NotificationSetting[] = [
  {
    id: "n1",
    label: "New Opportunities",
    description: "Get notified when new matching roles are found",
    enabled: true,
  },
  {
    id: "n2",
    label: "Milestone Reminders",
    description: "Reminders for upcoming roadmap deadlines",
    enabled: true,
  },
  {
    id: "n3",
    label: "AI Coach Messages",
    description: "Receive suggestions from your AI coach",
    enabled: false,
  },
  {
    id: "n4",
    label: "Weekly Progress Report",
    description: "Summary of your progress every Monday",
    enabled: true,
  },
];
