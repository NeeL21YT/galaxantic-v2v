/**
 * lib/coach/conversation-title.ts
 *
 * Generates concise, user-editable conversation titles after the first prompt.
 */

const TITLE_PATTERNS: Array<{ match: RegExp; title: string }> = [
  { match: /\b(resume|cv|ats|bullet)\b/i, title: "Resume Review" },
  { match: /\b(interview|mock|google|amazon|microsoft|prep)\b/i, title: "Interview Preparation" },
  { match: /\b(certification|course|learn|skill|upskill|study)\b/i, title: "Learning Plan" },
  { match: /\b(career break|gap|restart|return)\b/i, title: "Career Break Advice" },
  { match: /\b(project|portfolio|github)\b/i, title: "Project Ideas" },
  { match: /\b(switch|transition|change careers|roadmap)\b/i, title: "Career Transition" },
  { match: /\b(freelance|remote|opportunit|job|internship|fellowship)\b/i, title: "Opportunity Advice" },
  { match: /\b(data science|machine learning|analytics)\b/i, title: "Data Science Roadmap" },
  { match: /\b(frontend|front-end|react|next\.?js)\b/i, title: "Frontend Career" },
];

function titleCase(words: string[]): string {
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function generateConversationTitle(firstUserMessage: string): string {
  const trimmed = firstUserMessage.replace(/\s+/g, " ").trim();

  for (const pattern of TITLE_PATTERNS) {
    if (pattern.match.test(trimmed)) return pattern.title;
  }

  const words = trimmed
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 4);

  return words.length > 0 ? titleCase(words) : "Career Advice";
}
