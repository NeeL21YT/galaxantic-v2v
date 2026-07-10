/**
 * lib/data/placeholder.ts
 *
 * All placeholder data for Stage 1B dashboard pages.
 * Replace with real API calls in Stage 2.
 */

import {
  FileText,
  Target,
  CheckCircle2,
  Bot,
  Bookmark,
  Utensils,
  Globe,
  CreditCard,
  Trophy,
  GraduationCap,
  Bike,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Landmark,
  Wallet,
  Scroll,
  CalendarDays,
  BarChart2,
  Zap,
  Brain,
  CircleDollarSign,
  Home,
  Car,
  Sparkles,
  Rocket,
  Laptop,
} from "lucide-react";
import { createElement } from "react";
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
    logoPlaceholder: createElement(Utensils, { className: "w-5 h-5" }),
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
    logoPlaceholder: createElement(Globe, { className: "w-5 h-5" }),
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
    logoPlaceholder: createElement(CreditCard, { className: "w-5 h-5" }),
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
    logoPlaceholder: createElement(Trophy, { className: "w-5 h-5" }),
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
    logoPlaceholder: createElement(GraduationCap, { className: "w-5 h-5" }),
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
    logoPlaceholder: createElement(Bike, { className: "w-5 h-5" }),
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
    icon: createElement(FileText, { className: "w-4 h-4", style: { color: "var(--color-rackley)" } }),
    title: "Resume Analysed",
    description: "AI scored your resume 72/100 with 4 suggestions",
    time: "2h ago",
  },
  {
    id: "a2",
    icon: createElement(Target, { className: "w-4 h-4", style: { color: "var(--color-rose-gold)" } }),
    title: "3 New Opportunities",
    description: "Matched to Zomato PM, Google Fellowship, Razorpay Intern",
    time: "5h ago",
  },
  {
    id: "a3",
    icon: createElement(CheckCircle2, { className: "w-4 h-4", style: { color: "#16a34a" } }),
    title: "Milestone Completed",
    description: "Resume & Profile Refresh — marked done",
    time: "1d ago",
  },
  {
    id: "a4",
    icon: createElement(Bot, { className: "w-4 h-4", style: { color: "#7c3aed" } }),
    title: "AI Coach Session",
    description: "Discussed career break narrative strategy",
    time: "1d ago",
  },
  {
    id: "a5",
    icon: createElement(Bookmark, { className: "w-4 h-4", style: { color: "#d97706" } }),
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

/* ── HerLens ─────────────────────────────────────────────────── */
// TODO Stage 2: Replace with cached summaries from Supabase.
// Architecture: Hourly Scheduler → NewsData.io → Gemini (batch per category)
// → Structured JSON → Supabase. Users always read pre-processed summaries.

import type {
  NewsArticle,
  BudgetAllocation,
  FinancialRecommendation,
  ActionPlanItem,
  BusinessPlanCard,
} from "@/types/dashboard";

export const HERLENS_CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  "beauty-health": "Beauty, Health & Wellness",
  "fashion-lifestyle": "Fashion & Lifestyle",
  "career-finance": "Career, Business & Finance",
  "education-stem": "Education & STEM",
  "sports-entertainment": "Sports & Entertainment",
  "policy-leadership": "Policy, Leadership & Social Impact",
  "parenting-family": "Parenting & Family Dynamics",
  "travel-arts": "Travel, Arts & Culture",
};

