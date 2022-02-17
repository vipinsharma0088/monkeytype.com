declare namespace MonkeyTypes {
  type Difficulty = "normal" | "expert" | "master";

  type CustomModes = "custom";

  type Mode = "time" | "words" | "quote" | "zen" | CustomModes;

  type Mode2<M extends Mode> = keyof PersonalBests[M];

  type LanguageGroup = { name: string; languages: string[] };

  type WordsModes = number;

  type TimeModes = number;

  type DefaultWordsModes = 10 | 25 | 50 | 100;

  type DefaultTimeModes = 15 | 30 | 60 | 120;

  type QuoteModes = "short" | "medium" | "long" | "thicc";

  type QuoteLength = -1 | 0 | 1 | 2 | 3;

  type QuoteLengthArray = QuoteLength[];

  type FontSize = 1 | 125 | 15 | 2 | 3 | 4;

  type CaretStyle =
    | "off"
    | "default"
    | "block"
    | "outline"
    | "underline"
    | "carrot"
    | "banana";

  type ConfidenceMode = "off" | "on" | "max";

  type TimerStyle = "bar" | "text" | "mini";

  type RandomTheme = "off" | "on" | "favorite" | "light" | "dark";

  type TimerColor = "black" | "sub" | "text" | "main";

  type TimerOpacity = "0.25" | "0.5" | "0.75" | "1";

  type StopOnError = "off" | "word" | "letter";

  type KeymapMode = "off" | "static" | "react" | "next";

  type KeymapStyle =
    | "staggered"
    | "alice"
    | "matrix"
    | "split"
    | "split_matrix";

  type KeymapLegendStyle = "lowercase" | "uppercase" | "blank";

  type SingleListCommandLine = "manual" | "on";

  /*
    off = off
    1 = click
    2 = beep
    3 = pop
    4 = nk creams
    5 = typewriter
    6 = osu
    7 = hitmarker
  */
  type PlaySoundOnClick = "off" | "1" | "2" | "3" | "4" | "5" | "6" | "7";

  type SoundVolume = "0.1" | "0.5" | "1.0";

  type PaceCaret = "off" | "average" | "pb" | "custom";

  type PageWidth = "100" | "125" | "150" | "200" | "max";

  type ChartStyle = "line" | "scatter";

  type MinimumWordsPerMinute = "off" | "custom";

  type HighlightMode = "off" | "letter" | "word";

  type EnableAds = "off" | "on" | "max";

  type MinimumAccuracy = "off" | "custom";

  type RepeatQuotes = "off" | "typing";

  type OppositeShiftMode = "off" | "on" | "keymap";

  type CustomBackgroundSize = "cover" | "contain" | "max";

  type CustomBackgroundFilter = [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1];

  /*
    off = off
    1 = mellow
    2 = high
    3 = ultra
    4 = over 9000
  */
  type MonkeyPowerLevel = "off" | "1" | "2" | "3" | "4";

  type MinimumBurst = "off" | "fixed" | "flex";

  type FunboxObjectType = "script" | "style";

  type IndicateTypos = "off" | "below" | "replace";

  type CustomLayoutFluid = `${string}#${string}#${string}`;

  type CustomLayoutFluidSpaces =
    | CustomLayoutFluid
    | `${string} ${string} ${string}`;

  interface FunboxObject {
    name: string;
    type: FunboxObjectType;
    info: string;
  }

  interface CustomText {
    text: string[];
    isWordRandom: boolean;
    isTimeRandom: boolean;
    word: number;
    time: number;
    delimiter: string;
  }

  interface Preset {
    _id: string;
    name: string;
    config: Config;
  }

  interface PersonalBest {
    acc: number;
    consistency: number;
    difficulty: Difficulty;
    lazyMode: boolean;
    language: string;
    punctuation: boolean;
    raw: number;
    wpm: number;
    timestamp: number;
  }

  interface PersonalBests {
    time: {
      [key: number]: PersonalBest[];
      custom: PersonalBest[];
    };
    words: {
      [key: number]: PersonalBest[];
      custom: PersonalBest[];
    };
    quote: { [quote: string]: PersonalBest[] };
    custom: { custom: PersonalBest[] };
    zen: {
      zen: PersonalBest[];
    };
  }

  interface Tag {
    _id: string;
    name: string;
    personalBests: PersonalBests;
    active: boolean;
  }

  interface Stats {
    time: number;
    started: number;
    completed: number;
  }

  interface ChartData {
    wpm: number[];
    raw: number[];
    err: number[];
  }

  interface KeyStats {
    average: number;
    sd: number;
  }

  interface Result<M extends Mode> {
    _id: string;
    wpm: number;
    rawWpm: number;
    charStats: number[];
    correctChars?: number; // --------------
    incorrectChars?: number; // legacy results
    acc: number;
    mode: M;
    mode2: Mode2<M>;
    quoteLength: number;
    timestamp: number;
    restartCount: number;
    incompleteTestSeconds: number;
    testDuration: number;
    afkDuration: number;
    tags: string[];
    consistency: number;
    keyConsistency: number;
    chartData: ChartData | "toolong";
    uid: string;
    keySpacingStats: KeyStats;
    keyDurationStats: KeyStats;
    isPb?: boolean;
    bailedOut?: boolean;
    blindMode?: boolean;
    lazyMode?: boolean;
    difficulty: Difficulty;
    funbox?: string;
    language: string;
    numbers?: boolean;
    punctuation?: boolean;
  }

  interface Config {
    theme: string;
    customTheme: boolean;
    customThemeColors: string[];
    favThemes: string[];
    showKeyTips: boolean;
    showLiveWpm: boolean;
    showTimerProgress: boolean;
    smoothCaret: boolean;
    quickTab: boolean;
    punctuation: boolean;
    numbers: boolean;
    words: WordsModes;
    time: TimeModes;
    mode: Mode;
    quoteLength: QuoteLengthArray;
    language: string;
    fontSize: FontSize;
    freedomMode: boolean;
    resultFilters?: ResultFilters | null;
    difficulty: Difficulty;
    blindMode: boolean;
    quickEnd: boolean;
    caretStyle: CaretStyle;
    paceCaretStyle: CaretStyle;
    flipTestColors: boolean;
    layout: string;
    funbox: string;
    confidenceMode: ConfidenceMode;
    indicateTypos: IndicateTypos;
    timerStyle: TimerStyle;
    colorfulMode: boolean;
    randomTheme: RandomTheme;
    timerColor: TimerColor;
    timerOpacity: TimerOpacity;
    stopOnError: StopOnError;
    showAllLines: boolean;
    keymapMode: KeymapMode;
    keymapStyle: KeymapStyle;
    keymapLegendStyle: KeymapLegendStyle;
    keymapLayout: string;
    fontFamily: string;
    smoothLineScroll: boolean;
    alwaysShowDecimalPlaces: boolean;
    alwaysShowWordsHistory: boolean;
    singleListCommandLine: SingleListCommandLine;
    capsLockWarning: boolean;
    playSoundOnError: boolean;
    playSoundOnClick: PlaySoundOnClick;
    soundVolume: SoundVolume;
    startGraphsAtZero: boolean;
    swapEscAndTab: boolean;
    showOutOfFocusWarning: boolean;
    paceCaret: PaceCaret;
    paceCaretCustomSpeed: number;
    repeatedPace: boolean;
    pageWidth: PageWidth;
    chartAccuracy: boolean;
    chartStyle: ChartStyle;
    minWpm: MinimumWordsPerMinute;
    minWpmCustomSpeed: number;
    highlightMode: HighlightMode;
    alwaysShowCPM: boolean;
    enableAds: EnableAds;
    hideExtraLetters: boolean;
    strictSpace: boolean;
    minAcc: MinimumAccuracy;
    minAccCustom: number;
    showLiveAcc: boolean;
    showLiveBurst: boolean;
    monkey: boolean;
    repeatQuotes: RepeatQuotes;
    oppositeShiftMode: OppositeShiftMode;
    customBackground: string;
    customBackgroundSize: CustomBackgroundSize;
    customBackgroundFilter: CustomBackgroundFilter;
    customLayoutfluid: CustomLayoutFluid;
    monkeyPowerLevel: MonkeyPowerLevel;
    minBurst: MinimumBurst;
    minBurstCustomSpeed: number;
    burstHeatmap: boolean;
    britishEnglish: boolean;
    lazyMode: boolean;
  }

  interface DefaultConfig extends Config {
    wordCount: WordsModes;
  }

  interface LeaderboardMemory {
    time: {
      [key in 15 | 60]: {
        [language: string]: number;
      };
    };
  }

  interface Leaderboards {
    time: {
      [key in 15 | 60]: LeaderboardEntry[];
    };
  }

  interface LeaderboardEntry {
    _id: string;
    difficulty: string;
    timestamp: number;
    language: string;
    wpm: number;
    consistency: number | "-";
    punctuation: boolean;
    acc: number;
    raw: number;
    uid?: string;
    name: string;
    discordId?: string;
    rank: number;
    count?: number;
    hidden?: boolean;
  }

  interface QuoteRatings {
    [language: string]: {
      [id: string | number]: any; // TODO find this
    };
  }

  interface Snapshot {
    banned?: boolean;
    emailVerified?: boolean;
    quoteRatings?: QuoteRatings;
    results?: Result<Mode>[];
    verified?: boolean;
    personalBests?: PersonalBests;
    name?: string;
    presets?: Preset[];
    tags?: Tag[];
    favouriteThemes?: string[];
    lbMemory?: LeaderboardMemory;
    globalStats?: Stats;
    quoteMod?: boolean;
    discordId?: string;
    config?: Config;
  }

  interface ResultFilters {
    difficulty: {
      normal?: boolean;
      expert?: boolean;
      master?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["difficulty"])[];
    };
    mode: {
      words?: boolean;
      time?: boolean;
      quote?: boolean;
      zen?: boolean;
      custom?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["mode"])[];
    };
    words: {
      10?: boolean;
      25?: boolean;
      50?: boolean;
      100?: boolean;
      200?: boolean;
      custom?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["words"])[];
    };
    time: {
      15?: boolean;
      30?: boolean;
      60?: boolean;
      120?: boolean;
      custom?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["time"])[];
    };
    quoteLength: {
      short?: boolean;
      medium?: boolean;
      long?: boolean;
      thicc?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["quoteLength"])[];
    };
    punctuation: {
      on?: boolean;
      off?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["punctuation"])[];
    };
    numbers: {
      on?: boolean;
      off?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["numbers"])[];
    };
    date: {
      last_day?: boolean;
      last_week?: boolean;
      last_month?: boolean;
      last_3months?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["date"])[];
      [date: string]: boolean | any[] | undefined;
    };
    tags: {
      none?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["tags"])[];
      [tag: string]: boolean | any[] | undefined;
    };
    language: {
      all?: boolean;
      array?: (keyof ResultFilters["language"])[];
      [language: string]: boolean | any[] | undefined;
    };
    funbox: {
      none?: boolean;
      all?: boolean;
      array?: (keyof ResultFilters["funbox"])[];
      [funbox: string]: boolean | any[] | undefined;
    };
  }

  type Group = keyof ResultFilters;

  type Filter<G extends Group> = keyof ResultFilters[G];

  interface TimerStats {
    dateNow: number;
    now: number;
    expected: number;
    nextDelay: number;
  }

  interface GithubRelease {
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
    assets: any[];
    tarball_url: string;
    zipball_url: string;
    body: string;
    reactions: {
      url: string;
      total_count: number;
      [reaction: string]: number | string;
    };
  }

  // eslint-disable-next-line no-unused-vars
  type ExecFunction = (input?: any) => any;

  interface Command {
    id: string;
    display: string;
    subgroup?: CommandsGroup | boolean;
    found?: boolean;
    icon?: string;
    noIcon?: boolean;
    sticky?: boolean;
    alias?: string;
    input?: boolean;
    visible?: boolean;
    defaultValue?: string;
    configValue?: string | number | boolean | number[];
    configValueMode?: string;
    exec?: ExecFunction;
    hover?: ExecFunction;
    available?: () => void;
    beforeSubgroup?: () => void;
  }

  interface CommandsGroup {
    title: string;
    configKey?: keyof Config;
    list: Command[];
  }

  interface Quote {
    text: string;
    source: string;
    length: number;
    id: number | string;
    group?: number;
    language: string;
  }

  interface PSA {
    sticky?: boolean;
    message: string;
    _id: string;
    level?: number;
  }

  interface ThemeColors {
    bg: string;
    main: string;
    caret: string;
    sub: string;
    text: string;
    error: string;
    errorExtra: string;
    colorfulError: string;
    colorfulErrorExtra: string;
  }

  //  type Page = "Loading" | "Account" | "Settings" | "About" | "Test";

  //  type ActivePage = `page${Page}` | undefined;
}
