const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── DATA ARRAYS ──────────────────────────────────────────────────────────

const ORGANIZATIONS = [
  "Google", "Microsoft", "Amazon", "Adobe", "Meta", "Apple", "Netflix",
  "OpenAI", "Anthropic", "NVIDIA", "Intel", "AMD", "Atlassian", "Freshworks",
  "Zoho", "PhonePe", "Razorpay", "Flipkart", "Meesho", "Swiggy", "TCS",
  "Infosys", "Wipro", "Accenture", "Deloitte", "PwC", "Reliance Foundation",
  "Google Women Techmakers", "Outreachy", "Google Summer of Code", "MLH",
  "Hack2Skill", "Devfolio", "Devpost", "Unstop", "AICTE", "Kaggle", "IEEE",
  "ACM", "Smart India Hackathon", "Google Solution Challenge", "Microsoft Imagine Cup"
];

const LOCATIONS = [
  { city: "Bengaluru", country: "India" },
  { city: "Hyderabad", country: "India" },
  { city: "Pune", country: "India" },
  { city: "Mumbai", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Chennai", country: "India" },
  { city: "Kolkata", country: "India" },
  { city: "London", country: "United Kingdom" },
  { city: "Berlin", country: "Germany" },
  { city: "Seattle", country: "United States" },
  { city: "New York", country: "United States" },
  { city: "Toronto", country: "Canada" },
  { city: "Singapore", country: "Singapore" },
  { city: "Sydney", country: "Australia" }
];

const SKILLS_POOL = [
  "React", "Next.js", "Node.js", "TypeScript", "Python", "Java", "Go", "Rust",
  "SQL", "MongoDB", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Azure",
  "Machine Learning", "Data Science", "Cybersecurity", "Flutter", "Android",
  "iOS", "UI Design", "UX Research", "Figma", "Marketing", "Finance",
  "Research", "Teaching", "Leadership", "Communication"
];

const EDU_LEVELS = ["any", "high_school", "diploma", "undergraduate", "postgraduate", "phd"];
const CAREER_STAGES = ["any", "student", "career_break", "working"];

// ── UTILS ────────────────────────────────────────────────────────────────

let idCounter = 1;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function randomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateFutureDate() {
  const daysAhead = randomInt(7, 90);
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString();
}

function generateDescription(title, org, category) {
  const templates = [
    `Join ${org} as a ${title} and be part of an innovative team driving the future of technology. We are looking for passionate individuals who thrive in dynamic environments. You will collaborate with cross-functional teams, solving complex problems and delivering high-quality solutions. This ${category} offers a unique opportunity to grow your skills while making a tangible impact on our global user base.`,
    `We at ${org} are excited to announce our opening for the ${title} position. As a key participant in this ${category}, you will dive deep into challenging projects, working alongside industry veterans. Expect to push the boundaries of what's possible, experiment with new technologies, and contribute to our core objectives. Our culture values continuous learning, inclusivity, and bold ideas.`,
    `${org} is seeking a highly motivated ${title} to join us. This ${category} is designed to challenge you and accelerate your career. You'll be taking ownership of significant deliverables, participating in strategic planning, and executing on vision. We offer mentorship, state-of-the-art resources, and a collaborative atmosphere where your voice is heard and your contributions are celebrated.`,
    `Discover what you're capable of with ${org}. The ${title} role is a fast-paced ${category} aimed at ambitious individuals ready to take their career to the next level. You will work on cutting-edge systems, optimize existing workflows, and help us scale. We believe in empowering our people, providing excellent benefits, and fostering a workplace where creativity and technical excellence shine.`
  ];
  return randomItem(templates);
}

// ── GENERATOR ────────────────────────────────────────────────────────────

function generateOpportunities(category, count) {
  const opportunities = [];

  for (let i = 0; i < count; i++) {
    const org = randomItem(ORGANIZATIONS);
    
    let titlePrefix = "";
    if (category === "job") titlePrefix = randomItem(["Software Engineer", "Frontend Developer", "Backend Developer", "Product Designer", "Data Scientist", "DevOps Engineer", "Security Analyst"]);
    if (category === "internship") titlePrefix = randomItem(["Software Engineering Intern", "Marketing Intern", "Design Intern", "Data Intern"]);
    if (category === "scholarship") titlePrefix = randomItem(["Women in STEM Scholarship", "Merit Scholarship", "Future Leaders Grant", "Tech Innovators Scholarship"]);
    if (category === "hackathon") titlePrefix = randomItem(["Global AI Hackathon", "Web3 Buidlathon", "FinTech Sprint", "ClimateTech Challenge"]);
    if (category === "fellowship") titlePrefix = randomItem(["Open Source Fellow", "Research Fellowship", "AI Ethics Fellow"]);
    if (category === "competition") titlePrefix = randomItem(["Algorithmic Coding Challenge", "Designathon", "Business Case Competition"]);

    const title = `${titlePrefix} ${randomInt(2026, 2027)}`;
    const isRemote = Math.random() > 0.5;
    const isHybrid = !isRemote && Math.random() > 0.5;
    
    let loc = randomItem(LOCATIONS);
    if (isRemote) {
      loc = { city: "Remote", country: "Global" };
    }

    const isWomenFocused = Math.random() > 0.8 || title.toLowerCase().includes("women");
    
    opportunities.push({
      id: `${category}_${idCounter++}_${Math.random().toString(36).substring(2, 9)}`,
      title,
      organization: org,
      category,
      description: generateDescription(title, org, category),
      eligibility: [
        "Must be 18 years or older.",
        "Passionate about technology and innovation."
      ],
      requirements: [
        "Strong problem-solving skills.",
        "Excellent communication abilities."
      ],
      skills: randomItems(SKILLS_POOL, randomInt(2, 5)),
      preferredSkills: randomItems(SKILLS_POOL, randomInt(1, 3)),
      location: loc.city,
      country: loc.country,
      remote: isRemote,
      hybrid: isHybrid,
      deadline: generateFutureDate(),
      duration: Math.random() > 0.5 ? `${randomInt(2, 6)} months` : null,
      stipend: Math.random() > 0.5 ? `$${randomInt(1000, 5000)}/month` : null,
      applyUrl: `https://example.com/apply/${Math.random().toString(36).substring(2, 8)}`,
      featured: Math.random() < 0.1, // 10%
      womenFocused: isWomenFocused,
      careerBreakFriendly: Math.random() > 0.7,
      educationLevel: randomItem(EDU_LEVELS),
      careerStage: randomItem(CAREER_STAGES),
      tags: randomItems(["AI", "Frontend", "Backend", "Cloud", "Research", "Women", "Leadership", "Finance", "Healthcare", "Education", "Remote", "Open Source"], randomInt(2, 4))
    });
  }

  return opportunities;
}

// ── EXECUTION ────────────────────────────────────────────────────────────

const configs = [
  { file: "jobs.json", category: "job", count: randomInt(40, 60) },
  { file: "internships.json", category: "internship", count: randomInt(30, 50) },
  { file: "scholarships.json", category: "scholarship", count: randomInt(25, 40) },
  { file: "hackathons.json", category: "hackathon", count: randomInt(25, 40) },
  { file: "fellowships.json", category: "fellowship", count: randomInt(15, 30) },
  { file: "competitions.json", category: "competition", count: randomInt(15, 30) },
];

let total = 0;
configs.forEach(c => {
  const data = generateOpportunities(c.category, c.count);
  fs.writeFileSync(path.join(DATA_DIR, c.file), JSON.stringify(data, null, 2));
  console.log(`Generated ${c.count} records for ${c.file}`);
  total += c.count;
});
console.log(`\nTotal opportunities generated: ${total}`);