export const HERLENS_ARTICLES: NewsArticle[] = [
  /* ── Beauty, Health & Wellness ─── */
  {
    id: "bh-1",
    category: "beauty-health",
    headline: "Iron Deficiency Affects 1 in 3 Indian Women — Here's What to Eat",
    publishedTime: "2h ago",
    summary:
      "A new ICMR report reveals that over 30% of Indian women between 18–45 are iron deficient, impacting energy, focus, and hair health. Dietitians recommend spinach, lentils, and fortified cereals paired with vitamin C for better absorption. Supplements should only be taken after a blood test.",
    detailedSummary:
      "The Indian Council of Medical Research released updated data showing iron deficiency anaemia remains one of the most prevalent nutritional issues affecting women in India. The condition often goes undetected and presents as chronic fatigue, pale skin, brittle nails, and difficulty concentrating. Experts recommend a food-first approach before reaching for supplements, pairing non-heme iron sources like dal, rajma, and leafy greens with citrus juice to improve absorption by up to 3x.",
    keyTakeaways: [
      "30%+ of Indian women aged 18–45 are iron deficient",
      "Spinach, lentils, and fortified cereals are top dietary sources",
      "Pair plant-based iron with vitamin C for better absorption",
      "Get a blood test before starting iron supplements",
    ],
    sourceName: "ICMR Health Bulletin",
    sourceUrl: "#",
  },
  {
    id: "bh-2",
    category: "beauty-health",
    headline: "Sleep Deprivation Linked to Higher Anxiety in Working Women",
    publishedTime: "4h ago",
    summary:
      "Stanford researchers found that women who sleep fewer than 6 hours experience a 40% spike in cortisol levels the following day, significantly increasing anxiety and emotional reactivity. The study emphasises a consistent sleep schedule over sleep duration as the single most impactful habit for mental wellbeing.",
    detailedSummary:
      "A longitudinal study from Stanford tracked 2,200 professional women over two years and found a strong correlation between irregular or insufficient sleep and heightened anxiety. Cortisol, the body's primary stress hormone, was found to be significantly elevated among women who reported under 6 hours of nightly sleep. The research suggests that going to bed at the same time every night — even on weekends — has a greater positive impact than trying to 'catch up' on sleep.",
    keyTakeaways: [
      "Under 6 hours of sleep increases cortisol by up to 40%",
      "Consistent sleep timing matters more than total duration",
      "Working women are disproportionately affected by sleep anxiety loops",
      "Aim for 7–8 hours with a fixed bedtime, including weekends",
    ],
    sourceName: "Stanford Sleep Research Lab",
    sourceUrl: "#",
  },
  {
    id: "bh-3",
    category: "beauty-health",
    headline: "Dermatologists Say SPF 50 Is the New Minimum for Indian Skin Tones",
    publishedTime: "6h ago",
    summary:
      "With UV radiation levels rising across South Asia, top dermatologists are updating their recommendation from SPF 30 to SPF 50 as the minimum for daily use. Chemical sunscreens are preferred for oily skin, while mineral variants work better for sensitive skin. Reapplication every 2 hours remains critical.",
    detailedSummary:
      "The Indian Dermatological Society has issued revised sun protection guidelines citing a measurable increase in UV index across metropolitan and coastal cities. Doctors note that darker skin tones still need sunscreen despite melanin providing some natural protection. The recommendation shift from SPF 30 to SPF 50 reflects better real-world coverage. Hybrid chemical-mineral formulations are gaining popularity for their lightweight texture and broad-spectrum coverage.",
    keyTakeaways: [
      "SPF 50 is the new recommended minimum in India",
      "All skin tones need daily sunscreen — melanin isn't enough",
      "Chemical sunscreens suit oily skin; mineral for sensitive",
      "Reapply every 2 hours for continuous protection",
    ],
    sourceName: "Indian Dermatological Society",
    sourceUrl: "#",
  },
  {
    id: "bh-4",
    category: "beauty-health",
    headline: "PCOS Affects 1 in 5 Women — Early Lifestyle Changes Make a Real Difference",
    publishedTime: "8h ago",
    summary:
      "PCOS now affects nearly 20% of reproductive-age women globally. Endocrinologists emphasise that insulin resistance, not just hormones, drives symptoms. A low-glycaemic diet combined with 150 minutes of weekly moderate exercise showed 35% symptom improvement in clinical trials — often outperforming medication alone.",
    detailedSummary:
      "Polycystic Ovary Syndrome continues to rise, with updated global estimates placing prevalence near 20% of women of reproductive age. Research increasingly points to insulin resistance as a root driver rather than a consequence of PCOS. Lifestyle interventions — specifically a low-GI diet and consistent aerobic exercise — have shown remarkable results in clinical settings, sometimes exceeding the impact of metformin when sustained for 6+ months.",
    keyTakeaways: [
      "1 in 5 women globally have PCOS",
      "Insulin resistance is a key root cause, not just hormones",
      "Low-GI diet + 150 min/week exercise reduced symptoms by 35%",
      "Lifestyle changes can outperform medication alone",
    ],
    sourceName: "Endocrine Society Journal",
    sourceUrl: "#",
  },
  {
    id: "bh-5",
    category: "beauty-health",
    headline: "Gut Health and Mental Wellbeing — The Women's Connection",
    publishedTime: "10h ago",
    summary:
      "Emerging research from Harvard confirms women have a more sensitive gut-brain axis than men, making diet a critical lever for mood regulation. Fermented foods like curd, kimchi, and kefir showed measurable reduction in anxiety markers within 8 weeks. Probiotics are now considered a mental health supplement.",
    detailedSummary:
      "A Harvard Medical School review of 18 studies confirms that the gut-brain axis in women is particularly sensitive due to hormonal fluctuations that alter gut microbiome composition. Serotonin — the 'feel good' neurotransmitter — is produced 90% in the gut, not the brain. Women who increased fermented food consumption for 8 weeks showed reduced inflammatory markers and reported meaningful improvement in anxiety and mood stability.",
    keyTakeaways: [
      "90% of serotonin is produced in the gut, not the brain",
      "Women's gut-brain axis is more hormonally sensitive than men's",
      "Fermented foods reduced anxiety markers in 8 weeks",
      "Probiotics are increasingly recognised as mental health support",
    ],
    sourceName: "Harvard Medical School Review",
    sourceUrl: "#",
  },
  {
    id: "bh-6",
    category: "beauty-health",
    headline: "Hair Loss in Women — Why Stress Is the Number One Culprit",
    publishedTime: "1d ago",
    summary:
      "Trichologists report a sharp rise in telogen effluvium — stress-induced hair loss — among women aged 25–40. The condition typically appears 3–4 months after a stressful event and is reversible. Managing cortisol through sleep, nutrition, and breathwork is the most effective long-term treatment.",
    detailedSummary:
      "Hair loss clinics across India and the UK report a 60% increase in consultations from women experiencing diffuse hair thinning post-pandemic. Telogen effluvium — where stress pushes hair follicles into a resting state — is diagnosed as the leading cause. Unlike pattern baldness, this type of hair loss is fully reversible once the stressor is addressed. Blood tests for iron, thyroid, vitamin D, and B12 are recommended to rule out compounding factors.",
    keyTakeaways: [
      "Stress-induced hair loss appears 3–4 months after the trigger",
      "Telogen effluvium is fully reversible with lifestyle management",
      "Check iron, thyroid, vitamin D, and B12 levels",
      "Sleep and cortisol management are the most effective treatments",
    ],
    sourceName: "International Society of Hair Restoration Surgery",
    sourceUrl: "#",
  },
  {
    id: "bh-7",
    category: "beauty-health",
    headline: "The 5-Minute Breathwork Routine That Reduces Anxiety Instantly",
    publishedTime: "1d ago",
    summary:
      "Physiological sighing — a double inhale through the nose followed by a long exhale — has been validated by Stanford neuroscientists as the fastest way to downregulate the nervous system. Just 5 minutes daily for 4 weeks significantly reduced self-reported anxiety in a trial of 200 women.",
    detailedSummary:
      "Stanford's Huberman Lab published a study comparing multiple breathwork techniques across 200 participants. Physiological sighing — consisting of two quick nasal inhales followed by a slow, extended mouth exhale — consistently outperformed mindfulness meditation and cyclic hyperventilation for immediate anxiety reduction. The mechanism works by rapidly deflating overinflated air sacs in the lungs, which triggers parasympathetic nervous system activation within seconds.",
    keyTakeaways: [
      "Physiological sighing: double inhale + long exhale",
      "Fastest scientifically validated technique for anxiety relief",
      "Just 5 minutes daily reduces anxiety significantly in 4 weeks",
      "Outperforms meditation for immediate nervous system downregulation",
    ],
    sourceName: "Stanford Huberman Lab",
    sourceUrl: "#",
  },
  {
    id: "bh-8",
    category: "beauty-health",
    headline: "Women Are Under-Diagnosed for Heart Disease — New Symptoms Guide Released",
    publishedTime: "2d ago",
    summary:
      "Cardiologists warn that heart disease presents differently in women — often as jaw pain, nausea, and fatigue rather than chest pain. A new WHO symptom guide aims to close the diagnostic gap. Women are 50% more likely to receive an incorrect diagnosis after a cardiac event than men.",
    detailedSummary:
      "The World Health Organisation has released an updated symptom guide for cardiovascular disease in women after research revealed stark gender disparities in diagnosis rates. Female-specific symptoms — including unusual fatigue, shortness of breath, nausea, and upper back or jaw pain — are frequently misattributed to anxiety or gastrointestinal issues. The under-diagnosis problem begins in clinical trials, where women have historically been underrepresented.",
    keyTakeaways: [
      "Women's heart attack symptoms differ significantly from men's",
      "Common female symptoms: jaw pain, nausea, fatigue, back pain",
      "Women are 50% more likely to be misdiagnosed after a cardiac event",
      "New WHO guide aims to improve recognition in clinical settings",
    ],
    sourceName: "World Health Organisation",
    sourceUrl: "#",
  },
  {
    id: "bh-9",
    category: "beauty-health",
    headline: "Why Women Need More Magnesium — and Most Aren't Getting It",
    publishedTime: "3d ago",
    summary:
      "Magnesium plays a critical role in 300+ bodily functions and is particularly important for hormonal balance, sleep quality, and muscle recovery. Studies show 60% of women fall short of the 320mg daily requirement. Dark chocolate, pumpkin seeds, and almonds are the most bioavailable dietary sources.",
    detailedSummary:
      "Nutrition scientists are flagging magnesium as an overlooked micronutrient specifically impactful for women. Deficiency is linked to worsening PMS symptoms, poor sleep quality, and increased risk of migraines. The daily recommended intake for adult women is 320mg, yet most dietary surveys across South Asia and Europe show average consumption is closer to 200mg. Supplementation with magnesium glycinate is considered the most bioavailable and gentlest on digestion.",
    keyTakeaways: [
      "60% of women don't get enough magnesium daily",
      "Deficiency worsens PMS, sleep, and migraine symptoms",
      "Best sources: dark chocolate, pumpkin seeds, almonds, spinach",
      "Magnesium glycinate is the most bioavailable supplement form",
    ],
    sourceName: "Journal of Women's Health Nutrition",
    sourceUrl: "#",
  },
  {
    id: "bh-10",
    category: "beauty-health",
    headline: "Perimenopause Awareness Gap — Many Women Miss Early Signs",
    publishedTime: "4d ago",
    summary:
      "Gynaecologists report that most women don't recognise perimenopause symptoms until years into the transition. Irregular periods, brain fog, and mood changes can begin a decade before menopause. Early conversations with doctors can significantly improve quality of life through lifestyle and HRT options.",
    detailedSummary:
      "A survey across 5,000 women in the UK and India revealed that 72% were unaware they were in perimenopause when symptoms first appeared. Perimenopause can begin as early as the mid-30s and typically lasts 4–10 years. The brain fog and mood instability it causes are frequently misdiagnosed as depression or burnout. Medical organisations are calling for better education at all levels of healthcare to ensure earlier, more accurate diagnosis.",
    keyTakeaways: [
      "Perimenopause can begin 10 years before menopause",
      "72% of women don't recognise early symptoms",
      "Brain fog and mood changes are often misdiagnosed as depression",
      "Early diagnosis enables better lifestyle and treatment planning",
    ],
    sourceName: "British Menopause Society",
    sourceUrl: "#",
  },

  /* ── Fashion & Lifestyle ─── */
  {
    id: "fl-1",
    category: "fashion-lifestyle",
    headline: "India's Sustainable Fashion Market to Reach ₹35,000 Crore by 2027",
    publishedTime: "3h ago",
    summary:
      "Eco-conscious fashion is no longer a niche. India's sustainable apparel market is projected to grow at 15% annually, driven by Gen Z and millennial women choosing organic fabrics, upcycled clothing, and rental fashion. Brands like Doodlage and No Nasties are seeing 3x growth.",
    detailedSummary:
      "The Clothing Manufacturers Association of India reports a fundamental shift in consumer behaviour, with younger women actively seeking environmental credentials when making fashion purchases. The rental fashion segment alone has grown 200% post-pandemic. Sustainable fabric adoption — including organic cotton, bamboo blends, and Tencel — is rising sharply. Impact-conscious Indian brands are increasingly competitive against fast-fashion giants.",
    keyTakeaways: [
      "India's sustainable fashion market growing at 15% annually",
      "Gen Z and millennials are the primary drivers",
      "Rental fashion grew 200% post-pandemic",
      "Indian sustainable brands like Doodlage seeing 3x growth",
    ],
    sourceName: "CMAI India Report",
    sourceUrl: "#",
  },
  {
    id: "fl-2",
    category: "fashion-lifestyle",
    headline: "The Return of Quiet Luxury — Why Women Are Choosing Less",
    publishedTime: "5h ago",
    summary:
      "The 'quiet luxury' aesthetic — neutral tones, impeccable tailoring, minimal branding — continues to dominate global fashion. Psychologists say it reflects a cultural shift toward substance over status. In India, this trend is translating into demand for quality handloom and artisanal craftsmanship.",
    detailedSummary:
      "Fashion analysts at Vogue Business track quiet luxury as more than an aesthetic — it represents a values-led identity shift. The movement rejects conspicuous consumption in favour of understated quality. In the Indian context, this is driving renewed interest in Khadi, handwoven silks, and regionally crafted textiles. Designers like Anavila Misra and Rahul Mishra are benefiting from global demand for this premium, heritage-informed aesthetic.",
    keyTakeaways: [
      "Quiet luxury is a values-driven movement, not just a trend",
      "Neutral tones, quality fabrics, minimal logos define the look",
      "Indian handloom and artisanal craftsmanship align naturally",
      "Anavila Misra and Rahul Mishra gaining global quiet luxury traction",
    ],
    sourceName: "Vogue Business",
    sourceUrl: "#",
  },
  {
    id: "fl-3",
    category: "fashion-lifestyle",
    headline: "Digital Detox Weekends Are Becoming India's Newest Luxury",
    publishedTime: "7h ago",
    summary:
      "Luxury resorts and wellness retreats are reporting a surge in demand for 'no-phone' packages among Indian women professionals. Priced between ₹15,000–₹60,000 per weekend, these retreats offer guided silence, nature immersion, and journaling workshops. Waitlists now stretch 3 months in advance.",
    detailedSummary:
      "India's wellness tourism sector is experiencing record growth as burnout becomes a defining experience for urban professional women. Properties like Ananda in the Himalayas and Six Senses Fort Barwara have introduced digital detox packages that go beyond simply switching off phones — they offer curated experiences combining Ayurveda, forest bathing, and breathwork. The demographic driving this demand skews heavily toward women aged 28–45 in senior professional roles.",
    keyTakeaways: [
      "Digital detox retreats are booked out 3+ months in advance",
      "Priced ₹15,000–₹60,000 per weekend",
      "Primary demographic: women aged 28–45 in professional roles",
      "Format includes guided silence, nature, journaling, Ayurveda",
    ],
    sourceName: "India Wellness Tourism Report",
    sourceUrl: "#",
  },
  {
    id: "fl-4",
    category: "fashion-lifestyle",
    headline: "Capsule Wardrobe Movement Gains Momentum Among Working Women",
    publishedTime: "9h ago",
    summary:
      "The concept of owning 30 high-quality, mix-and-match pieces is replacing fast-fashion hauls. Studies show women who adopt capsule wardrobes report less decision fatigue, higher confidence, and 40% lower clothing spend annually. The trend is also significantly reducing textile waste.",
    detailedSummary:
      "Minimalism in fashion is being embraced as a practical productivity strategy, not just an aesthetic choice. Research from the University of Hertfordshire found that outfit-related decisions in the morning significantly impact cognitive performance and stress levels throughout the day. A capsule wardrobe — typically 25–40 carefully selected, versatile pieces — eliminates this cognitive load while encouraging investment in quality items that last years rather than seasons.",
    keyTakeaways: [
      "A capsule wardrobe is typically 25–40 versatile pieces",
      "Reduces annual clothing spend by up to 40%",
      "Decreases morning decision fatigue and improves focus",
      "Significantly reduces personal contribution to textile waste",
    ],
    sourceName: "University of Hertfordshire",
    sourceUrl: "#",
  },
  {
    id: "fl-5",
    category: "fashion-lifestyle",
    headline: "Women-First Coworking Spaces Are Redefining Professional Culture",
    publishedTime: "12h ago",
    summary:
      "Coworking spaces designed exclusively for women are expanding rapidly in Bengaluru, Mumbai, and Delhi. Offering creches, wellness rooms, mentorship events, and networking — these spaces are addressing gaps traditional offices leave open. Memberships have a 6-month waitlist in major cities.",
    detailedSummary:
      "Operators like Wing and The Hivery are expanding in India's metros, responding to demand from female entrepreneurs, freelancers, and remote professionals who want community without compromising safety or comfort. Beyond flexible workspaces, these hubs offer structured programming — pitch nights, founder circles, and therapy drop-ins — that create genuine professional ecosystems. Venture capital interest in this sector is also growing.",
    keyTakeaways: [
      "Women-only coworking is expanding rapidly across Indian metros",
      "Key features: creches, wellness rooms, mentorship programs",
      "6-month waitlists in Bengaluru, Mumbai, and Delhi",
      "VC interest in the sector is growing alongside demand",
    ],
    sourceName: "Economic Times Startup",
    sourceUrl: "#",
  },
  {
    id: "fl-6",
    category: "fashion-lifestyle",
    headline: "Minimalist Jewellery Hits Record Sales — Why Women Are Going Small",
    publishedTime: "1d ago",
    summary:
      "Delicate, everyday-wear jewellery — thin chains, small hoops, and barely-there rings — is now the fastest-growing segment of India's ₹5 lakh crore jewellery market. Women are investing in fewer, more meaningful pieces rather than large statement jewellery worn occasionally.",
    detailedSummary:
      "India's jewellery market is experiencing a structural shift driven by younger consumers who prioritise wearability over weight. Lab-grown diamonds and recycled gold are gaining mainstream acceptance, particularly among eco-conscious buyers. Digital-first jewellery brands like Melorra and Giva are disrupting traditional players by offering lightweight 14K gold pieces priced below ₹5,000. The everyday-wear category now accounts for 38% of total jewellery revenue.",
    keyTakeaways: [
      "Everyday fine jewellery is the fastest-growing category",
      "Lab-grown diamonds and recycled gold are trending",
      "Digital brands like Melorra and Giva disrupting traditional players",
      "38% of jewellery revenue now comes from everyday-wear pieces",
    ],
    sourceName: "Gems & Jewellery Export Promotion Council",
    sourceUrl: "#",
  },
  {
    id: "fl-7",
    category: "fashion-lifestyle",
    headline: "Home Cooking Is Back — And Women Chefs Are Leading It",
    publishedTime: "1d ago",
    summary:
      "Post-pandemic, home cooking has transformed from necessity to passion project for millions of Indian women. Instagram and YouTube have democratised culinary culture, with home chefs like @spiceroute and @hergoldenkitchen collectively reaching 10M followers. Food content by women now drives 65% of Indian recipe traffic.",
    detailedSummary:
      "The rise of the home chef is one of the most significant shifts in Indian food culture in a generation. Women who started cooking during lockdowns have evolved into content creators, cookbook authors, and food entrepreneurs. Platforms like Kofluencer and Winkl are specifically facilitating partnerships between food brands and women food creators. Several home chefs have launched successful cloud kitchens and meal delivery services from their home studios.",
    keyTakeaways: [
      "Women home chefs driving 65% of Indian recipe content traffic",
      "Home chefs are evolving into food entrepreneurs and creators",
      "Cloud kitchens started by home chefs are a growing trend",
      "Platforms like Kofluencer supporting women food creators",
    ],
    sourceName: "Hindustan Times Lifestyle",
    sourceUrl: "#",
  },
  {
    id: "fl-8",
    category: "fashion-lifestyle",
    headline: "Second-Hand Luxury — Resale Platforms See 3x Growth Among Women",
    publishedTime: "2d ago",
    summary:
      "Pre-owned luxury goods are shedding their stigma. Platforms like Plush and OldLuxury India report 3x year-on-year growth, with handbags and watches being the top categories. Women are both the primary buyers and sellers, embracing circular fashion as a financially and environmentally smart choice.",
    detailedSummary:
      "The resale market for luxury goods in India is growing faster than the primary luxury segment. Authentication technology and brand partnerships have resolved trust barriers that previously held the market back. Younger women are approaching luxury purchases as investments — buying pre-owned now, maintaining condition, and reselling when tastes change. The average return on resale for top luxury handbag brands is reportedly 7–12% annually.",
    keyTakeaways: [
      "Pre-owned luxury platforms growing 3x year-on-year in India",
      "Handbags and watches lead resale categories",
      "Women are both primary buyers and sellers on resale platforms",
      "Top luxury bags offer 7–12% annual resale returns",
    ],
    sourceName: "Business Standard Lifestyle",
    sourceUrl: "#",
  },
  {
    id: "fl-9",
    category: "fashion-lifestyle",
    headline: "Linen Dominates Summer 2025 Fashion — Here's How to Style It",
    publishedTime: "3d ago",
    summary:
      "Linen has emerged as the fabric of choice for summer 2025, embraced for its breathability, sustainability, and effortless aesthetic. Indian weavers producing linen blends are seeing export demand surge. Styling tip: oversized linen blazers, wide-leg trousers, and earth tones are this season's core palette.",
    detailedSummary:
      "Linen's moment in mainstream fashion is being driven by climate consciousness and the move toward natural fibres. Indian handloom industries, particularly those in Bhagalpur and Odisha known for linen-silk blends, are experiencing export growth of over 40% year-on-year. The fabric suits India's climate particularly well, and global luxury houses including Zara Home and H&M Conscious are sourcing from Indian artisans.",
    keyTakeaways: [
      "Linen is the dominant fabric of summer 2025",
      "Indian handloom linen-silk blends see 40% export growth",
      "Earth tones and oversized silhouettes define the linen look",
      "Global luxury brands sourcing linen from Indian artisans",
    ],
    sourceName: "Vogue India",
    sourceUrl: "#",
  },
  {
    id: "fl-10",
    category: "fashion-lifestyle",
    headline: "The 'Social Battery' Conversation — Why Women Are Protecting Their Energy",
    publishedTime: "4d ago",
    summary:
      "Gen Z and millennial women are openly prioritising their 'social battery' — a term describing one's capacity for social interaction. Therapists normalise the concept, emphasising that introversion and energy management are health practices. Saying no to social obligations is increasingly framed as self-care.",
    detailedSummary:
      "The social battery concept has gone mainstream, with therapists embracing it as a legitimate framework for communicating social capacity. Research shows women — who carry a disproportionate share of social maintenance tasks within families and friend groups — are especially prone to social burnout. Setting boundaries around after-work socialising, group chats, and family obligations is now discussed openly across mental health and lifestyle content platforms.",
    keyTakeaways: [
      "'Social battery' is a valid framework for energy management",
      "Women carry disproportionate social maintenance responsibilities",
      "Setting social boundaries is an emerging self-care practice",
      "Therapists normalise saying no to non-essential social obligations",
    ],
    sourceName: "Psychology Today",
    sourceUrl: "#",
  },

  /* ── Career, Business & Finance ─── */
  {
    id: "cf-1",
    category: "career-finance",
    headline: "Women-Led Startups Raised ₹4,200 Crore in India in H1 2025",
    publishedTime: "1h ago",
    summary:
      "Funding for women-founded startups in India reached ₹4,200 crore in the first half of 2025 — a 28% increase over the same period last year. Sectors leading: edtech, health tech, and fintech. Government schemes like WEP and StandUp India contributed to 40% of seed-stage deals.",
    detailedSummary:
      "India's startup ecosystem is slowly but meaningfully shifting toward gender inclusion at the funding level. Early-stage funding through government-backed instruments like the Women Entrepreneurship Platform (WEP) and StandUp India scheme is providing first-time founders with access to capital previously unavailable without collateral or established networks. VC firms like Artha Venture Fund and Kalaari Capital have launched women-specific programs to pipeline more female founders.",
    keyTakeaways: [
      "Women-founded startups raised ₹4,200 crore in H1 2025",
      "28% growth over H1 2024",
      "EdTech, healthtech, and fintech lead sectors",
      "WEP and StandUp India supported 40% of seed deals",
    ],
    sourceName: "Inc42 Startup Report",
    sourceUrl: "#",
  },
  {
    id: "cf-2",
    category: "career-finance",
    headline: "Salary Negotiation Gap: Women Leave ₹15 Lakh on the Table Over a Career",
    publishedTime: "3h ago",
    summary:
      "A LinkedIn India study found women are 30% less likely to negotiate their first job offer than men, cumulatively losing ₹15 lakh or more over a 10-year career. Expert-recommended technique: anchor high with a researched range, citing market data — not personal financial need.",
    detailedSummary:
      "LinkedIn India's 2025 Gender Pay Gap Study reveals that the hesitancy to negotiate compounds dramatically over time. The research found that women who successfully negotiate their first salary earn 7–12% more in subsequent roles because compensation benchmarks reset with each offer. The study recommends researching market rates on platforms like AmbitionBox and Glassdoor India before negotiating, and framing the discussion in terms of value delivered rather than personal need.",
    keyTakeaways: [
      "Women are 30% less likely to negotiate first job offers",
      "Cumulative impact: ₹15 lakh+ lost over 10 years",
      "Research market rates before negotiating — use AmbitionBox",
      "Anchor high and frame negotiation around value, not need",
    ],
    sourceName: "LinkedIn India Gender Pay Study",
    sourceUrl: "#",
  },
  {
    id: "cf-3",
    category: "career-finance",
    headline: "Mutual Fund SIPs by Women Cross ₹12,000 Crore Monthly for First Time",
    publishedTime: "5h ago",
    summary:
      "Women investors now account for ₹12,000 crore in monthly SIP contributions — a milestone that marks their growing role in India's financial markets. SEBI data shows women-held folios grew 22% in 2024. Financial advisors credit better financial literacy content and women-specific investing platforms.",
    detailedSummary:
      "SEBI's quarterly report on investor demographics shows a structural shift in who is participating in Indian capital markets. The number of women holding mutual fund folios crossed 2.8 crore — a 22% increase in 12 months. Platforms like Groww, Zerodha, and Paytm Money report that women are more consistent SIP investors than men, with lower redemption rates during market downturns. This 'stay the course' behaviour leads to better long-term returns on average.",
    keyTakeaways: [
      "Women's monthly SIP contributions crossed ₹12,000 crore",
      "Women-held MF folios grew 22% in 2024",
      "Women have lower redemption rates during market volatility",
      "Consistent SIP behaviour yields better long-term outcomes",
    ],
    sourceName: "SEBI Investor Pulse Report",
    sourceUrl: "#",
  },
  {
    id: "cf-4",
    category: "career-finance",
    headline: "The Rise of the Portfolio Career — Why Women Are Choosing Multiple Income Streams",
    publishedTime: "7h ago",
    summary:
      "A growing cohort of Indian professional women are rejecting single-employer careers in favour of portfolio models — combining a part-time role, freelancing, content creation, or consulting. This approach increases income resilience and offers flexibility, particularly important during career breaks or caregiving periods.",
    detailedSummary:
      "The portfolio career model — popularised by management thinker Charles Handy in the 1990s — is experiencing a renaissance driven by platform economy opportunities and pandemic-era flexibility norms. Indian women aged 28–40 are at the forefront, combining corporate roles with courses on Udemy, consulting projects through Uplers or Toptal, and content monetisation on YouTube or Instagram. CRED Money's 2025 report found 38% of surveyed women professional earn secondary income.",
    keyTakeaways: [
      "Portfolio careers combine multiple complementary income sources",
      "38% of Indian professional women now earn secondary income",
      "Flexibility is the primary driver, especially during caregiving",
      "Platforms like Toptal, Uplers, and YouTube facilitate the shift",
    ],
    sourceName: "CRED Money 2025 Report",
    sourceUrl: "#",
  },
  {
    id: "cf-5",
    category: "career-finance",
    headline: "Term Insurance for Women — Why Most Are Underinsured",
    publishedTime: "9h ago",
    summary:
      "Less than 20% of working women in India have adequate life insurance coverage, despite contributing meaningfully to household income. Financial planners recommend a cover of 10–15x annual income. Women also benefit from lower premium rates, making term insurance one of the best financial instruments available.",
    detailedSummary:
      "India's insurance penetration remains among the lowest globally, and the gender gap within this is even more stark. Despite working women contributing 30–100% of household income in many families, their life and disability coverage rarely reflects that financial importance. IRDAI data shows women who do purchase insurance choose plans 40% lower in cover than equivalent male policyholders. Premium parity for women is an advantage frequently left unused.",
    keyTakeaways: [
      "Under 20% of working women have adequate life insurance",
      "Recommended cover: 10–15x annual income",
      "Women get lower premiums — an underutilised advantage",
      "Disability cover is equally important and widely overlooked",
    ],
    sourceName: "IRDAI Annual Insurance Report",
    sourceUrl: "#",
  },
  {
    id: "cf-6",
    category: "career-finance",
    headline: "Remote Work Is Enabling Career Restarts for Women in Tier 2 Cities",
    publishedTime: "12h ago",
    summary:
      "Women in cities like Indore, Coimbatore, and Nashik are re-entering professional careers thanks to remote work opportunities that didn't require relocation. Tech companies and BPOs are specifically targeting Tier 2 talent pools, finding lower attrition and higher loyalty among returning women professionals.",
    detailedSummary:
      "The geographic liberation of remote work is having an outsized impact on women who previously had to choose between career and family. Companies like Wipro, TCS, and Infosys have launched returnship programs specifically targeting women in non-metro cities. The combination of regional language capabilities, reliability, and strong educational backgrounds is making Tier 2 women professionals highly attractive to employers seeking alternatives to expensive metro talent.",
    keyTakeaways: [
      "Remote work is enabling career restarts in Tier 2 and 3 cities",
      "Major IT firms launching returnship programs in smaller cities",
      "Lower attrition rates found among Tier 2 returning women",
      "Geographic flexibility is the top driver of this demographic shift",
    ],
    sourceName: "NASSCOM Gender Inclusion Report",
    sourceUrl: "#",
  },
  {
    id: "cf-7",
    category: "career-finance",
    headline: "Public Sector Banks Now Offer Zero-Collateral Business Loans to Women",
    publishedTime: "1d ago",
    summary:
      "Under the Mudra Yojana Tarun category and SBI She loan scheme, women entrepreneurs can access loans up to ₹50 lakh with no collateral requirement, a 1% interest rate concession, and simplified documentation. Awareness remains low — only 12% of eligible women have applied.",
    detailedSummary:
      "Government and public sector initiatives to fund women entrepreneurs have expanded significantly, but awareness remains critically low. The Pradhan Mantri Mudra Yojana offers up to ₹10 lakh through Shishu, Kishor, and Tarun categories. The SBI She scheme extends this to ₹50 lakh with a 0.50–1% rate concession. State-level schemes in Tamil Nadu, Karnataka, and Maharashtra offer additional top-up funding. Financial literacy campaigns by NGOs like SEWA are working to close the awareness gap.",
    keyTakeaways: [
      "Zero-collateral loans up to ₹50 lakh available for women entrepreneurs",
      "1% interest rate concession through SBI She and Mudra schemes",
      "Only 12% of eligible women have applied",
      "SEWA and similar NGOs running financial literacy awareness drives",
    ],
    sourceName: "Ministry of Finance Women Empowerment Update",
    sourceUrl: "#",
  },
  {
    id: "cf-8",
    category: "career-finance",
    headline: "Breaking the Glass Ceiling at Board Level — Progress and Gaps",
    publishedTime: "2d ago",
    summary:
      "Women hold 17.1% of board seats in India's NSE 500 companies — up from 13% in 2020, but still below the global average of 25%. Companies with higher female board representation consistently outperform peers on ESG metrics and long-term returns. SEBI is evaluating mandatory disclosure targets.",
    detailedSummary:
      "India's progress on corporate board gender diversity is measurable but insufficient. SEBI's mandate requiring at least one independent woman director on listed company boards has increased representation, but tokenism remains a concern — many appointments are of family members rather than independent professionals. Research by McKinsey India confirms that companies with genuine board diversity, not just nominal compliance, deliver 15–20% better returns to shareholders over 5 years.",
    keyTakeaways: [
      "Women hold 17.1% of NSE 500 board seats — below the 25% global average",
      "SEBI mandate increased representation but tokenism remains",
      "Companies with real diversity deliver 15–20% better shareholder returns",
      "SEBI is evaluating mandatory gender disclosure targets",
    ],
    sourceName: "McKinsey India & SEBI Report",
    sourceUrl: "#",
  },
  {
    id: "cf-9",
    category: "career-finance",
    headline: "The ₹10,000 Monthly Savings Challenge That Changed 50,000 Women's Lives",
    publishedTime: "3d ago",
    summary:
      "A viral savings challenge started by financial educator Ankita Nayyar has enrolled over 50,000 Indian women in a 12-month ₹10,000/month commitment. Participants share progress in a private WhatsApp community. After 6 months, 68% report feeling financially confident for the first time.",
    detailedSummary:
      "The 'HerFund Challenge' went viral on Instagram after Ankita Nayyar documented her own journey of saving ₹1.2 lakh in a year and investing it in index funds. The community now spans 12 WhatsApp groups and counts participants across 18 Indian cities. Monthly check-ins, peer accountability, and simple investment tutorials have driven consistent participation. The model has been adopted by HDFC Bank's financial literacy outreach program.",
    keyTakeaways: [
      "50,000 women enrolled in the ₹10,000/month savings challenge",
      "68% reported financial confidence after 6 months",
      "WhatsApp community model enables peer accountability",
      "HDFC Bank adopted the model for its financial literacy program",
    ],
    sourceName: "Financial Express",
    sourceUrl: "#",
  },
  {
    id: "cf-10",
    category: "career-finance",
    headline: "AI Is Changing How Women Upskill — And Who Gets Left Behind",
    publishedTime: "4d ago",
    summary:
      "AI-powered learning platforms are accelerating skill acquisition for women with internet access, but risk deepening the urban-rural divide. Platforms like Coursera and LinkedIn Learning report 60% of Indian AI course completions come from women in top 8 metros, leaving rural women without comparable access.",
    detailedSummary:
      "The democratisation of AI-powered education is partial at best. While women in metros are rapidly upskilling in data science, product management, and digital marketing through AI-tutored platforms, the digital divide means women in rural and semi-urban areas are falling further behind. Initiatives like Google's Digitalising India and Microsoft's AI for Good are attempting to bridge this, but infrastructure gaps in connectivity remain the fundamental barrier.",
    keyTakeaways: [
      "60% of Indian AI course completions come from top 8 metros",
      "Rural women face digital infrastructure barriers to AI education",
      "Google and Microsoft running rural digital literacy programs",
      "Urban-rural AI skills gap risks deepening inequality",
    ],
    sourceName: "NASSCOM Future Skills Report",
    sourceUrl: "#",
  },

  /* ── Education & STEM ─── */
  {
    id: "es-1",
    category: "education-stem",
    headline: "IIT JEE Girls' Enrolment Hits 20% — A Record High",
    publishedTime: "2h ago",
    summary:
      "Female enrolment in IIT undergraduate programs reached 20% in 2025 — the highest in the institutions' history. The milestone follows a supernumerary seat policy introduced in 2018. Despite this, women remain severely underrepresented in core engineering branches like CS, Mechanical, and Electrical.",
    detailedSummary:
      "IIT's supernumerary seat policy — which added female seats without reducing general category seats — has measurably increased participation. However, diversity advocates note the gains are concentrated in newer IITs and branches like Architecture, Design, and Biotechnology. Core branches with the highest earning potential — Computer Science, Electrical, and Mechanical — still see female enrolment below 15%. Mentorship and scholarship programs specific to these branches are being proposed.",
    keyTakeaways: [
      "IIT female enrolment hit 20% in 2025 — a historic record",
      "Supernumerary seat policy drove this increase",
      "Core engineering branches still see under 15% female enrolment",
      "Mentorship programs proposed for CS, Electrical, Mechanical branches",
    ],
    sourceName: "Ministry of Education Annual Report",
    sourceUrl: "#",
  },
  {
    id: "es-2",
    category: "education-stem",
    headline: "Coding Bootcamps Designed for Women See 200% Enrolment Surge",
    publishedTime: "4h ago",
    summary:
      "Women-first coding bootcamps like WomenWhoCode India, SheCodes, and Masai School's women cohort saw 200% enrolment growth in 2024. Industry partnerships offering guaranteed internships and income-share agreements are making tech careers accessible without upfront tuition fees.",
    detailedSummary:
      "India's tech workforce gender gap is being targeted at the pipeline level. Women-specific bootcamps are differentiating themselves with cohort-based learning that builds peer community, flexible scheduling accommodating family responsibilities, and guaranteed placement support. Income Share Agreements — where students pay after getting placed — have removed the financial barrier that deterred many first-generation learners.",
    keyTakeaways: [
      "Women-specific coding bootcamps grew 200% in enrolments",
      "Income Share Agreements remove financial barriers to tech entry",
      "Cohort-based learning builds peer community and accountability",
      "Guaranteed internships and placements increase trust in programs",
    ],
    sourceName: "EdTech India 2025 Report",
    sourceUrl: "#",
  },
  {
    id: "es-3",
    category: "education-stem",
    headline: "Girls in AI — India Launches National Program to Train 1 Lakh Female Students",
    publishedTime: "6h ago",
    summary:
      "The Ministry of Electronics and IT launched 'Girls in AI' to train 1 lakh female students aged 14–21 in AI fundamentals by 2026. Partnering with Google, Microsoft, and NASSCOM, the program will run in government schools and colleges in Tier 2 and 3 cities via offline and hybrid formats.",
    detailedSummary:
      "The initiative addresses the stark gender gap in AI education at the school level, where girls drop out of STEM streams in large numbers post Class 10. The curriculum — developed in collaboration with NASSCOM FutureSkills and IIT Bombay — covers AI literacy, basic Python, and ethical AI principles. Microsoft has committed infrastructure support in 50 government colleges, and Google is providing Chromebooks and curriculum resources.",
    keyTakeaways: [
      "1 lakh female students targeted for AI training by 2026",
      "Program focused on Tier 2 and 3 cities",
      "Google, Microsoft, and NASSCOM partnering on infrastructure and curriculum",
      "Offline and hybrid formats to address connectivity gaps",
    ],
    sourceName: "Ministry of Electronics & IT",
    sourceUrl: "#",
  },
  {
    id: "es-4",
    category: "education-stem",
    headline: "Study Abroad Applications from Indian Women Rise 35% — US, UK, Germany Lead",
    publishedTime: "8h ago",
    summary:
      "Indian women's overseas higher education applications grew 35% in 2024, with the US, UK, and Germany as top destinations. STEM, business analytics, and public policy are the most popular fields. Scholarships like Fulbright-Nehru and DAAD are seeing record female applicant pools.",
    detailedSummary:
      "The post-pandemic recovery of international education combined with increasing awareness of global career opportunities is driving Indian women to apply abroad in record numbers. The growth is particularly strong among women from Tier 2 cities, enabled by improved scholarship access and support networks like Indian Students Associations. Germany's tuition-free public universities have become a popular cost-effective destination for STEM programs.",
    keyTakeaways: [
      "Study abroad applications from Indian women grew 35% in 2024",
      "US, UK, and Germany are top destinations",
      "STEM, business analytics, and public policy are most popular fields",
      "Fulbright-Nehru and DAAD scholarships at record female application levels",
    ],
    sourceName: "British Council India Education Report",
    sourceUrl: "#",
  },
  {
    id: "es-5",
    category: "education-stem",
    headline: "Online Certifications Are Closing India's Professional Gender Gap",
    publishedTime: "10h ago",
    summary:
      "Coursera and Google report that women in India complete professional certification courses at 1.6x the rate of men. Google Career Certificates, AWS Cloud, and PMP certifications are the top completions. Flexible schedules and family-compatible learning windows are driving adoption among returning professionals.",
    detailedSummary:
      "The data reveals that once barriers like scheduling flexibility and childcare conflicts are removed, women are highly motivated and disciplined learners. Google's certification data shows 65% of Indian completions are by women, with completion rates 22% higher than the male cohort. Women are particularly drawn to courses with clear, near-term job outcome signals — credentials tied to specific job titles rather than broad academic subjects.",
    keyTakeaways: [
      "Women complete professional certifications at 1.6x the male rate",
      "Google Career Certificates and AWS Cloud lead female completions",
      "Flexibility and family-compatible scheduling are key enablers",
      "Career-specific credentials outperform broad academic courses for women",
    ],
    sourceName: "Coursera Gender Learning Report",
    sourceUrl: "#",
  },
  {
    id: "es-6",
    category: "education-stem",
    headline: "Women in PhD Programs — India Crosses 40% Female Enrolment Milestone",
    publishedTime: "1d ago",
    summary:
      "India crossed 40% female PhD enrolment in 2025 — a significant milestone driven by the National Research Fellowship and university-level maternity accommodation policies. Life sciences and social sciences lead, while physics and engineering continue to see severe gender gaps in research.",
    detailedSummary:
      "The UGC's National Research Fellowship doubling monthly stipends to ₹37,000 has improved the financial viability of research careers for women. University-level policies allowing maternity leave, flexible submission timelines, and childcare support have reduced dropout rates among female PhD candidates. The gender gap remains stark in physics (24% female) and engineering (21%), while life sciences (58%) and education (62%) see female majorities.",
    keyTakeaways: [
      "India crossed 40% female PhD enrolment for the first time",
      "UGC fellowship stipend increase improved financial viability",
      "Maternity leave and flexible policies reduced female dropout rates",
      "Physics (24%) and Engineering (21%) still face severe gender gaps",
    ],
    sourceName: "UGC Annual Higher Education Report",
    sourceUrl: "#",
  },
  {
    id: "es-7",
    category: "education-stem",
    headline: "Why Girls Are Outperforming Boys in Class 10 and 12 Board Exams",
    publishedTime: "1d ago",
    summary:
      "CBSE and ICSE data consistently show girls outperforming boys at the 10th and 12th board level. Researchers attribute this to higher self-discipline, organised study habits, and greater classroom engagement. Despite this academic lead, fewer girls convert results into STEM career pathways.",
    detailedSummary:
      "The academic gender reversal at the school level is well established — girls consistently score higher in boards yet are less represented in competitive exams and STEM careers. Education researchers point to a 'confidence cliff' that occurs during the transition from school to college and career, where social conditioning, family expectations, and perception of male-dominated fields reduces girls' self-belief in technical domains despite demonstrated academic superiority.",
    keyTakeaways: [
      "Girls consistently outperform boys in CBSE and ICSE boards",
      "Attributed to higher self-discipline and classroom engagement",
      "A 'confidence cliff' occurs at school-to-college transition",
      "Social conditioning reduces career ambition despite academic lead",
    ],
    sourceName: "CBSE Annual Results Analysis",
    sourceUrl: "#",
  },
  {
    id: "es-8",
    category: "education-stem",
    headline: "EdTech Platforms Report 45% of Paid Users Are Women — A Shift From Free Learners",
    publishedTime: "2d ago",
    summary:
      "India's leading EdTech platforms report a significant shift: women now represent 45% of paid subscribers, up from 28% in 2021. This signals growing confidence in investing in self-development. Career-linked courses and professional certification programs see the highest female paid conversion.",
    detailedSummary:
      "The shift from free to paid learner status among Indian women signals increased disposable income, greater valuation of formal credentials, and better financial literacy. Platforms that introduced EMI options and income share agreements saw the steepest growth in female paid subscribers. Byjus, Simplilearn, and Unacademy all report that women's average course completion rates on paid plans exceed 70% — significantly above the industry average.",
    keyTakeaways: [
      "Women now represent 45% of paid EdTech subscribers in India",
      "Up from 28% in 2021 — a significant shift",
      "EMI and ISA options drove paid conversion among women",
      "Women's course completion rates on paid plans exceed 70%",
    ],
    sourceName: "Indian EdTech Market Report 2025",
    sourceUrl: "#",
  },
  {
    id: "es-9",
    category: "education-stem",
    headline: "Mentorship Programs for Women in STEM Show Measurable Career Impact",
    publishedTime: "3d ago",
    summary:
      "A 3-year study tracking 800 women in STEM mentorship programs found mentored women were 2.5x more likely to receive promotions and 3x more likely to stay in STEM careers. Peer mentorship proved as effective as senior mentorship, with both formats dramatically reducing isolation.",
    detailedSummary:
      "The study — commissioned by the National Science Foundation India — tracked participants in structured mentorship programs at IISc, TIFR, and IISER across Bengaluru, Mumbai, and Pune. Women in peer mentorship groups reported higher psychological safety and were more likely to speak up in meetings and apply for competitive grants. Senior mentors with successful career break stories were rated the most impactful by participants returning to STEM after gaps.",
    keyTakeaways: [
      "Mentored women in STEM are 2.5x more likely to be promoted",
      "Mentored women are 3x more likely to stay in STEM careers",
      "Peer mentorship is as effective as senior mentorship",
      "Mentors who navigated career breaks are rated most impactful",
    ],
    sourceName: "National Science Foundation India Study",
    sourceUrl: "#",
  },
  {
    id: "es-10",
    category: "education-stem",
    headline: "Quantum Computing Is Next — Women Researchers Leading India's Quantum Push",
    publishedTime: "4d ago",
    summary:
      "India's National Quantum Mission is seeing strong female leadership, with women heading 3 of the 4 technology innovation hubs. Researchers like Dr. Rohini Godbole and Dr. Aditi Sen De are internationally recognised. Quantum computing is expected to create 5 lakh skilled jobs in India by 2030.",
    detailedSummary:
      "The ₹6,000 crore National Quantum Mission is positioning India as a global quantum computing power. Women researchers are disproportionately well represented at the senior level — a departure from the broader STEM gender gap. The mission focuses on quantum communication, sensing, materials, and computing. India's quantum advantage is expected to manifest first in cybersecurity and pharmaceutical simulations, areas with significant economic impact.",
    keyTakeaways: [
      "Women lead 3 of India's 4 Quantum Mission innovation hubs",
      "5 lakh quantum computing jobs expected in India by 2030",
      "Dr. Rohini Godbole and Dr. Aditi Sen De are global leaders",
      "Focus areas: cybersecurity and pharmaceutical simulation",
    ],
    sourceName: "Department of Science & Technology, India",
    sourceUrl: "#",
  },

  /* ── Sports & Entertainment ─── */
  {
    id: "se-1",
    category: "sports-entertainment",
    headline: "PV Sindhu Named Brand Ambassador for Women's Sports Foundation India",
    publishedTime: "2h ago",
    summary:
      "Olympic medallist PV Sindhu has been appointed Brand Ambassador for the newly formed Women's Sports Foundation India. The foundation will fund grassroots programs for girls aged 8–16 across rural Telangana, Odisha, and Rajasthan, with a ₹50 crore corpus.",
    detailedSummary:
      "The Women's Sports Foundation India — modelled after the US organisation founded by Billie Jean King — aims to remove economic barriers preventing rural girls from pursuing professional sports. Sindhu's appointment is expected to drive national visibility and donor interest. The foundation's first tranche of grants will support badminton, athletics, and wrestling programs in districts with limited sports infrastructure.",
    keyTakeaways: [
      "PV Sindhu appointed Brand Ambassador of Women's Sports Foundation India",
      "₹50 crore corpus to fund grassroots girls' sports programs",
      "Focus: Telangana, Odisha, and Rajasthan rural districts",
      "Sports: badminton, athletics, and wrestling prioritised",
    ],
    sourceName: "Sports Authority of India",
    sourceUrl: "#",
  },
  {
    id: "se-2",
    category: "sports-entertainment",
    headline: "Women's Premier League Season 2 Breaks Viewership Records",
    publishedTime: "4h ago",
    summary:
      "BCCI's Women's Premier League Season 2 drew 28 crore viewers — a 40% increase over Season 1. The Mumbai Indians Women won the title. Rising star Deepti Sharma's all-round performance captured 15 crore social media impressions, signalling cricket's gender breakthrough moment.",
    detailedSummary:
      "The WPL is proving to be one of the BCCI's most commercially successful investments. Broadcast rights sold for ₹951 crore across a 5-year deal with Star Sports and JioCinema. Merchandise sales for women's teams crossed ₹30 crore this season. Deepti Sharma's brand value has reportedly increased 300% since WPL Season 1, attracting endorsement deals from major consumer brands including Thums Up and Apollo Tyres.",
    keyTakeaways: [
      "WPL Season 2 drew 28 crore viewers — up 40% from Season 1",
      "Mumbai Indians Women won the title",
      "Deepti Sharma attracted 15 crore social media impressions",
      "Broadcast rights: ₹951 crore for a 5-year deal",
    ],
    sourceName: "BCCI Media & Commercial Division",
    sourceUrl: "#",
  },
  {
    id: "se-3",
    category: "sports-entertainment",
    headline: "Alia Bhatt Becomes First Indian Actress to Cross 100M Instagram Followers",
    publishedTime: "5h ago",
    summary:
      "Alia Bhatt crossed 100 million Instagram followers — becoming the first Indian actress to reach this milestone. The achievement underscores her crossover appeal across Bollywood, global film (Heart of Stone on Netflix), and fashion. Brand collaborations reportedly earn her ₹2 crore per sponsored post.",
    detailedSummary:
      "Bhatt's follower milestone comes amid her expanding global footprint — she made her Hollywood debut in Heart of Stone opposite Gal Gadot and signed with WME talent agency. Her social media strategy blends personal authenticity with professional milestones, resonating particularly with women aged 18–35. Her fashion brand, Ed-a-Mamma, which she founded in 2021, has grown to a ₹200 crore valuation and recently launched internationally.",
    keyTakeaways: [
      "Alia Bhatt is the first Indian actress to cross 100M Instagram followers",
      "Earns approximately ₹2 crore per sponsored post",
      "Ed-a-Mamma brand now valued at ₹200 crore",
      "Global crossover includes Netflix and WME signing",
    ],
    sourceName: "Forbes India Entertainment",
    sourceUrl: "#",
  },
  {
    id: "se-4",
    category: "sports-entertainment",
    headline: "Neeraj Chopra's Gold Launches a New Wave of Women in Athletics",
    publishedTime: "7h ago",
    summary:
      "Athletics federations across India report a 180% rise in female registrations for field events since India's Paris Olympics success. SAI has doubled funding for women's athletics programs, and three female javelin throwers have qualified for the 2025 World Athletics Championships.",
    detailedSummary:
      "The India athletics wave sparked by javelin success has a meaningful gender dimension. The Sports Authority of India's long-term athlete development programs have identified 47 girls under age 16 with javelin potential, based on biomechanical testing conducted across 12 states. Olympic gold-winning countries typically see 5–8 year talent pipeline benefits — India's women's athletics cohort looks likely to deliver results at the 2028 LA Olympics.",
    keyTakeaways: [
      "Female athletics registrations grew 180% post Paris Olympics",
      "SAI doubled funding for women's athletics programs",
      "Three female javelin throwers qualified for World Athletics 2025",
      "47 girls under-16 identified as javelin prospects across India",
    ],
    sourceName: "Athletics Federation of India",
    sourceUrl: "#",
  },
  {
    id: "se-5",
    category: "sports-entertainment",
    headline: "OTT Platforms Compete for Women-Led Stories — 65% of New Commissions Feature Female Leads",
    publishedTime: "9h ago",
    summary:
      "Netflix, Amazon, and JioCinema commissioning data shows 65% of new Indian original content features female leads or women-centric narratives. Subscriber data confirms shows with female protagonists generate 22% higher completion rates. The shift is both values-driven and commercial.",
    detailedSummary:
      "Content platform commissioning strategies are responding to measurable audience data showing that diverse storytelling drives engagement. Shows like Panchayat, Mirzapur (female leads), and Scam 1992 spinoffs with women protagonists consistently rank among the most-watched. OTT platforms are also finding women viewers account for 53% of total watch hours in India — making female-targeted content a commercially rational priority beyond social responsibility.",
    keyTakeaways: [
      "65% of new Indian OTT originals feature female leads",
      "Female-protagonist shows have 22% higher completion rates",
      "Women account for 53% of total OTT watch hours in India",
      "The trend is data-driven, not just values-driven",
    ],
    sourceName: "Media and Entertainment Industry Association",
    sourceUrl: "#",
  },
  {
    id: "se-6",
    category: "sports-entertainment",
    headline: "Women Esports Players Break Into India's Professional Gaming Circuit",
    publishedTime: "12h ago",
    summary:
      "India's esports scene is seeing its first wave of professional women players as ESports Federation of India introduces women-only tournaments with ₹1 crore prize pools. Games like BGMI and Valorant are attracting female players at the competitive level for the first time.",
    detailedSummary:
      "The Esports Federation of India, in collaboration with BGMI developer Krafton and Riot Games, has structured a dedicated women's competitive circuit with professional prize pools and media coverage. This follows successful women's esports models in South Korea and China. Indian women gamers, who previously competed in mixed-format tournaments with limited visibility, now have a dedicated pathway to professional sponsorships and streaming careers.",
    keyTakeaways: [
      "ESFI launched women-only esports tournaments with ₹1 crore prizes",
      "BGMI and Valorant are the primary games",
      "Model inspired by successful South Korean and Chinese women's circuits",
      "Professional sponsorships and streaming careers now accessible",
    ],
    sourceName: "Esports Federation of India",
    sourceUrl: "#",
  },
  {
    id: "se-7",
    category: "sports-entertainment",
    headline: "Indian Women Filmmakers Win 3 Awards at Cannes 2025",
    publishedTime: "1d ago",
    summary:
      "Three Indian women directors — Payal Kapadia, Rima Das, and Geetu Mohandas — won awards at Cannes 2025, marking a historic moment for Indian cinema. Payal Kapadia's All We Imagine As Light had already won the Grand Prix in 2024, establishing a new global template for Indian women-led cinema.",
    detailedSummary:
      "The Cannes 2025 recognition of Indian women directors signals a new era in global Indian cinema. These filmmakers share a commitment to intimate, personal storytelling that centres women's experiences outside of Bollywood's mainstream. International distribution for their films has been secured by A24 and MUBI, bringing Indian women's stories to global audiences. Film schools in India report a surge in female applicants citing these filmmakers as inspiration.",
    keyTakeaways: [
      "Three Indian women directors won awards at Cannes 2025",
      "Payal Kapadia's Grand Prix win in 2024 set the precedent",
      "A24 and MUBI securing international distribution",
      "Female film school applications surged citing these filmmakers",
    ],
    sourceName: "Cannes Film Festival Official Releases",
    sourceUrl: "#",
  },
  {
    id: "se-8",
    category: "sports-entertainment",
    headline: "Hima Das Returns — India's Fastest Woman Eyes Paris 2028",
    publishedTime: "2d ago",
    summary:
      "Hima Das has returned to competitive athletics after overcoming a series of injuries, targeting the 2028 LA Olympics. At 25, her best years are ahead. Athletics coaches believe her combination of speed and mental resilience makes her a realistic gold medal contender.",
    detailedSummary:
      "Hima Das's comeback narrative has energised Indian athletics. After winning gold at the 2018 World U20 Championships in the 400m, injury setbacks kept her from her potential. Working with a new coaching team at the SAI High-Performance Centre in Bengaluru and supported by a revised training methodology, Hima is expected to compete at the 2025 Asian Athletics Championships as a qualifier for the Olympic pathway.",
    keyTakeaways: [
      "Hima Das is targeting the 2028 LA Olympics at age 25",
      "Training at SAI High-Performance Centre, Bengaluru",
      "2025 Asian Athletics Championships is her qualifying target",
      "Coaches rate her a realistic gold medal contender",
    ],
    sourceName: "Athletics Federation of India",
    sourceUrl: "#",
  },
  {
    id: "se-9",
    category: "sports-entertainment",
    headline: "Women Podcasters Are Rewriting India's Audio Storytelling Landscape",
    publishedTime: "3d ago",
    summary:
      "Female podcast hosts now account for 40% of India's top 100 podcasts by downloads — up from 18% in 2020. Topics range from mental health and finance to mythology and true crime. Advertisers are shifting podcast budgets toward women-hosted shows, citing higher audience trust scores.",
    detailedSummary:
      "The Indian podcast ecosystem's gender balance is shifting at the content creation level. Shows like 'The Habit Coach' (Ashdin Doctor), 'Figuring Out' (Raj Shamani), and female-hosted newcomers in finance and wellness are proving that women's voices command both large audiences and advertiser confidence. Spotify and JioCinema Podcasts report that shows hosted by women have 28% higher average episode completion rates than the platform average.",
    keyTakeaways: [
      "Women host 40% of India's top 100 podcasts — up from 18% in 2020",
      "Mental health, finance, mythology, and true crime are top genres",
      "Advertisers moving budgets toward women-hosted shows",
      "Women-hosted shows have 28% higher episode completion rates",
    ],
    sourceName: "Spotify India Podcast Trends Report",
    sourceUrl: "#",
  },
  {
    id: "se-10",
    category: "sports-entertainment",
    headline: "Women in Stand-Up — India's Comedy Scene Gets Its First Female Headliners",
    publishedTime: "4d ago",
    summary:
      "Comics like Sumukhi Suresh, Aditi Mittal, and Urooj Ashfaq are selling out venues and landing Netflix specials. Female-led comedy collectives are forming across metros, creating safe stages for new voices. Stand-up is emerging as a genuine career pathway for Indian women in entertainment.",
    detailedSummary:
      "The boom in Indian stand-up comedy — catalysed by social media and OTT platforms — has created space for women comedians who were previously marginalised in a male-dominated industry. Urooj Ashfaq's Netflix special became one of the platform's most-watched Indian comedy specials. Comedy collectives like The Habitat Mumbai and Canvas Laugh Club are actively developing female talent through open-mic programs and mentorship with established comics.",
    keyTakeaways: [
      "Sumukhi Suresh, Aditi Mittal, Urooj Ashfaq leading India's comedy wave",
      "Netflix specials by women comedians reaching record viewership",
      "Comedy collectives running mentorship for emerging female comics",
      "Stand-up is becoming a viable full-time career for Indian women",
    ],
    sourceName: "India Entertainment Weekly",
    sourceUrl: "#",
  },

  /* ── Policy, Leadership & Social Impact ─── */
  {
    id: "pl-1",
    category: "policy-leadership",
    headline: "33% Women's Reservation in Lok Sabha: Timeline and What It Means",
    publishedTime: "1h ago",
    summary:
      "The Constitution (106th Amendment) Act mandating 33% reservation for women in Lok Sabha and State Assemblies will come into effect after the next delimitation exercise, expected after 2026. Currently, women hold 15% of Lok Sabha seats — the reservation would more than double female representation.",
    detailedSummary:
      "The Women's Reservation Act — passed in September 2023 after decades of legislative delays — represents a generational shift in Indian political representation. The delimitation prerequisite means the reservation will apply from the 2029 general elections at the earliest. Political analysts predict significant transformation in policy priorities, with women legislators historically more likely to champion healthcare, education, and social welfare legislation. The implementation will also cover SC and ST reserved constituencies.",
    keyTakeaways: [
      "33% women's reservation in Lok Sabha to take effect post-2026 delimitation",
      "Currently women hold only 15% of Lok Sabha seats",
      "Implementation likely from 2029 general elections",
      "Covers SC/ST reserved constituencies proportionally",
    ],
    sourceName: "Parliament of India Legislative Updates",
    sourceUrl: "#",
  },
  {
    id: "pl-2",
    category: "policy-leadership",
    headline: "Kiran Mazumdar-Shaw Joins G20 Women's Entrepreneurship Network",
    publishedTime: "3h ago",
    summary:
      "Biocon founder Kiran Mazumdar-Shaw has joined the G20 Women's Entrepreneurship Network advisory board, representing India. She will advocate for reducing regulatory barriers for women-led SMEs globally and push for gender-disaggregated access to formal business financing in developing economies.",
    detailedSummary:
      "The G20 Women's Entrepreneurship Network — established during India's 2023 G20 Presidency — continues to operate as a permanent advisory structure. Mazumdar-Shaw's appointment focuses on healthcare innovation and biotech as sectors where women entrepreneurs face distinctive barriers in regulatory approvals and funding. She has publicly committed to using the platform to push for at least 30% representation of women-led businesses in G20 procurement frameworks.",
    keyTakeaways: [
      "Kiran Mazumdar-Shaw joins G20 Women's Entrepreneurship Network",
      "Focus: regulatory reform and financing access for women-led SMEs",
      "Pushing for 30% women-led business representation in G20 procurement",
      "Healthcare and biotech are key sectors in her advocacy",
    ],
    sourceName: "G20 Official Communications",
    sourceUrl: "#",
  },
  {
    id: "pl-3",
    category: "policy-leadership",
    headline: "Paternity Leave Policy — India's Private Sector Lags Behind",
    publishedTime: "5h ago",
    summary:
      "While the Maternity Benefit Act provides 26 weeks of leave, India has no statutory paternity leave for private sector employees. Research shows equal parental leave reduces career penalties for women by 34%. Advocates are lobbying for a 4-week mandatory private sector paternity leave policy.",
    detailedSummary:
      "International experience — particularly from Scandinavian countries and the UK — shows that mandatory, non-transferable paternity leave is the single most effective policy lever for closing the gender career gap. When fathers take leave, women's career penalties decrease substantially. India's Central Government grants 15 days paternity leave to its own employees, but private sector companies have no legal obligation. Currently only 15% of Indian private companies offer any formal paternity leave.",
    keyTakeaways: [
      "India has no mandatory paternity leave for the private sector",
      "Equal parental leave reduces women's career penalties by 34%",
      "Only 15% of Indian private companies offer any formal paternity leave",
      "Advocacy groups pushing for 4-week mandatory paternity leave law",
    ],
    sourceName: "Ministry of Labour & Employment Policy Review",
    sourceUrl: "#",
  },
  {
    id: "pl-4",
    category: "policy-leadership",
    headline: "Nandita Das Leads UN Campaign on Climate Change and Women's Rights",
    publishedTime: "7h ago",
    summary:
      "Filmmaker and activist Nandita Das has been named a UN Women Goodwill Ambassador, focusing on the intersection of climate change and gender rights. Her first initiative targets women farmers in drought-prone regions with access to climate-resilient agricultural training.",
    detailedSummary:
      "UN Women's Goodwill Ambassador appointments focus on ambassadors with credibility in their communities and a clear policy agenda. Das's campaign addresses climate justice through a gender lens — women globally bear disproportionate impacts from climate change as primary water and food providers. Her focus on India's 100 million women farmers facing water stress and crop failure positions India's climate adaptation programs in an international policy conversation.",
    keyTakeaways: [
      "Nandita Das named UN Women Goodwill Ambassador",
      "Focus: climate change impacts on Indian women farmers",
      "Targeting drought-prone regions with 100 million women farmers",
      "Campaign connects climate justice and gender rights globally",
    ],
    sourceName: "UN Women Official Press",
    sourceUrl: "#",
  },
  {
    id: "pl-5",
    category: "policy-leadership",
    headline: "India's Female Judges Cross 30% in District Courts — Historic Milestone",
    publishedTime: "9h ago",
    summary:
      "Women now constitute 30% of district court judges in India — a milestone that reflects decades of advocacy for judicial diversity. Higher courts lag significantly, with women holding only 14% of High Court positions and 11% of Supreme Court seats.",
    detailedSummary:
      "The Law Commission of India's 2025 report on judicial diversity shows measurable but uneven progress. District-level gains are driven by competitive exams that have historically neutral selection criteria. The drop-off at High Court level reflects the collegium appointment system, which activists argue perpetuates gender exclusion through informal networks. The Supreme Court, with 3 women justices out of 27, remains far from representative.",
    keyTakeaways: [
      "Women hit 30% of district court judges — a historic first",
      "High Court: 14% women; Supreme Court: 11% women",
      "Exam-based selection at district level is more gender-neutral",
      "Collegium system at higher courts lacks transparency on diversity",
    ],
    sourceName: "Law Commission of India 2025 Report",
    sourceUrl: "#",
  },
  {
    id: "pl-6",
    category: "policy-leadership",
    headline: "Bengaluru Has India's Highest Female Voter Turnout at 76%",
    publishedTime: "12h ago",
    summary:
      "The 2025 state assembly elections saw Bengaluru record 76% female voter turnout — the highest among major Indian cities. Political analysts attribute this to women-specific welfare schemes driving issue-based voting, digital voter ID campaigns, and increased polling booth accessibility.",
    detailedSummary:
      "Female voter participation in India has been consistently rising since 2009 and in several constituencies now exceeds male turnout. Karnataka's Shakti scheme — providing free bus travel to women — and schemes addressing cooking gas prices are cited as policy drivers connecting directly to women voters' priorities. Digital voter registration drives specifically targeting women aged 18–25 contributed meaningfully to first-time female voter numbers.",
    keyTakeaways: [
      "Bengaluru recorded 76% female voter turnout in 2025 elections",
      "Welfare schemes like Shakti (free bus travel) drive issue-based voting",
      "Digital ID registration campaigns increased first-time female voters",
      "Female turnout now exceeds male turnout in several constituencies",
    ],
    sourceName: "Election Commission of India",
    sourceUrl: "#",
  },
  {
    id: "pl-7",
    category: "policy-leadership",
    headline: "IAS Women Officers Now Hold 25% of Key Secretary-Level Positions",
    publishedTime: "1d ago",
    summary:
      "Women IAS officers occupy 25% of Secretary and Principal Secretary roles in the Central Government for the first time. Officers like Radhika Gupta, T. Nandini Kumar, and others are heading departments managing agriculture, revenue, and urban development at scale.",
    detailedSummary:
      "India's civil service has seen consistent improvement in women's representation at senior levels, driven by competitive examination results where women have matched or outperformed men. IAS women officers are disproportionately well represented in social welfare, education, and health departments but are gaining ground in economic and infrastructure portfolios. Research shows departments led by women officers score higher on transparency and welfare scheme implementation metrics.",
    keyTakeaways: [
      "25% of Secretary-level Central Government roles held by women IAS officers",
      "Departments headed: agriculture, revenue, urban development",
      "Women perform equally to men in competitive IAS examinations",
      "Women-led departments score higher on transparency metrics",
    ],
    sourceName: "Department of Personnel & Training, India",
    sourceUrl: "#",
  },
  {
    id: "pl-8",
    category: "policy-leadership",
    headline: "SHE-BOX Portal Processes 10,000 Workplace Harassment Complaints in 2024",
    publishedTime: "2d ago",
    summary:
      "India's Sexual Harassment Electronic Box (SHE-BOX) processed 10,000 registered complaints in 2024, up 65% from 2023. The increase is attributed to growing awareness rather than increased incidence. Only 42% of cases met mandatory timelines under the POSH Act.",
    detailedSummary:
      "The SHE-BOX portal — introduced to streamline POSH Act complaint processes — is seeing growing utilisation but also exposing systemic implementation gaps. The Ministry of Women & Child Development's report notes that large corporations comply better than SMEs, where awareness of POSH obligations is lowest. Legal advocates recommend mandatory POSH training certification for HR professionals in companies above 10 employees.",
    keyTakeaways: [
      "10,000 complaints processed through SHE-BOX in 2024 — 65% increase",
      "Increase reflects awareness, not necessarily higher incidence",
      "Only 42% of cases resolved within mandatory POSH timelines",
      "SMEs show lowest POSH compliance and awareness",
    ],
    sourceName: "Ministry of Women & Child Development",
    sourceUrl: "#",
  },
  {
    id: "pl-9",
    category: "policy-leadership",
    headline: "Menstrual Leave Policy — Three Indian States Now Mandate It",
    publishedTime: "3d ago",
    summary:
      "Kerala, Odisha, and Maharashtra have enacted paid menstrual leave policies for women government employees, joining Bihar which introduced it in 1992. Corporate India remains divided, with 12% of companies offering informal leave. Advocates argue menstrual leave policy normalises reproductive health rather than penalising it.",
    detailedSummary:
      "The menstrual leave policy debate in India sits at the intersection of women's health, workplace equity, and stigma reduction. Critics argue it could lead to discrimination in hiring, while proponents cite evidence from Japan, Indonesia, and Zambia — countries with existing menstrual leave — showing no measurable hiring discrimination following policy implementation. The Zomato voluntary menstrual leave policy, introduced in 2020, is the most visible private sector example.",
    keyTakeaways: [
      "Kerala, Odisha, and Maharashtra have enacted menstrual leave policies",
      "Bihar was the first state, implementing in 1992",
      "Only 12% of Indian companies offer informal menstrual leave",
      "International evidence shows no hiring discrimination after policy adoption",
    ],
    sourceName: "Society for Labour Law Studies India",
    sourceUrl: "#",
  },
  {
    id: "pl-10",
    category: "policy-leadership",
    headline: "Women Sarpanchs Transform Rural Infrastructure — Data Proves the Difference",
    publishedTime: "4d ago",
    summary:
      "A World Bank study of 6,000 gram panchayats found that women sarpanchs invest 52% more in women's toilets, schools, and healthcare infrastructure than male counterparts. Villages with women sarpanchs also show 23% lower domestic violence rates — a structural governance impact, not correlation.",
    detailedSummary:
      "India's 33% reservation for women in panchayati raj institutions has created one of the world's largest natural experiments in women's political participation. World Bank researchers controlled for confounding variables and confirmed causation rather than correlation in both the infrastructure investment differential and the reduced violence rates. Women sarpanchs also showed higher rates of completing government scheme disbursements to end beneficiaries, suggesting better administrative accountability.",
    keyTakeaways: [
      "Women sarpanchs invest 52% more in education, health, and sanitation",
      "Villages with women sarpanchs show 23% lower domestic violence",
      "Panchayat reservation created one of the world's largest governance experiments",
      "Women show higher administrative accountability in scheme implementation",
    ],
    sourceName: "World Bank India Governance Study",
    sourceUrl: "#",
  },

  /* ── Parenting & Family Dynamics ─── */
  {
    id: "pf-1",
    category: "parenting-family",
    headline: "The Invisible Load — New Research Quantifies Mental Labour in Indian Families",
    publishedTime: "2h ago",
    summary:
      "A TISS Mumbai study found Indian women spend an average of 4.5 hours daily on 'cognitive household management' — remembering appointments, school schedules, and family logistics — compared to 0.8 hours for men. This invisible load significantly contributes to burnout and career stagnation.",
    detailedSummary:
      "The concept of mental load — the cognitive work of managing a household and family — has gained academic recognition as a major contributor to women's burnout. TISS researchers used time-diary methodology across 1,200 dual-income families to quantify the disparity. The study found the gap worsens after the birth of the first child and rarely self-corrects unless explicitly addressed. Shared digital tools like family task apps and deliberate responsibility delegation showed measurable improvement.",
    keyTakeaways: [
      "Women spend 4.5 hours daily on household cognitive management",
      "Men average 0.8 hours of equivalent mental load",
      "The gap worsens significantly after having children",
      "Explicit responsibility sharing — not natural correction — is the solution",
    ],
    sourceName: "TISS Mumbai Household Labour Study",
    sourceUrl: "#",
  },
  {
    id: "pf-2",
    category: "parenting-family",
    headline: "Screen Time Under 2 — What the Latest Paediatric Guidelines Say",
    publishedTime: "4h ago",
    summary:
      "The Indian Academy of Paediatrics updated its screen time guidelines: zero screen time for children under 18 months (except video calls), and no more than 1 hour daily for children aged 2–5. The guidelines emphasise parental co-viewing and intentional content selection rather than passive exposure.",
    detailedSummary:
      "Updated guidelines respond to new research on the impact of solo screen time on language acquisition, attention, and emotional regulation in early childhood. The IAP distinguishes between video call interaction (beneficial, especially for working parents) and entertainment screen time (limited benefit, possible harm when excessive). The guidelines also note that parental screen use in front of young children is separately associated with reduced child-parent interaction quality.",
    keyTakeaways: [
      "Zero screen time recommended for under 18 months (except video calls)",
      "Under 1 hour daily recommended for children aged 2–5",
      "Co-viewing and content intentionality matter as much as time limits",
      "Parental phone use near children reduces interaction quality",
    ],
    sourceName: "Indian Academy of Paediatrics",
    sourceUrl: "#",
  },
  {
    id: "pf-3",
    category: "parenting-family",
    headline: "Nuclear Families Are the New Norm — 60% of Urban India Now Lives Without Joint Family",
    publishedTime: "6h ago",
    summary:
      "Census projections show 60% of urban Indian households are now nuclear — a generational shift from joint family structures. For working mothers, this eliminates built-in childcare support networks. The vacuum is being filled by paid daycare, neighbourhood cooperatives, and grandparent relocation arrangements.",
    detailedSummary:
      "The nuclear family shift is creating new challenges and opportunities. The loss of joint family childcare networks — particularly for women returning to work — is one of the most significant contributors to the motherhood penalty in India. Daycares and creches remain unaffordable for many working families. Meanwhile, community-based childcare cooperatives — where neighbourhood families share childcare informally — are emerging as an urban innovation.",
    keyTakeaways: [
      "60% of urban Indian households are now nuclear families",
      "Joint family childcare networks are increasingly unavailable",
      "Motherhood career penalty is worsened by lack of support systems",
      "Community childcare cooperatives are an emerging urban solution",
    ],
    sourceName: "NCAER Household Survey India",
    sourceUrl: "#",
  },
  {
    id: "pf-4",
    category: "parenting-family",
    headline: "Working Moms and Guilt — Research Shows Kids Do Fine, Mothers Thrive",
    publishedTime: "8h ago",
    summary:
      "A 25-year Harvard study tracking children of working mothers found no negative outcomes in academic performance, social skills, or emotional wellbeing. Working mothers' daughters are 23% more likely to be employed and earn 23% more than daughters of stay-at-home mothers. Guilt, it seems, is the only lasting harm.",
    detailedSummary:
      "The Harvard Business School study — one of the longest-running of its kind — used data across 33 countries and found consistent patterns: children of employed mothers develop comparable or better outcomes than peers, while mothers' own wellbeing, financial security, and self-esteem are measurably improved by employment. The researchers argue that societal guilt messaging toward working mothers is not evidence-based and contributes unnecessarily to mental health burden.",
    keyTakeaways: [
      "25-year Harvard study found no negative impact of maternal employment on children",
      "Daughters of working mothers earn 23% more on average",
      "Working mothers report higher self-esteem and financial security",
      "Societal guilt narratives are not evidence-based",
    ],
    sourceName: "Harvard Business School Working Paper",
    sourceUrl: "#",
  },
  {
    id: "pf-5",
    category: "parenting-family",
    headline: "Age of First Marriage for Indian Women Rises to 24.5 Years",
    publishedTime: "10h ago",
    summary:
      "The average age of first marriage for women in India has risen to 24.5 years — up from 22 in 2011. Urban women are marrying at 27 on average. This demographic shift reflects longer education periods, career prioritisation, and changing social norms around autonomy and life choices.",
    detailedSummary:
      "NFHS-5 and Census 2025 preliminary data both confirm the trend. The increase is driven by education duration — women completing post-graduation are entering the marriage market 4–5 years later than previous generations. In southern states, women's marriage age averages 26.5 — approaching European norms. The trend is associated with lower fertility rates, smaller family sizes, and significantly higher women's workforce participation, particularly in services sectors.",
    keyTakeaways: [
      "Average first marriage age for Indian women rose to 24.5 years",
      "Urban women average 27 years; southern states average 26.5",
      "Education duration is the primary driver of rising marriage age",
      "Associated with lower fertility, smaller families, higher workforce participation",
    ],
    sourceName: "NFHS-5 and Census 2025 Data",
    sourceUrl: "#",
  },
  {
    id: "pf-6",
    category: "parenting-family",
    headline: "Creche Policy for Working Mothers — Why India's Law Isn't Being Implemented",
    publishedTime: "12h ago",
    summary:
      "The Maternity Benefit (Amendment) Act 2017 requires all establishments with 50+ employees to provide creche facilities. A 2025 compliance audit found only 8% of eligible employers are meeting this requirement. Working mothers cite creche inaccessibility as a top reason for post-maternity attrition.",
    detailedSummary:
      "The creche mandate — in place since 2017 — has largely been ignored by private sector employers without meaningful enforcement. The Ministry of Labour's 2025 compliance audit of 4,500 establishments across 12 states found 92% non-compliance. Companies typically cite cost and space constraints. Advocacy groups propose a creche credit model — where multiple small employers pool resources to fund nearby childcare — as a practical alternative to in-office facilities.",
    keyTakeaways: [
      "Law requires creches for 50+ employee companies since 2017",
      "Only 8% of eligible employers comply",
      "Creche inaccessibility is a top driver of post-maternity attrition",
      "Creche credit pooling model proposed as practical alternative",
    ],
    sourceName: "Ministry of Labour & Employment Compliance Audit 2025",
    sourceUrl: "#",
  },
  {
    id: "pf-7",
    category: "parenting-family",
    headline: "Sandwich Generation Women — Caring for Both Parents and Children",
    publishedTime: "1d ago",
    summary:
      "India's 'sandwich generation' — adults simultaneously caring for dependent children and aging parents — is predominantly female. Studies show 70% of primary caregivers in dual-burden families are women. The associated financial and emotional load is linked to higher rates of career stagnation and health compromise.",
    detailedSummary:
      "As India's population ages alongside delayed parenthood, the sandwich generation phenomenon is growing. Women aged 35–50 are most affected, balancing school-age children with parents requiring daily support. Employer-provided eldercare support benefits — offered by fewer than 3% of Indian companies — could significantly reduce this burden. The economic value of unpaid caregiving by Indian women is estimated at ₹22.7 lakh crore annually — equivalent to 15% of GDP.",
    keyTakeaways: [
      "70% of dual-burden caregivers (children + elderly parents) are women",
      "Women aged 35–50 most affected by sandwich generation demands",
      "Only 3% of Indian companies offer eldercare support benefits",
      "Unpaid caregiving by women valued at ₹22.7 lakh crore (15% of GDP)",
    ],
    sourceName: "CRISIL Social Impact Report",
    sourceUrl: "#",
  },
  {
    id: "pf-8",
    category: "parenting-family",
    headline: "Gentle Parenting Is Reshaping How Indian Families Communicate",
    publishedTime: "2d ago",
    summary:
      "Gentle parenting — prioritising emotional validation, natural consequences, and open communication over punishment — is being adopted by an estimated 15 million Indian families. Parenting books by authors like Janet Lansbury are bestsellers. Child psychologists report meaningful reduction in anxiety disorders in children raised with the approach.",
    detailedSummary:
      "Gentle parenting's rise in India reflects broader shifts in parenting philosophy, driven by access to international research through social media and English-language parenting content. Indian child psychologists note a meaningful correlation between gentle parenting adoption and lower child anxiety scores, better conflict resolution skills, and reduced fear of parental figures. The approach also appears to reduce parental burnout by reducing power struggle dynamics.",
    keyTakeaways: [
      "15 million Indian families estimated to practice gentle parenting",
      "Reduces child anxiety and improves conflict resolution skills",
      "Social media and English-language content are primary awareness drivers",
      "Also reduces parental burnout by decreasing power struggle dynamics",
    ],
    sourceName: "Indian Journal of Child Psychology",
    sourceUrl: "#",
  },
  {
    id: "pf-9",
    category: "parenting-family",
    headline: "Stay-at-Home Dads on the Rise — India's New Domestic Gender Pioneers",
    publishedTime: "3d ago",
    summary:
      "India's remote work revolution and rising female incomes are enabling a small but growing cohort of stay-at-home dads. Urban estimates suggest 2–3% of dual-income households now have the father as primary caregiver. These families report high satisfaction but social stigma remains a significant barrier.",
    detailedSummary:
      "India's first longitudinal study of stay-at-home fathers — conducted by the Centre for Social Research Delhi — found these households show equal or higher family satisfaction scores compared to traditional arrangements, with children demonstrating particularly strong emotional intelligence. However, stay-at-home fathers consistently report social pressure from extended family, employers, and peers. Some men report downplaying their caregiving role to maintain social standing.",
    keyTakeaways: [
      "2–3% of urban dual-income households now have stay-at-home fathers",
      "These families report equal or higher satisfaction scores",
      "Children in these households show stronger emotional intelligence",
      "Social stigma remains a significant barrier for fathers",
    ],
    sourceName: "Centre for Social Research, Delhi",
    sourceUrl: "#",
  },
  {
    id: "pf-10",
    category: "parenting-family",
    headline: "Why Talking to Teenagers Openly About Money Is the Best Financial Education",
    publishedTime: "4d ago",
    summary:
      "Research by the Reserve Bank of India's financial literacy initiative found teens whose parents openly discussed family finances, savings, and budgeting were 3x more likely to develop healthy financial habits by age 25. Simple practices — showing grocery bills, explaining utility costs, and discussing savings goals — make the difference.",
    detailedSummary:
      "Financial literacy is most effectively built through real-life contexts, not textbooks. RBI's study of 5,000 young adults traced financial behaviour back to parenting practices during adolescence. Open money conversations — including discussing financial mistakes, income levels, and investment decisions — reduced financial anxiety in adulthood significantly. The study recommends involving teenagers in household budgeting as an active participant rather than a passive observer.",
    keyTakeaways: [
      "Open money discussions with teens lead to 3x better adult financial habits",
      "Simple exposure: grocery bills, utility costs, savings goals",
      "Financial mistakes discussed openly are more educational than successes",
      "Involve teens actively in household budgeting",
    ],
    sourceName: "RBI Financial Literacy Initiative Study",
    sourceUrl: "#",
  },

  /* ── Travel, Arts & Culture ─── */
  {
    id: "ta-1",
    category: "travel-arts",
    headline: "Solo Female Travel in India — Safety Indices Improve Across 15 Cities",
    publishedTime: "1h ago",
    summary:
      "India's Safe City Index 2025 shows measurable improvement in 15 cities, driven by better street lighting, women's police helplines, and safe taxi regulations. Bengaluru, Chandigarh, and Pune rank highest for solo female travellers. Women's travel communities on Instagram report 40% more India solo trips than the year prior.",
    detailedSummary:
      "The Ministry of Women & Child Development's Safe City programme — operational in 8 cities and expanded to 15 in 2025 — has delivered measurable infrastructure improvements. Emergency helpline response times, CCTV coverage, and well-lit public spaces are quantified metrics showing positive trends. Solo female travel communities like 'Girls Gone Travelling India' and 'Wander Women' have grown to over 2 million members, sharing real-time safety intel and itinerary templates.",
    keyTakeaways: [
      "15 Indian cities improved in the 2025 Safe City Index",
      "Bengaluru, Chandigarh, and Pune rank highest for solo women",
      "Emergency helpline response times and lighting are key improvements",
      "Women's travel communities share 40% more India solo trips",
    ],
    sourceName: "Ministry of Women & Child Development Safe City Report",
    sourceUrl: "#",
  },
  {
    id: "ta-2",
    category: "travel-arts",
    headline: "Rajasthan's Craft Tourism Boom — Women Artisans Are the Backbone",
    publishedTime: "3h ago",
    summary:
      "Craft-based tourism in Rajasthan contributed ₹8,500 crore to the state economy in 2024, with women artisans producing over 70% of textile exports. Government-supported cooperatives are connecting rural women artisans directly to global buyers, cutting out middlemen and tripling artisan incomes.",
    detailedSummary:
      "Rajasthan's craft economy — spanning block printing, bandhani, blue pottery, and miniature painting — is being transformed by direct-to-buyer digital platforms and fair trade certification. The Rajasthan State Handloom Development Corporation is training rural women in digital commerce, photography, and export documentation. Artisans connected to the GI (Geographical Indication) certification process are achieving 3–5x price premiums on international markets.",
    keyTakeaways: [
      "Rajasthan craft tourism generated ₹8,500 crore in 2024",
      "Women produce 70% of Rajasthan's textile craft exports",
      "Direct-to-buyer digital platforms tripling artisan incomes",
      "GI certification fetches 3–5x price premiums internationally",
    ],
    sourceName: "Rajasthan Tourism Development Corporation",
    sourceUrl: "#",
  },
  {
    id: "ta-3",
    category: "travel-arts",
    headline: "Southeast Asia on a Budget — 7-Day Itineraries Under ₹60,000",
    publishedTime: "5h ago",
    summary:
      "Travel bloggers and budget experts have mapped 7-day Southeast Asia itineraries for under ₹60,000 including flights from India. Thailand, Vietnam, and Indonesia emerge as the best value destinations. Off-peak travel in May–June and direct flight bookings 3 months in advance are the top savings strategies.",
    detailedSummary:
      "Southeast Asia's affordability relative to European destinations is making it the fastest-growing international destination for Indian budget travellers. Visa-on-arrival and e-visa convenience for Thailand, Vietnam, and Bali removes a significant friction barrier. Budget carriers like IndiGo, Air Asia, and Scoot have increased direct routes from Tier 1 Indian cities, further reducing costs. Hostel and guesthouse networks catering to Indian female solo travellers are expanding rapidly.",
    keyTakeaways: [
      "7-day Southeast Asia trips achievable under ₹60,000 including flights",
      "Thailand, Vietnam, and Indonesia offer the best value",
      "Book 3 months ahead; travel May–June for maximum savings",
      "Budget airlines have expanded direct routes from Indian Tier 1 cities",
    ],
    sourceName: "Travel Wanderlust India",
    sourceUrl: "#",
  },
  {
    id: "ta-4",
    category: "travel-arts",
    headline: "India's Classical Dance Revival — Young Women Reclaim Ancient Art Forms",
    publishedTime: "7h ago",
    summary:
      "Indian classical dance forms — Bharatanatyam, Kathak, Manipuri, and Kuchipudi — are seeing a renaissance among urban young women, fuelled by Instagram reels reaching new audiences. Dance academies report 60% enrolment growth. Artists like Shobana and Rama Vaidyanathan are drawing sold-out audiences globally.",
    detailedSummary:
      "The renaissance in Indian classical dance is being driven at two levels — grassroots participation through dance academies, and elite international performance. Instagram has been particularly impactful, with artists like Malavika Sarukkai (Bharatanatyam) and Aditi Mangaldas (Kathak) using short-form content to contextualise and demystify these art forms for younger audiences. Classical dance teachers report that families now actively seek out classical training as a complement to academic education.",
    keyTakeaways: [
      "Classical dance academies report 60% enrolment growth",
      "Instagram is bringing new audiences to traditional forms",
      "Shobana, Rama Vaidyanathan, Malavika Sarukkai driving global interest",
      "Families increasingly value classical training alongside academics",
    ],
    sourceName: "Sangeet Natak Akademi India",
    sourceUrl: "#",
  },
  {
    id: "ta-5",
    category: "travel-arts",
    headline: "Workcation Boom — Indian Women Professionals Choose Coorg, Manali, and Pondicherry",
    publishedTime: "9h ago",
    summary:
      "The workcation trend — combining remote work with travel — is being led by Indian professional women aged 25–38. Coorg, Manali, and Pondicherry are the top three destinations. Boutique stays with reliable Wi-Fi and co-working arrangements report 80% occupancy rates year-round.",
    detailedSummary:
      "Remote work legitimisation by employers has enabled a permanent shift in the relationship between work and place. Indian professional women are disproportionately driving workcation demand, citing freedom from urban domestic obligations, access to nature, and community with other like-minded remote workers. Property owners in Coorg, Manali, and Pondicherry are adapting offerings to include standing desks, Zoom-quiet spaces, and curated local experience packages.",
    keyTakeaways: [
      "Professional women aged 25–38 are leading India's workcation trend",
      "Top destinations: Coorg, Manali, Pondicherry",
      "Boutique stays with co-working spaces at 80% year-round occupancy",
      "Domestic obligation relief and nature access are top motivators",
    ],
    sourceName: "India Tourism Statistics 2025",
    sourceUrl: "#",
  },
  {
    id: "ta-6",
    category: "travel-arts",
    headline: "Women Photographers Reshaping How India Sees Itself",
    publishedTime: "12h ago",
    summary:
      "A new generation of Indian women photojournalists and documentary photographers — including Isadora Romero and Upasana Das — are capturing stories of rural women, marginalised communities, and ordinary life with intimacy inaccessible to male photographers. Their work is winning international recognition and shifting narratives.",
    detailedSummary:
      "Women photographers' ability to access intimate spaces — women-only sections of trains, domestic interiors, all-female religious gatherings — provides a unique documentary perspective that male photographers cannot replicate. This access advantage is being recognised by international publications. The Prix Pictet, World Press Photo, and National Geographic have all awarded Indian women photographers in the last 3 years, drawing global attention to previously unseen Indian realities.",
    keyTakeaways: [
      "Women photographers access intimate spaces unavailable to male peers",
      "International recognition: Prix Pictet, World Press Photo, National Geographic",
      "Documentary work centering marginalised women's stories gaining global reach",
      "New generation of Indian women photographers reshaping national visual narrative",
    ],
    sourceName: "World Press Photo Foundation",
    sourceUrl: "#",
  },
  {
    id: "ta-7",
    category: "travel-arts",
    headline: "Heritage Walks Led by Women Historians Are Transforming Urban Tourism",
    publishedTime: "1d ago",
    summary:
      "Women-led heritage walk companies in Delhi, Mumbai, and Ahmedabad are reframing city history through women's stories — queens, poets, courtesans, reformers — that standard tourism ignores. Bombay Heritage Walks, led by Bhavna Bhatt, has sold out every weekend for 8 months and trained 25 new women guides.",
    detailedSummary:
      "The heritage walk industry is being disrupted by women historians and storytellers who argue that existing city tours centre male political history at the expense of richer social narratives. Walks focusing on women's architecture patronage, Mughal queens, devadasi history, and reformers like Savitribai Phule are attracting diverse audiences including tourists, students, and corporate groups. Revenue per guide has more than doubled in this narrative-led segment.",
    keyTakeaways: [
      "Women-led heritage walks reframe city history through women's stories",
      "Bombay Heritage Walks sold out every weekend for 8 months",
      "Topics: Mughal queens, reformers, courtesans, women's architecture patronage",
      "Revenue per guide doubled in narrative-led heritage walking",
    ],
    sourceName: "India Tourism Industry Association",
    sourceUrl: "#",
  },
  {
    id: "ta-8",
    category: "travel-arts",
    headline: "Tribal Art Goes Global — Warli, Madhubani, and Gond in International Galleries",
    publishedTime: "2d ago",
    summary:
      "Tribal art forms made predominantly by women are achieving global gallery presence. Madhubani painter Dulari Devi and Gond artist Bhajju Shyam's works are in the permanent collections of museums in London, New York, and Berlin. Online platforms are enabling direct-to-collector sales, revolutionising artisan economics.",
    detailedSummary:
      "India's tribal and folk art — created almost entirely by women for centuries as a domestic and ritual practice — is being reframed as fine art on the global stage. The shift is partly commercial and partly curatorial, as international museums expand their non-Western collections. Online platforms like Mygaaon and Gaatha are facilitating direct art sales, connecting buyers globally with women artists in Madhya Pradesh, Bihar, and Maharashtra, eliminating gallery commission intermediaries.",
    keyTakeaways: [
      "Madhubani and Gond art in museum collections in London, New York, Berlin",
      "Tribal art is predominantly made by women with centuries of lineage",
      "Online platforms enable direct-to-collector sales",
      "Women artists earning 3–5x more by bypassing gallery commissions",
    ],
    sourceName: "Crafts Council of India",
    sourceUrl: "#",
  },
  {
    id: "ta-9",
    category: "travel-arts",
    headline: "Spa and Wellness Tourism — India's New Export Opportunity",
    publishedTime: "3d ago",
    summary:
      "India's traditional wellness systems — Ayurveda, yoga, and naturopathy — are attracting 3 lakh medical tourists annually. Kerala leads with 60% of Ayurveda tourism. Women constitute 65% of wellness tourists globally, and India is positioning itself as the definitive global wellness destination.",
    detailedSummary:
      "India's Ministry of Tourism's 'Heal in India' campaign is capturing global demand for authentic wellness experiences. Kerala Ayurveda retreats are certified by AYUSH and are increasingly integrated into international medical tourism packages. Indian wellness tourism revenue is projected to reach $25 billion by 2030. German, American, and Japanese tourists show the highest per-visit spend, particularly for week-long residential Panchakarma programs.",
    keyTakeaways: [
      "3 lakh medical tourists visit India annually for Ayurveda and yoga",
      "Kerala has 60% of India's Ayurveda tourism",
      "Women are 65% of global wellness tourists",
      "Wellness tourism projected to reach $25 billion by 2030",
    ],
    sourceName: "Ministry of Tourism 'Heal in India' Report",
    sourceUrl: "#",
  },
  {
    id: "ta-10",
    category: "travel-arts",
    headline: "Reading Is Back — Women Are Buying More Physical Books Than Ever",
    publishedTime: "4d ago",
    summary:
      "Physical book sales in India grew 18% in 2024, with women driving the majority of growth. Literary fiction, self-help, and women's life writing are the top categories. Independent bookstores in Bengaluru, Kolkata, and Mumbai are reporting record footfall. BookTok — TikTok's reading community — has an outsized India female readership.",
    detailedSummary:
      "India's book market is experiencing a renaissance, with physical books experiencing surprising growth despite digital entertainment competition. Women aged 22–45 are the single largest buyer group across all categories. Women's writing — including memoirs, literary fiction by Indian women authors like Perumal Murugan's translators and Benyamin's work — is seeing particular growth. The BookTok phenomenon on Instagram (India's equivalent) is driving impulse purchases and niche discovery.",
    keyTakeaways: [
      "Physical book sales grew 18% in India in 2024",
      "Women aged 22–45 are the single largest buyer group",
      "Literary fiction, self-help, and memoirs by women authors lead",
      "BookTok community on Instagram driving discovery and impulse purchases",
    ],
    sourceName: "Federation of Indian Publishers",
    sourceUrl: "#",
  },
];

