// Single source of truth for input character limits. These MUST match the
// backend Zod schemas + Mongoose validators in backend/utils/validation.js.
// The backend remains the authority, these enforce a friendlier client-side
// UX (hard stop + counter) but the server re-validates everything.
export const LIMITS = {
  message: {
    dm: 2000,
    community: 2000,
    therry: 4000,
  },
  mood: {
    note: 500,
    factors: 20,
  },
  crisis: {
    description: 1000,
  },
  safetyPlan: {
    item: 120,
    maxItems: 10,
  },
  profile: {
    firstName: 50,
    lastName: 50,
    bio: 300,
  },
  community: {
    name: 60,
    description: 200,
    rules: 500,
    inviteKey: 8,
  },
  thoughtRecord: {
    situation: 500,
    automaticThought: 500,
    emotions: 300,
    evidenceFor: 500,
    evidenceAgainst: 500,
    reframe: 500,
    outcomeEmotion: 300,
  },
  journal: {
    title: 200,
    content: 5000,
    comment: 1000,
    tag: 30,
    maxTags: 10,
  },
  habit: {
    name: 80,
    emoji: 8,
  },
} as const
