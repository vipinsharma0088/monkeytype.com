const Funboxes: MonkeyTypes.FunboxObject[] = [
  {
    name: "nausea",
    info: "I think I'm gonna be sick.",
    applyCSS: true,
  },
  {
    name: "round_round_baby",
    info: "...right round, like a record baby. Right, round round round.",
    applyCSS: true,
  },
  {
    name: "simon_says",
    info: "Type what simon says.",
    changesWordsVisibility: true,
    applyCSS: true,
    applyConfig: true,
    rememberSettings: true,
  },
  {
    name: "mirror",
    info: "Everything is mirrored!",
    applyCSS: true,
  },
  {
    name: "tts",
    info: "Listen closely.",
    blockWordHighlight: true,
    changesWordsVisibility: true,
    speaks: true,
    applyCSS: true,
    applyConfig: true,
    rememberSettings: true,
    toggleScript: true,
  },
  {
    name: "choo_choo",
    info: "All the letters are spinning!",
    noLigatures: true,
    conflictsWithSymmetricChars: true,
    applyCSS: true,
  },
  {
    name: "arrows",
    info: "Eurobeat Intensifies...",
    blockWordHighlight: true,
    ignoresLanguage: true,
    nospace: true,
    noPunctuation: true,
    noNumbers: true,
    noLetters: true,
    symmetricChars: true,
    getWord: true,
    applyConfig: true,
    rememberSettings: true,
    handleChar: true,
    isCharCorrect: true,
    preventDefaultEvent: true,
    getWordHtml: true,
  },
  {
    name: "rAnDoMcAsE",
    info: "I kInDa LiKe HoW iNeFfIcIeNt QwErTy Is.",
    changesCapitalisation: true,
    alterText: true,
  },
  {
    name: "capitals",
    info: "Capitalize Every Word.",
    changesCapitalisation: true,
    alterText: true,
  },
  {
    name: "layoutfluid",
    info: "Switch between layouts specified below proportionately to the length of the test.",
    changesLayout: true,
    applyConfig: true,
    rememberSettings: true,
    handleSpace: true,
    getResultContent: true,
    restart: true,
  },
  {
    name: "earthquake",
    info: "Everybody get down! The words are shaking!",
    noLigatures: true,
    applyCSS: true,
  },
  {
    name: "space_balls",
    info: "In a galaxy far far away.",
    applyCSS: true,
  },
  {
    name: "gibberish",
    info: "Anvbuefl dizzs eoos alsb?",
    ignoresLanguage: true,
    unspeakable: true,
    getWord: true,
  },
  {
    name: "58008",
    alias: "numbers",
    info: "A special mode for accountants.",
    noNumbers: true,
    ignoresLanguage: true,
    noLetters: true,
    ignoresLayout: true,
    getWord: true,
    punctuateWord: true,
    rememberSettings: true,
    handleChar: true,
  },
  {
    name: "ascii",
    info: "Where was the ampersand again?. Only ASCII characters.",
    ignoresLanguage: true,
    noPunctuation: true,
    noNumbers: true,
    noLetters: true,
    unspeakable: true,
    getWord: true,
  },
  {
    name: "specials",
    info: "!@#$%^&*. Only special characters.",
    ignoresLanguage: true,
    noPunctuation: true,
    noNumbers: true,
    noLetters: true,
    unspeakable: true,
    getWord: true,
  },
  {
    name: "plus_one",
    info: "React quickly! Only one future word is visible.",
    toPushCount: 2,
    changesWordsVisibility: true,
  },
  {
    name: "plus_two",
    info: "Only two future words are visible.",
    toPushCount: 3,
    changesWordsVisibility: true,
  },
  {
    name: "read_ahead_easy",
    info: "Only the current word is invisible.",
    blockWordHighlight: true,
    changesWordsVisibility: true,
    applyCSS: true,
    applyConfig: true,
    rememberSettings: true,
  },
  {
    name: "read_ahead",
    info: "Current and the next word are invisible!",
    blockWordHighlight: true,
    changesWordsVisibility: true,
    applyCSS: true,
    applyConfig: true,
    rememberSettings: true,
  },
  {
    name: "read_ahead_hard",
    info: "Current and the next two words are invisible!",
    blockWordHighlight: true,
    changesWordsVisibility: true,
    applyCSS: true,
    applyConfig: true,
    rememberSettings: true,
  },
  {
    name: "memory",
    info: "Test your memory. Remember the words and type them blind.",
    mode: "words",
    changesWordsVisibility: true,
    applyConfig: true,
    rememberSettings: true,
    start: true,
    restart: true,
  },
  {
    name: "nospace",
    info: "Whoneedsspacesanyway?",
    blockWordHighlight: true,
    nospace: true,
    applyConfig: true,
    rememberSettings: true,
  },
  {
    name: "poetry",
    info: "Practice typing some beautiful prose.",
    noPunctuation: true,
    noNumbers: true,
    pullSection: true,
  },
  {
    name: "wikipedia",
    info: "Practice typing wikipedia sections.",
    noPunctuation: true,
    noNumbers: true,
    pullSection: true,
  },
  {
    name: "weakspot",
    info: "Focus on slow and mistyped letters.",
    getWord: true,
  },
  {
    name: "pseudolang",
    info: "Nonsense words that look like the current language.",
    unspeakable: true,
    withWords: true,
  },
];

export default Funboxes;