/* ── Financial Compass ──────────────────────────────────────── */
// TODO Stage 2: Connect multi-step wizard to Supabase for progress autosave.
// Users should be able to leave and resume from the last completed step.

export const FINANCIAL_GOALS = [
  { id: "higher-education", label: "Higher Education", icon: createElement(GraduationCap, { className: "w-7 h-7" }), description: "Fund your degree or certification" },
  { id: "emergency-fund", label: "Emergency Fund", icon: createElement(ShieldCheck, { className: "w-7 h-7" }), description: "Build a 6-month safety net" },
  { id: "start-business", label: "Start a Business", icon: createElement(Rocket, { className: "w-7 h-7" }), description: "Launch your entrepreneurial journey" },
  { id: "buy-laptop", label: "Buy a Laptop", icon: createElement(Laptop, { className: "w-7 h-7" }), description: "Invest in your productivity" },
  { id: "home", label: "Own a Home", icon: createElement(Home, { className: "w-7 h-7" }), description: "Plan for your dream property" },
  { id: "vehicle", label: "Buy a Vehicle", icon: createElement(Car, { className: "w-7 h-7" }), description: "Fund your two or four-wheeler" },
  { id: "other", label: "Other Goal", icon: createElement(Sparkles, { className: "w-7 h-7" }), description: "Define your custom financial goal" },
];

