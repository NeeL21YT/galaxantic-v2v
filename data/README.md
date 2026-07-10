# Opportunity Dataset

This directory contains the JSON dataset files for the Herizon Opportunity Navigator.

## Files expected (Stage 2D-1)

| File | Category |
|------|----------|
| `jobs.json` | Full-time jobs |
| `internships.json` | Internships |
| `scholarships.json` | Scholarships |
| `hackathons.json` | Hackathons |
| `fellowships.json` | Fellowships |
| `competitions.json` | Competitions |

## Schema (all files use the same shape)

```json
[
  {
    "id": "job_001",
    "title": "string",
    "organization": "string",
    "category": "job | internship | scholarship | hackathon | fellowship | competition",
    "description": "string",
    "eligibility": ["string"],
    "requirements": ["string"],
    "skills": ["string"],
    "preferredSkills": ["string"],
    "location": "string",
    "country": "string",
    "remote": false,
    "hybrid": false,
    "deadline": "2025-12-31",
    "duration": "string | null",
    "stipend": "string | null",
    "applyUrl": "https://...",
    "featured": false,
    "womenFocused": false,
    "careerBreakFriendly": false,
    "educationLevel": "any | undergraduate | postgraduate | phd | ...",
    "careerStage": "any | student | working | career_break | ...",
    "tags": ["string"]
  }
]
```

> Until these files are added, the Opportunity Navigator shows a friendly empty state.
> The system automatically picks up the files when they are added - no code changes needed.
