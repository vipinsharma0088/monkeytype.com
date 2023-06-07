export const defaultSnap: MonkeyTypes.Snapshot = {
  results: undefined,
  personalBests: {
    time: {},
    words: {},
    quote: {},
    zen: {},
    custom: {},
  },
  name: "",
  customThemes: [],
  presets: [],
  tags: [],
  favouriteThemes: [],
  banned: undefined,
  verified: undefined,
  emailVerified: undefined,
  lbMemory: { time: { 15: { english: 0 }, 60: { english: 0 } } },
  typingStats: {
    timeTyping: 0,
    startedTests: 0,
    completedTests: 0,
  },
  quoteRatings: undefined,
  quoteMod: false,
  favoriteQuotes: {},
  addedAt: 0,
  filterPresets: [],
  xp: 0,
  inboxUnreadSize: 0,
  streak: 0,
  maxStreak: 0,
  streakHourOffset: 0,
};