export const PLACEHOLDER_BUDGET_ALLOCATIONS: BudgetAllocation[] = [
  {
    label: "Needs",
    percent: 50,
    amount: "₹25,000",
    color: "#b46c72",
    description: "Rent, groceries, utilities, EMIs",
  },
  {
    label: "Savings",
    percent: 20,
    amount: "₹10,000",
    color: "#5e7b9b",
    description: "Goal savings, SIP investments",
  },
  {
    label: "Investment",
    percent: 10,
    amount: "₹5,000",
    color: "#16a34a",
    description: "Index funds, fixed deposits",
  },
  {
    label: "Learning",
    percent: 10,
    amount: "₹5,000",
    color: "#d97706",
    description: "Courses, books, certifications",
  },
  {
    label: "Emergency Fund",
    percent: 10,
    amount: "₹5,000",
    color: "#7c3aed",
    description: "Liquid emergency reserve",
  },
];

export const PLACEHOLDER_RECOMMENDATIONS: FinancialRecommendation[] = [
  {
    id: "r1",
    icon: createElement(Lightbulb, { className: "w-5 h-5" }),
    title: "Reduce Subscription Expenses",
    description: "Audit and cancel unused subscriptions. Estimated monthly saving: ₹1,200.",
    priority: "high",
  },
  {
    id: "r2",
    icon: createElement(TrendingUp, { className: "w-5 h-5" }),
    title: "Start an SIP Immediately",
    description: "Even ₹500/month in a large-cap index fund compounds significantly over 10 years.",
    priority: "high",
  },
  {
    id: "r3",
    icon: createElement(ShieldCheck, { className: "w-5 h-5" }),
    title: "Build Your Emergency Fund First",
    description: "Target 3 months of expenses in a liquid savings account before investing.",
    priority: "high",
  },
  {
    id: "r4",
    icon: createElement(BookOpen, { className: "w-5 h-5" }),
    title: "Invest in a High-ROI Certification",
    description: "Targeted skill certifications can increase earning potential by 15–30%.",
    priority: "medium",
  },
  {
    id: "r5",
    icon: createElement(CreditCard, { className: "w-5 h-5" }),
    title: "Reduce Credit Card Usage",
    description: "Use credit only for planned purchases. Pay full balance monthly to avoid interest.",
    priority: "medium",
  },
  {
    id: "r6",
    icon: createElement(Landmark, { className: "w-5 h-5" }),
    title: "Open a PPF Account",
    description: "Public Provident Fund offers tax-free returns at 7.1% with government backing.",
    priority: "low",
  },
];

