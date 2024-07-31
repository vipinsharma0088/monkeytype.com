import {
  Result,
  ResultFilters,
  User,
  UserProfileDetails,
} from "@monkeytype/shared-types";
import { Mode } from "@monkeytype/contracts/schemas/shared";
import { Config } from "@monkeytype/contracts/schemas/configs";

export type PageName =
  | "loading"
  | "test"
  | "settings"
  | "about"
  | "account"
  | "login"
  | "profile"
  | "profileSearch"
  | "404";

export type LanguageGroup = {
  name: string;
  languages: string[];
};

export type AddNotificationOptions = {
  important?: boolean;
  duration?: number;
  customTitle?: string;
  customIcon?: string;
  closeCallback?: () => void;
  allowHTML?: boolean;
};

export type Accents = [string, string][];

export type LanguageObject = {
  name: string;
  rightToLeft: boolean;
  noLazyMode?: boolean;
  ligatures?: boolean;
  orderedByFrequency?: boolean;
  words: string[];
  additionalAccents: Accents;
  bcp47?: string;
  originalPunctuation?: boolean;
};

export type DefaultWordsModes = 10 | 25 | 50 | 100;

export type DefaultTimeModes = 15 | 30 | 60 | 120;

export type QuoteModes = "short" | "medium" | "long" | "thicc";

export type CustomLayoutFluidSpaces =
  | import("@monkeytype/contracts/schemas/configs").CustomLayoutFluid
  | `${string} ${string} ${string}`;

export type HistoryChartData = {
  x: number;
  y: number;
  wpm: number;
  acc: number;
  mode: string;
  mode2: string;
  punctuation: boolean;
  language: string;
  timestamp: number;
  difficulty: string;
  raw: number;
  isPb: boolean;
};

export type AccChartData = {
  x: number;
  y: number;
  errorRate: number;
};

export type OtherChartData = {
  x: number;
  y: number;
};

export type ActivityChartDataPoint = {
  x: number;
  y: number;
  amount?: number;
};

export type FontObject = {
  name: string;
  display?: string;
  systemFont?: string;
};

export type FunboxWordsFrequency = "normal" | "zipf";

export type FunboxWordOrder = "normal" | "reverse";

export type FunboxProperty =
  | "symmetricChars"
  | "conflictsWithSymmetricChars"
  | "changesWordsVisibility"
  | "speaks"
  | "unspeakable"
  | "changesLayout"
  | "ignoresLayout"
  | "usesLayout"
  | "ignoresLanguage"
  | "noLigatures"
  | "noLetters"
  | "changesCapitalisation"
  | "nospace"
  | `toPush:${number}`
  | "noInfiniteDuration"
  | "changesWordsFrequency"
  | `wordOrder:${FunboxWordOrder}`;

type Wordset = {
  words: string[];
  length: number;
  orderedIndex: number;
  shuffledIndexes: number[];
  resetIndexes(): void;
  randomWord(mode: FunboxWordsFrequency): string;
  shuffledWord(): string;
  generateShuffledIndexes(): void;
  nextWord(): string;
};

type Section = {
  title: string;
  author: string;
  words: string[];
};

export type FunboxFunctions = {
  getWord?: (wordset?: Wordset, wordIndex?: number) => string;
  punctuateWord?: (word: string) => string;
  withWords?: (words?: string[]) => Promise<Wordset>;
  alterText?: (word: string) => string;
  applyConfig?: () => void;
  applyGlobalCSS?: () => void;
  clearGlobal?: () => void;
  rememberSettings?: () => void;
  toggleScript?: (params: string[]) => void;
  pullSection?: (language?: string) => Promise<Section | false>;
  handleSpace?: () => void;
  handleChar?: (char: string) => string;
  isCharCorrect?: (char: string, originalChar: string) => boolean;
  preventDefaultEvent?: (
    event: JQuery.KeyDownEvent<Document, null, Document, Document>
  ) => Promise<boolean>;
  handleKeydown?: (
    event: JQuery.KeyDownEvent<Document, null, Document, Document>
  ) => Promise<void>;
  getResultContent?: () => string;
  start?: () => void;
  restart?: () => void;
  getWordHtml?: (char: string, letterTag?: boolean) => string;
  getWordsFrequencyMode?: () => FunboxWordsFrequency;
};

export type FunboxForcedConfig = Record<
  string,
  import("@monkeytype/contracts/schemas/configs").ConfigValue[]
>;

export type FunboxMetadata = {
  name: string;
  info: string;
  canGetPb?: boolean;
  alias?: string;
  forcedConfig?: FunboxForcedConfig;
  properties?: FunboxProperty[];
  functions?: FunboxFunctions;
  hasCSS?: boolean;
};

export type PresetConfig = {
  tags: string[];
} & import("@monkeytype/contracts/schemas/configs").Config;

export type SnapshotPreset =
  import("@monkeytype/contracts/schemas/presets").Preset & {
    display: string;
  };