export const PLACEHOLDER_ACTION_PLAN: ActionPlanItem[] = [
  {
    id: "ap1",
    label: "Set up automatic SIP of ₹5,000/month",
    description: "Automate by 5th of every month via your banking app",
    checked: false,
  },
  {
    id: "ap2",
    label: "Open a high-yield savings account",
    description: "Target accounts with 6–7% interest for emergency funds",
    checked: false,
  },
  {
    id: "ap3",
    label: "Complete Google Data Analytics Certificate",
    description: "Targeted completion: 8 weeks at 5 hours/week",
    checked: false,
  },
  {
    id: "ap4",
    label: "Cancel unused subscriptions",
    description: "Review and cancel within the next 7 days",
    checked: false,
  },
  {
    id: "ap5",
    label: "Research Mudra Yojana eligibility",
    description: "Government scheme for business seed funding up to ₹10 lakh",
    checked: false,
  },
  {
    id: "ap6",
    label: "Build a 3-month emergency fund",
    description: "Target: ₹75,000 in a separate liquid savings account",
    checked: false,
  },
  {
    id: "ap7",
    label: "Track all expenses for 30 days",
    description: "Use any free budgeting app: Walnut, Money Manager, or YNAB",
    checked: false,
  },
];

export const PLACEHOLDER_BUSINESS_PLAN: BusinessPlanCard[] = [
  {
    id: "bp1",
    label: "Estimated Investment",
    value: "₹2–5 Lakh",
    icon: createElement(Wallet, { className: "w-5 h-5" }),
    description: "Based on your business idea and location",
  },
  {
    id: "bp2",
    label: "Required Certifications",
    value: "FSSAI, GST, Udyam",
    icon: createElement(Scroll, { className: "w-5 h-5" }),
    description: "Depending on business type",
  },
  {
    id: "bp3",
    label: "Government Schemes",
    value: "Mudra, PMEGP, WEP",
    icon: createElement(Landmark, { className: "w-5 h-5" }),
    description: "Zero-collateral seed funding available",
  },
  {
    id: "bp4",
    label: "Estimated Timeline",
    value: "6–12 months",
    icon: createElement(CalendarDays, { className: "w-5 h-5" }),
    description: "From planning to first revenue",
  },
  {
    id: "bp5",
    label: "Break-even Estimate",
    value: "18–24 months",
    icon: createElement(BarChart2, { className: "w-5 h-5" }),
    description: "Based on 20% net margin assumptions",
  },
  {
    id: "bp6",
    label: "Risk Level",
    value: "Medium",
    icon: createElement(Zap, { className: "w-5 h-5" }),
    description: "Manageable with proper planning",
  },
  {
    id: "bp7",
    label: "Required Skills",
    value: "Sales, Operations, Finance",
    icon: createElement(Brain, { className: "w-5 h-5" }),
    description: "Top 3 skills to develop or hire for",
  },
  {
    id: "bp8",
    label: "Monthly Savings Target",
    value: "₹8,000 / month",
    icon: createElement(CircleDollarSign, { className: "w-5 h-5" }),
    description: "To reach ₹2L capital in 25 months",
  },
];