export type RawCustomTheme = {
  name: string;
  colors: import("@monkeytype/contracts/schemas/configs").CustomThemeColors;
};

export type CustomTheme = {
  _id: string;
} & RawCustomTheme;

export type ConfigChanges = {
  tags?: string[];
} & Partial<import("@monkeytype/contracts/schemas/configs").Config>;

export type LeaderboardMemory = {
  time: {
    [key in "15" | "60"]: Record<string, number>;
  };
};

export type Leaderboards = {
  time: {
    [key in 15 | 60]: import("@monkeytype/shared-types").LeaderboardEntry[];
  };
};

export type QuoteRatings = Record<string, Record<number, number>>;

export type UserTag = import("@monkeytype/shared-types").UserTag & {
  active?: boolean;
  display: string;
};

export type Snapshot = Omit<
  User,
  | "timeTyping"
  | "startedTests"
  | "completedTests"
  | "profileDetails"
  | "streak"
  | "resultFilterPresets"
  | "tags"
  | "xp"
  | "testActivity"
> & {
  typingStats: {
    timeTyping: number;
    startedTests: number;
    completedTests: number;
  };
  details?: UserProfileDetails;
  inboxUnreadSize: number;
  streak: number;
  maxStreak: number;
  filterPresets: ResultFilters[];
  isPremium: boolean;
  streakHourOffset?: number;
  config: Config;
  tags: UserTag[];
  presets: SnapshotPreset[];
  results?: Result<Mode>[];
  xp: number;
  testActivity?: ModifiableTestActivityCalendar;
  testActivityByYear?: { [key: string]: TestActivityCalendar };
};

export type Group<
  G extends keyof import("@monkeytype/shared-types").ResultFilters = keyof import("@monkeytype/shared-types").ResultFilters
> = G extends G ? import("@monkeytype/shared-types").ResultFilters[G] : never;

export type Filter<G extends Group = Group> =
  G extends keyof import("@monkeytype/shared-types").ResultFilters
    ? keyof import("@monkeytype/shared-types").ResultFilters[G]
    : never;

export type TimerStats = {
  dateNow: number;
  now: number;
  expected: number;
  nextDelay: number;
};

export type GithubRelease = {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: unknown[];
  tarball_url: string;
  zipball_url: string;
  body: string;
  reactions: {
    url: string;
    total_count: number;
    [reaction: string]: number | string;
  };
};

export type Theme = {
  name: string;
  bgColor: string;
  mainColor: string;
  subColor: string;
  textColor: string;
};

export type Quote = {
  text: string;
  britishText?: string;
  source: string;
  length: number;
  id: number;
  group: number;
  language: string;
  textSplit?: string[];
};

export type QuoteWithTextSplit = Quote & {
  textSplit: string[];
};

export type ThemeColors = {
  bg: string;
  main: string;
  caret: string;
  sub: string;
  subAlt: string;
  text: string;
  error: string;
  errorExtra: string;
  colorfulError: string;
  colorfulErrorExtra: string;
};

export type Layout = {
  keymapShowTopRow: boolean;
  matrixShowRightColumn?: boolean;
  type: "iso" | "ansi" | "ortho" | "matrix";
  keys: Keys;
};

export type Layouts = Record<string, Layout>;
export type Keys = {
  row1: string[];
  row2: string[];
  row3: string[];
  row4: string[];
  row5: string[];
};

export type WpmAndRaw = {
  wpm: number;
  raw: number;
};

export type Challenge = {
  name: string;
  display: string;
  autoRole: boolean;
  type: string;
  parameters: (string | number | boolean)[];
  message: string;
  requirements: Record<string, Record<string, string | number | boolean>>;
};

export type UserBadge = {
  id: number;
  name: string;
  description: string;
  icon?: string;
  background?: string;
  color?: string;
  customStyle?: string;
};

export type MonkeyMail = {
  id: string;
  subject: string;
  body: string;
  timestamp: number;
  read: boolean;
  rewards: AllRewards[];
};

export type Reward<T> = {
  type: string;
  item: T;
};

export type XpReward = {
  type: "xp";
  item: number;
} & Reward<number>;

export type BadgeReward = {
  type: "badge";
  item: import("@monkeytype/shared-types").Badge;
} & Reward<import("@monkeytype/shared-types").Badge>;

export type AllRewards = XpReward | BadgeReward;

export type TypingSpeedUnitSettings = {
  fromWpm: (number: number) => number;
  toWpm: (number: number) => number;
  fullUnitString: string;
  histogramDataBucketSize: number;
  historyStepSize: number;
};

export type TestActivityCalendar = {
  getMonths: () => TestActivityMonth[];
  getDays: () => TestActivityDay[];
  getTotalTests: () => number;
};

export type ModifiableTestActivityCalendar = TestActivityCalendar & {
  increment: (date: Date) => void;
  getFullYearCalendar: () => TestActivityCalendar;
};

export type TestActivityDay = {
  level: string;
  label?: string;
};

export type TestActivityMonth = {
  text: string;
  weeks: number;
};
