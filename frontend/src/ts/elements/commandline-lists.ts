import * as DB from "../db";
import * as Misc from "../utils/misc";
import * as Notifications from "./notifications";
import * as Sound from "../controllers/sound-controller";
import * as ThemeController from "../controllers/theme-controller";
import Config, * as UpdateConfig from "../config";
import * as PractiseWords from "../test/practise-words";
import * as TestLogic from "../test/test-logic";
import * as ChallengeController from "../controllers/challenge-controller";
import * as ModesNotice from "./modes-notice";
import { Auth } from "../firebase";
import { navigate } from "../controllers/route-controller";

const commandsRepeatQuotes: MonkeyTypes.CommandsGroup = {
  title: "Repeat quotes...",
  configKey: "repeatQuotes",
  list: [
    {
      id: "setRepeatQuotesOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setRepeatQuotes("off");
      },
    },
    {
      id: "setRepeatQuotesTyping",
      display: "typing",
      configValue: "typing",
      exec: (): void => {
        UpdateConfig.setRepeatQuotes("typing");
      },
    },
  ],
};

const commandsLiveWpm: MonkeyTypes.CommandsGroup = {
  title: "Live WPM...",
  configKey: "showLiveWpm",
  list: [
    {
      id: "setLiveWpmOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setShowLiveWpm(false);
      },
    },
    {
      id: "setLiveWpmOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setShowLiveWpm(true);
      },
    },
  ],
};

const commandsShowAverage: MonkeyTypes.CommandsGroup = {
  title: "Show average...",
  configKey: "showAverage",
  list: [
    {
      id: "setShowAverageOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setShowAverage("off");
      },
    },
    {
      id: "setShowAverageSpeed",
      display: "wpm",
      configValue: "wpm",
      exec: (): void => {
        UpdateConfig.setShowAverage("wpm");
      },
    },
    {
      id: "setShowAverageAcc",
      display: "accuracy",
      configValue: "acc",
      exec: (): void => {
        UpdateConfig.setShowAverage("acc");
      },
    },
    {
      id: "setShowAverageBoth",
      display: "both",
      configValue: "both",
      exec: (): void => {
        UpdateConfig.setShowAverage("both");
      },
    },
  ],
};

const commandsLiveAcc: MonkeyTypes.CommandsGroup = {
  title: "Live accuracy...",
  configKey: "showLiveAcc",
  list: [
    {
      id: "setLiveAccOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setShowLiveAcc(false);
      },
    },
    {
      id: "setLiveAccOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setShowLiveAcc(true);
      },
    },
  ],
};

const commandsLiveBurst: MonkeyTypes.CommandsGroup = {
  title: "Live burst...",
  configKey: "showLiveBurst",
  list: [
    {
      id: "setLiveBurstOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setShowLiveBurst(false);
      },
    },
    {
      id: "setLiveBurstOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setShowLiveBurst(true);
      },
    },
  ],
};

const commandsShowTimer: MonkeyTypes.CommandsGroup = {
  title: "Timer/progress...",
  configKey: "showTimerProgress",
  list: [
    {
      id: "setTimerProgressOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setShowTimerProgress(false);
      },
    },
    {
      id: "setTimerProgressOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setShowTimerProgress(true);
      },
    },
  ],
};

const commandsKeyTips: MonkeyTypes.CommandsGroup = {
  title: "Key tips...",
  configKey: "showKeyTips",
  list: [
    {
      id: "setKeyTipsOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setKeyTips(false);
      },
    },
    {
      id: "setKeyTipsOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setKeyTips(true);
      },
    },
  ],
};

const commandsFreedomMode: MonkeyTypes.CommandsGroup = {
  title: "Freedom mode...",
  configKey: "freedomMode",
  list: [
    {
      id: "setfreedomModeOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setFreedomMode(false);
      },
    },
    {
      id: "setfreedomModeOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setFreedomMode(true);
      },
    },
  ],
};

const commandsStrictSpace: MonkeyTypes.CommandsGroup = {
  title: "Strict space...",
  configKey: "strictSpace",
  list: [
    {
      id: "setStrictSpaceOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setStrictSpace(false);
      },
    },
    {
      id: "setStrictSpaceOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setStrictSpace(true);
      },
    },
  ],
};

const commandsBlindMode: MonkeyTypes.CommandsGroup = {
  title: "Blind mode...",
  configKey: "blindMode",
  list: [
    {
      id: "setBlindModeOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setBlindMode(false);
      },
    },
    {
      id: "setBlindModeOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setBlindMode(true);
      },
    },
  ],
};

const commandsShowWordsHistory: MonkeyTypes.CommandsGroup = {
  title: "Always show words history...",
  configKey: "alwaysShowWordsHistory",
  list: [
    {
      id: "setAlwaysShowWordsHistoryOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setAlwaysShowWordsHistory(false);
      },
    },
    {
      id: "setAlwaysShowWordsHistoryOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setAlwaysShowWordsHistory(true);
      },
    },
  ],
};

const commandsIndicateTypos: MonkeyTypes.CommandsGroup = {
  title: "Indicate typos...",
  configKey: "indicateTypos",
  list: [
    {
      id: "setIndicateTyposOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setIndicateTypos("off");
      },
    },
    {
      id: "setIndicateTyposBelow",
      display: "below",
      configValue: "below",
      exec: (): void => {
        UpdateConfig.setIndicateTypos("below");
      },
    },
    {
      id: "setIndicateTyposReplace",
      display: "replace",
      configValue: "replace",
      exec: (): void => {
        UpdateConfig.setIndicateTypos("replace");
      },
    },
  ],
};

const commandsHideExtraLetters: MonkeyTypes.CommandsGroup = {
  title: "Hide extra letters...",
  configKey: "hideExtraLetters",
  list: [
    {
      id: "setHideExtraLettersOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setHideExtraLetters(false);
      },
    },
    {
      id: "setHideExtraLettersOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setHideExtraLetters(true);
      },
    },
  ],
};

const commandsQuickEnd: MonkeyTypes.CommandsGroup = {
  title: "Quick end...",
  configKey: "quickEnd",
  list: [
    {
      id: "setQuickEndOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setQuickEnd(false);
      },
    },
    {
      id: "setQuickEndOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setQuickEnd(true);
      },
    },
  ],
};

const commandsOppositeShiftMode: MonkeyTypes.CommandsGroup = {
  title: "Change opposite shift mode...",
  configKey: "oppositeShiftMode",
  list: [
    {
      id: "setOppositeShiftModeOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setOppositeShiftMode("off");
        ModesNotice.update();
      },
    },
    {
      id: "setOppositeShiftModeOn",
      display: "on",
      configValue: "on",
      exec: (): void => {
        UpdateConfig.setOppositeShiftMode("on");
        ModesNotice.update();
      },
    },
    {
      id: "setOppositeShiftModeKeymap",
      display: "keymap",
      configValue: "keymap",
      exec: (): void => {
        UpdateConfig.setOppositeShiftMode("keymap");
        ModesNotice.update();
      },
    },
  ],
};

const commandsSoundOnError: MonkeyTypes.CommandsGroup = {
  title: "Sound on error...",
  configKey: "playSoundOnError",
  list: [
    {
      id: "setPlaySoundOnErrorOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setPlaySoundOnError(false);
      },
    },
    {
      id: "setPlaySoundOnErrorOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setPlaySoundOnError(true);
        Sound.playError();
      },
    },
  ],
};

const commandsSoundVolume: MonkeyTypes.CommandsGroup = {
  title: "Sound volume...",
  configKey: "soundVolume",
  list: [
    {
      id: "setSoundVolume0.1",
      display: "quiet",
      configValue: "0.1",
      exec: (): void => {
        UpdateConfig.setSoundVolume("0.1");
        Sound.playClick();
      },
    },
    {
      id: "setSoundVolume0.5",
      display: "medium",
      configValue: "0.5",
      exec: (): void => {
        UpdateConfig.setSoundVolume("0.5");
        Sound.playClick();
      },
    },
    {
      id: "setSoundVolume1.0",
      display: "loud",
      configValue: "1.0",
      exec: (): void => {
        UpdateConfig.setSoundVolume("1.0");
        Sound.playClick();
      },
    },
  ],
};

const commandsFlipTestColors: MonkeyTypes.CommandsGroup = {
  title: "Flip test colors...",
  configKey: "flipTestColors",
  list: [
    {
      id: "setFlipTestColorsOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setFlipTestColors(false);
      },
    },
    {
      id: "setFlipTestColorsOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setFlipTestColors(true);
      },
    },
  ],
};

const commandsSmoothLineScroll: MonkeyTypes.CommandsGroup = {
  title: "Smooth line scroll...",
  configKey: "smoothLineScroll",
  list: [
    {
      id: "setSmoothLineScrollOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setSmoothLineScroll(false);
      },
    },
    {
      id: "setSmoothLineScrollOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setSmoothLineScroll(true);
      },
    },
  ],
};

const commandsAlwaysShowDecimal: MonkeyTypes.CommandsGroup = {
  title: "Always show decimal places...",
  configKey: "alwaysShowDecimalPlaces",
  list: [
    {
      id: "setAlwaysShowDecimalPlacesOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setAlwaysShowDecimalPlaces(false);
      },
    },
    {
      id: "setAlwaysShowDecimalPlacesOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setAlwaysShowDecimalPlaces(true);
      },
    },
  ],
};

const commandsAlwaysShowCPM: MonkeyTypes.CommandsGroup = {
  title: "Always show CPM...",
  configKey: "alwaysShowCPM",
  list: [
    {
      id: "setAlwaysShowCPMOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setAlwaysShowCPM(false);
      },
    },
    {
      id: "setAlwaysShowCPMOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setAlwaysShowCPM(true);
      },
    },
  ],
};

const commandsStartGraphsAtZero: MonkeyTypes.CommandsGroup = {
  title: "Start graphs at zero...",
  configKey: "startGraphsAtZero",
  list: [
    {
      id: "setStartGraphsAtZeroOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setStartGraphsAtZero(false);
      },
    },
    {
      id: "setStartGraphsAtZeroOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setStartGraphsAtZero(true);
      },
    },
  ],
};

const commandsLazyMode: MonkeyTypes.CommandsGroup = {
  title: "Lazy mode...",
  configKey: "lazyMode",
  list: [
    {
      id: "setLazyModeOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setLazyMode(false);
        TestLogic.restart();
      },
    },
    {
      id: "setLazyModeOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setLazyMode(true);
        TestLogic.restart();
      },
    },
  ],
};

const commandsShowAllLines: MonkeyTypes.CommandsGroup = {
  title: "Show all lines...",
  configKey: "showAllLines",
  list: [
    {
      id: "setShowAllLinesOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setShowAllLines(false);
      },
    },
    {
      id: "setShowAllLinesOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setShowAllLines(true);
      },
    },
  ],
};

const commandsColorfulMode: MonkeyTypes.CommandsGroup = {
  title: "Colorful mode...",
  configKey: "colorfulMode",
  list: [
    {
      id: "setColorfulModeOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setColorfulMode(false);
      },
    },
    {
      id: "setColorfulModeOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setColorfulMode(true);
      },
    },
  ],
};

const commandsOutOfFocusWarning: MonkeyTypes.CommandsGroup = {
  title: "Colorful mode...",
  configKey: "showOutOfFocusWarning",
  list: [
    {
      id: "setShowOutOfFocusWarningOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setShowOutOfFocusWarning(false);
      },
    },
    {
      id: "setShowOutOfFocusWarningOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setShowOutOfFocusWarning(true);
      },
    },
  ],
};

const commandsKeymapMode: MonkeyTypes.CommandsGroup = {
  title: "Keymap mode...",
  configKey: "keymapMode",
  list: [
    {
      id: "setKeymapModeOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setKeymapMode("off");
      },
    },
    {
      id: "setKeymapModeStatic",
      display: "static",
      configValue: "static",
      exec: (): void => {
        UpdateConfig.setKeymapMode("static");
      },
    },
    {
      id: "setKeymapModeNext",
      display: "next",
      configValue: "next",
      exec: (): void => {
        UpdateConfig.setKeymapMode("next");
      },
    },
    {
      id: "setKeymapModeReact",
      display: "react",
      alias: "flash",
      configValue: "react",
      exec: (): void => {
        UpdateConfig.setKeymapMode("react");
      },
    },
  ],
};

const commandsSoundOnClick: MonkeyTypes.CommandsGroup = {
  title: "Sound on click...",
  configKey: "playSoundOnClick",
  list: [
    {
      id: "setSoundOnClickOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("off");
      },
    },
    {
      id: "setSoundOnClick1",
      display: "click",
      configValue: "1",
      hover: (): void => {
        Sound.previewClick("1");
      },
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("1");
        Sound.playClick();
      },
    },
    {
      id: "setSoundOnClick2",
      display: "beep",
      configValue: "2",
      hover: (): void => {
        Sound.previewClick("2");
      },
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("2");
        Sound.playClick();
      },
    },
    {
      id: "setSoundOnClick3",
      display: "pop",
      configValue: "3",
      hover: (): void => {
        Sound.previewClick("3");
      },
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("3");
        Sound.playClick();
      },
    },
    {
      id: "setSoundOnClick4",
      display: "nk creams",
      configValue: "4",
      hover: (): void => {
        Sound.previewClick("4");
      },
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("4");
        Sound.playClick();
      },
    },
    {
      id: "setSoundOnClick5",
      display: "typewriter",
      configValue: "5",
      hover: (): void => {
        Sound.previewClick("5");
      },
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("5");
        Sound.playClick();
      },
    },
    {
      id: "setSoundOnClick6",
      display: "osu",
      configValue: "6",
      hover: (): void => {
        Sound.previewClick("6");
      },
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("6");
        Sound.playClick();
      },
    },
    {
      id: "setSoundOnClick7",
      display: "hitmarker",
      configValue: "7",
      hover: (): void => {
        Sound.previewClick("7");
      },
      exec: (): void => {
        UpdateConfig.setPlaySoundOnClick("7");
        Sound.playClick();
      },
    },
  ],
};

const commandsRandomTheme: MonkeyTypes.CommandsGroup = {
  title: "Random theme...",
  configKey: "randomTheme",
  list: [
    {
      id: "setRandomOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setRandomTheme("off");
      },
    },
    {
      id: "setRandomOn",
      display: "on",
      configValue: "on",
      exec: (): void => {
        UpdateConfig.setRandomTheme("on");
      },
    },
    {
      id: "setRandomFav",
      display: "fav",
      configValue: "fav",
      exec: (): void => {
        UpdateConfig.setRandomTheme("fav");
      },
    },
    {
      id: "setRandomLight",
      display: "light",
      configValue: "light",
      exec: (): void => {
        UpdateConfig.setRandomTheme("light");
      },
    },
    {
      id: "setRandomDark",
      display: "dark",
      configValue: "dark",
      exec: (): void => {
        UpdateConfig.setRandomTheme("dark");
      },
    },
    {
      id: "setRandomCustom",
      display: "custom",
      configValue: "custom",
      exec: (): void => {
        if (Auth.currentUser === null) {
          Notifications.add(
            "Multiple custom themes are available to logged in users only",
            0
          );
          return;
        }
        UpdateConfig.setRandomTheme("custom");
      },
    },
  ],
};

const commandsDifficulty: MonkeyTypes.CommandsGroup = {
  title: "Difficulty...",
  configKey: "difficulty",
  list: [
    {
      id: "setDifficultyNormal",
      display: "normal",
      configValue: "normal",
      exec: (): void => {
        UpdateConfig.setDifficulty("normal");
      },
    },
    {
      id: "setDifficultyExpert",
      display: "expert",
      configValue: "expert",
      exec: (): void => {
        UpdateConfig.setDifficulty("expert");
      },
    },
    {
      id: "setDifficultyMaster",
      display: "master",
      configValue: "master",
      exec: (): void => {
        UpdateConfig.setDifficulty("master");
      },
    },
  ],
};

export const commandsEnableAds: MonkeyTypes.CommandsGroup = {
  title: "Set enable ads...",
  configKey: "ads",
  list: [
    {
      id: "setEnableAdsOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setAds("off");
      },
    },
    {
      id: "setEnableAdsOn",
      display: "result",
      configValue: "result",
      exec: (): void => {
        UpdateConfig.setAds("result");
      },
    },
    {
      id: "setEnableOn",
      display: "on",
      configValue: "on",
      exec: (): void => {
        UpdateConfig.setAds("on");
      },
    },
    {
      id: "setEnableSellout",
      display: "sellout",
      configValue: "sellout",
      exec: (): void => {
        UpdateConfig.setAds("sellout");
      },
    },
  ],
};

export const customThemeCommands: MonkeyTypes.CommandsGroup = {
  title: "Custom theme",
  configKey: "customTheme",
  list: [
    {
      id: "setCustomThemeOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setCustomTheme(false);
      },
    },
    {
      id: "setCustomThemeOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setCustomTheme(true);
      },
    },
  ],
};

export const customThemeListCommands: MonkeyTypes.CommandsGroup = {
  title: "Custom themes list...",
  // configKey: "customThemeId",
  list: [],
};

export function updateCustomThemeListCommands(): void {
  if (Auth.currentUser === null) {
    return;
  }

  customThemeListCommands.list = [];

  const snapshot = DB.getSnapshot();

  if (!snapshot) return;

  if (DB.getSnapshot().customThemes.length === 0) {
    return;
  }
  DB.getSnapshot().customThemes.forEach((theme) => {
    customThemeListCommands.list.push({
      id: "setCustomThemeId" + theme._id,
      display: theme.name,
      configValue: theme._id,
      hover: (): void => {
        ThemeController.preview(theme._id, true);
      },
      exec: (): void => {
        // UpdateConfig.setCustomThemeId(theme._id);
        UpdateConfig.setCustomTheme(true);
        ThemeController.set(theme._id, true);
      },
    });
  });
  return;
}

const commandsCaretStyle: MonkeyTypes.CommandsGroup = {
  title: "Change caret style...",
  configKey: "caretStyle",
  list: [
    {
      id: "setCaretStyleOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setCaretStyle("off");
      },
    },
    {
      id: "setCaretStyleDefault",
      display: "line",
      configValue: "default",
      exec: (): void => {
        UpdateConfig.setCaretStyle("default");
      },
    },
    {
      id: "setCaretStyleBlock",
      display: "block",
      configValue: "block",
      exec: (): void => {
        UpdateConfig.setCaretStyle("block");
      },
    },
    {
      id: "setCaretStyleOutline",
      display: "outline-block",
      configValue: "outline",
      exec: (): void => {
        UpdateConfig.setCaretStyle("outline");
      },
    },
    {
      id: "setCaretStyleUnderline",
      display: "underline",
      configValue: "underline",
      exec: (): void => {
        UpdateConfig.setCaretStyle("underline");
      },
    },
    {
      id: "setCaretStyleCarrot",
      display: "carrot",
      configValue: "carrot",
      visible: false,
      exec: (): void => {
        UpdateConfig.setCaretStyle("carrot");
      },
    },
    {
      id: "setCaretStyleBanana",
      display: "banana",
      configValue: "banana",
      visible: false,
      exec: (): void => {
        UpdateConfig.setCaretStyle("banana");
      },
    },
  ],
};

const commandsPaceCaretStyle: MonkeyTypes.CommandsGroup = {
  title: "Change pace caret style...",
  configKey: "paceCaretStyle",
  list: [
    {
      id: "setPaceCaretStyleDefault",
      display: "line",
      configValue: "default",
      exec: (): void => {
        UpdateConfig.setPaceCaretStyle("default");
      },
    },
    {
      id: "setPaceCaretStyleBlock",
      display: "block",
      configValue: "block",
      exec: (): void => {
        UpdateConfig.setPaceCaretStyle("block");
      },
    },
    {
      id: "setPaceCaretStyleOutline",
      display: "outline-block",
      configValue: "outline",
      exec: (): void => {
        UpdateConfig.setPaceCaretStyle("outline");
      },
    },
    {
      id: "setPaceCaretStyleUnderline",
      display: "underline",
      configValue: "underline",
      exec: (): void => {
        UpdateConfig.setPaceCaretStyle("underline");
      },
    },
    {
      id: "setPaceCaretStyleCarrot",
      display: "carrot",
      configValue: "carrot",
      visible: false,
      exec: (): void => {
        UpdateConfig.setPaceCaretStyle("carrot");
      },
    },
    {
      id: "setPaceCaretStyleBanana",
      display: "banana",
      configValue: "banana",
      visible: false,
      exec: (): void => {
        UpdateConfig.setPaceCaretStyle("banana");
      },
    },
  ],
};

const commandsRepeatedPace: MonkeyTypes.CommandsGroup = {
  title: "Repeated pace...",
  configKey: "repeatedPace",
  list: [
    {
      id: "setRepeatedPaceOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setRepeatedPace(false);
      },
    },
    {
      id: "setRepeatedPaceOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setRepeatedPace(true);
      },
    },
  ],
};

const commandsPaceCaret: MonkeyTypes.CommandsGroup = {
  title: "Pace caret mode...",
  configKey: "paceCaret",
  list: [
    {
      id: "setPaceCaretOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setPaceCaret("off");
        TestLogic.restart();
      },
    },
    {
      id: "setPaceCaretPb",
      display: "pb",
      configValue: "pb",
      exec: (): void => {
        UpdateConfig.setPaceCaret("pb");
        TestLogic.restart();
      },
    },
    {
      id: "setPaceCaretLast",
      display: "last",
      configValue: "last",
      exec: (): void => {
        UpdateConfig.setPaceCaret("last");
        TestLogic.restart();
      },
    },
    {
      id: "setPaceCaretAverage",
      display: "average",
      configValue: "average",
      exec: (): void => {
        UpdateConfig.setPaceCaret("average");
        TestLogic.restart();
      },
    },
    {
      id: "setPaceCaretCustom",
      display: "custom...",
      configValue: "custom",
      input: true,
      exec: (input): void => {
        if (!input) return;
        UpdateConfig.setPaceCaretCustomSpeed(parseInt(input));
        UpdateConfig.setPaceCaret("custom");
        TestLogic.restart();
      },
    },
  ],
};

const commandsMinWpm: MonkeyTypes.CommandsGroup = {
  title: "Change min wpm mode...",
  configKey: "minWpm",
  list: [
    {
      id: "setMinWpmOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setMinWpm("off");
      },
    },
    {
      id: "setMinWpmCustom",
      display: "custom...",
      configValue: "custom",
      input: true,
      exec: (input): void => {
        if (!input) return;
        UpdateConfig.setMinWpmCustomSpeed(parseInt(input));
        UpdateConfig.setMinWpm("custom");
      },
    },
  ],
};

const commandsMinAcc: MonkeyTypes.CommandsGroup = {
  title: "Change min accuracy mode...",
  configKey: "minAcc",
  list: [
    {
      id: "setMinAccOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setMinAcc("off");
      },
    },
    {
      id: "setMinAccCustom",
      display: "custom...",
      configValue: "custom",
      input: true,
      exec: (input): void => {
        if (!input) return;
        UpdateConfig.setMinAccCustom(parseInt(input));
        UpdateConfig.setMinAcc("custom");
      },
    },
  ],
};

const commandsMinBurst: MonkeyTypes.CommandsGroup = {
  title: "Change min burst mode...",
  configKey: "minBurst",
  list: [
    {
      id: "setMinBurstOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setMinBurst("off");
      },
    },
    {
      id: "setMinBurstFixed",
      display: "fixed...",
      configValue: "fixed",
      input: true,
      exec: (input): void => {
        if (!input) return;
        UpdateConfig.setMinBurst("fixed");
        UpdateConfig.setMinBurstCustomSpeed(parseInt(input));
      },
    },
    {
      id: "setMinBurstFlex",
      display: "flex...",
      configValue: "flex",
      input: true,
      exec: (input): void => {
        if (!input) return;
        UpdateConfig.setMinBurst("flex");
        UpdateConfig.setMinBurstCustomSpeed(parseInt(input));
      },
    },
  ],
};

const commandsKeymapStyle: MonkeyTypes.CommandsGroup = {
  title: "Keymap style...",
  configKey: "keymapStyle",
  list: [
    {
      id: "setKeymapStyleStaggered",
      display: "staggered",
      configValue: "staggered",
      exec: (): void => {
        UpdateConfig.setKeymapStyle("staggered");
      },
    },
    {
      id: "setKeymapStyleAlice",
      display: "alice",
      configValue: "alice",
      exec: (): void => {
        UpdateConfig.setKeymapStyle("alice");
      },
    },
    {
      id: "setKeymapStyleMatrix",
      display: "matrix",
      configValue: "matrix",
      exec: (): void => {
        UpdateConfig.setKeymapStyle("matrix");
      },
    },
    {
      id: "setKeymapStyleSplit",
      display: "split",
      configValue: "split",
      exec: (): void => {
        UpdateConfig.setKeymapStyle("split");
      },
    },
    {
      id: "setKeymapStyleSplitMatrix",
      display: "split matrix",
      configValue: "split_matrix",
      exec: (): void => {
        UpdateConfig.setKeymapStyle("split_matrix");
      },
    },
  ],
};

const commandsKeymapLegendStyle: MonkeyTypes.CommandsGroup = {
  title: "Keymap legend style...",
  configKey: "keymapLegendStyle",
  list: [
    {
      id: "setKeymapLegendStyleLowercase",
      display: "lowercase",
      configValue: "lowercase",
      exec: (): void => {
        UpdateConfig.setKeymapLegendStyle("lowercase");
      },
    },
    {
      id: "setKeymapLegendStyleUppercase",
      display: "uppercase",
      configValue: "uppercase",
      exec: (): void => {
        UpdateConfig.setKeymapLegendStyle("uppercase");
      },
    },
    {
      id: "setKeymapLegendStyleBlank",
      display: "blank",
      configValue: "blank",
      exec: (): void => {
        UpdateConfig.setKeymapLegendStyle("blank");
      },
    },
    {
      id: "setKeymapLegendStyleDynamic",
      display: "dynamic",
      configValue: "dynamic",
      exec: (): void => {
        UpdateConfig.setKeymapLegendStyle("dynamic");
      },
    },
  ],
};

const commandsKeymapShowTopRow: MonkeyTypes.CommandsGroup = {
  title: "Keymap show top row...",
  configKey: "keymapShowTopRow",
  list: [
    {
      id: "keymapShowTopRowAlways",
      display: "always",
      configValue: "always",
      exec: (): void => {
        UpdateConfig.setKeymapShowTopRow("always");
      },
    },
    {
      id: "keymapShowTopRowLayout",
      display: "layout dependent",
      configValue: "layout",
      exec: (): void => {
        UpdateConfig.setKeymapShowTopRow("layout");
      },
    },
    {
      id: "keymapShowTopRowNever",
      display: "never",
      configValue: "never",
      exec: (): void => {
        UpdateConfig.setKeymapShowTopRow("never");
      },
    },
  ],
};

const commandsBritishEnglish: MonkeyTypes.CommandsGroup = {
  title: "British english...",
  configKey: "britishEnglish",
  list: [
    {
      id: "setBritishEnglishOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setBritishEnglish(false);
        TestLogic.restart();
      },
    },
    {
      id: "setBritishEnglishOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setBritishEnglish(true);
        TestLogic.restart();
      },
    },
  ],
};

const commandsHighlightMode: MonkeyTypes.CommandsGroup = {
  title: "Highlight mode...",
  configKey: "highlightMode",
  list: [
    {
      id: "setHighlightModeOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setHighlightMode("off");
      },
    },
    {
      id: "setHighlightModeLetter",
      display: "letter",
      configValue: "letter",
      exec: (): void => {
        UpdateConfig.setHighlightMode("letter");
      },
    },
    {
      id: "setHighlightModeWord",
      display: "word",
      configValue: "word",
      exec: (): void => {
        UpdateConfig.setHighlightMode("word");
      },
    },
  ],
};

const commandsTapeMode: MonkeyTypes.CommandsGroup = {
  title: "Tape mode...",
  configKey: "tapeMode",
  list: [
    {
      id: "setTapeModeOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setTapeMode("off");
      },
    },
    {
      id: "setTapeModeLetter",
      display: "letter",
      configValue: "letter",
      exec: (): void => {
        UpdateConfig.setTapeMode("letter");
      },
    },
    {
      id: "setTapeModeWord",
      display: "word",
      configValue: "word",
      exec: (): void => {
        UpdateConfig.setTapeMode("word");
      },
    },
  ],
};

const commandsTimerStyle: MonkeyTypes.CommandsGroup = {
  title: "Timer/progress style...",
  configKey: "timerStyle",
  list: [
    {
      id: "setTimerStyleBar",
      display: "bar",
      configValue: "bar",
      exec: (): void => {
        UpdateConfig.setTimerStyle("bar");
      },
    },
    {
      id: "setTimerStyleText",
      display: "text",
      configValue: "text",
      exec: (): void => {
        UpdateConfig.setTimerStyle("text");
      },
    },
    {
      id: "setTimerStyleMini",
      display: "mini",
      configValue: "mini",
      exec: (): void => {
        UpdateConfig.setTimerStyle("mini");
      },
    },
  ],
};

const commandsTimerColor: MonkeyTypes.CommandsGroup = {
  title: "Timer/progress color...",
  configKey: "timerColor",
  list: [
    {
      id: "setTimerColorBlack",
      display: "black",
      configValue: "black",
      exec: (): void => {
        UpdateConfig.setTimerColor("black");
      },
    },
    {
      id: "setTimerColorSub",
      display: "sub",
      configValue: "sub",
      exec: (): void => {
        UpdateConfig.setTimerColor("sub");
      },
    },
    {
      id: "setTimerColorText",
      display: "text",
      configValue: "text",
      exec: (): void => {
        UpdateConfig.setTimerColor("text");
      },
    },
    {
      id: "setTimerColorMain",
      display: "main",
      configValue: "main",
      exec: (): void => {
        UpdateConfig.setTimerColor("main");
      },
    },
  ],
};

const commandsSingleListCommandLine: MonkeyTypes.CommandsGroup = {
  title: "Single list command line...",
  configKey: "singleListCommandLine",
  list: [
    {
      id: "singleListCommandLineManual",
      display: "manual",
      configValue: "manual",
      exec: (): void => {
        UpdateConfig.setSingleListCommandLine("manual");
      },
    },
    {
      id: "singleListCommandLineOn",
      display: "on",
      configValue: "on",
      exec: (): void => {
        UpdateConfig.setSingleListCommandLine("on");
      },
    },
  ],
};

const commandsCapsLockWarning: MonkeyTypes.CommandsGroup = {
  title: "Caps lock warning...",
  configKey: "capsLockWarning",
  list: [
    {
      id: "capsLockWarningOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setCapsLockWarning(true);
      },
    },
    {
      id: "capsLockWarningOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setCapsLockWarning(false);
      },
    },
  ],
};

const commandsTimerOpacity: MonkeyTypes.CommandsGroup = {
  title: "Timer/progress opacity...",
  configKey: "timerOpacity",
  list: [
    {
      id: "setTimerOpacity.25",
      display: ".25",
      configValue: 0.25,
      exec: (): void => {
        UpdateConfig.setTimerOpacity("0.25");
      },
    },
    {
      id: "setTimerOpacity.5",
      display: ".5",
      configValue: 0.5,
      exec: (): void => {
        UpdateConfig.setTimerOpacity("0.5");
      },
    },
    {
      id: "setTimerOpacity.75",
      display: ".75",
      configValue: 0.75,
      exec: (): void => {
        UpdateConfig.setTimerOpacity("0.75");
      },
    },
    {
      id: "setTimerOpacity1",
      display: "1",
      configValue: 1,
      exec: (): void => {
        UpdateConfig.setTimerOpacity("1");
      },
    },
  ],
};

const commandsNumbers: MonkeyTypes.CommandsGroup = {
  title: "Numbers...",
  configKey: "numbers",
  list: [
    {
      id: "changeNumbersOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setNumbers(true);
        TestLogic.restart();
      },
    },
    {
      id: "changeNumbersOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setNumbers(false);
        TestLogic.restart();
      },
    },
  ],
};

const commandsSmoothCaret: MonkeyTypes.CommandsGroup = {
  title: "Smooth caret...",
  configKey: "smoothCaret",
  list: [
    {
      id: "changeSmoothCaretOn",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setSmoothCaret(true);
      },
    },
    {
      id: "changeSmoothCaretOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setSmoothCaret(false);
      },
    },
  ],
};

const commandsQuickRestart: MonkeyTypes.CommandsGroup = {
  title: "Quick restart...",
  configKey: "quickRestart",
  list: [
    {
      id: "changeQuickRestartTab",
      display: "tab",
      configValue: "tab",
      exec: (): void => {
        UpdateConfig.setQuickRestartMode("tab");
      },
    },
    {
      id: "changeQuickRestartEsc",
      display: "esc",
      configValue: "esc",
      exec: (): void => {
        UpdateConfig.setQuickRestartMode("esc");
      },
    },
    {
      id: "changeQuickRestartOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setQuickRestartMode("off");
      },
    },
  ],
};

const commandsConfidenceMode: MonkeyTypes.CommandsGroup = {
  title: "Confidence mode...",
  configKey: "confidenceMode",
  list: [
    {
      id: "changeConfidenceModeOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setConfidenceMode("off");
      },
    },
    {
      id: "changeConfidenceModeOn",
      display: "on",
      configValue: "on",
      exec: (): void => {
        UpdateConfig.setConfidenceMode("on");
      },
    },
    {
      id: "changeConfidenceModeMax",
      display: "max",
      configValue: "max",
      exec: (): void => {
        UpdateConfig.setConfidenceMode("max");
      },
    },
  ],
};

const commandsStopOnError: MonkeyTypes.CommandsGroup = {
  title: "Stop on error...",
  configKey: "stopOnError",
  list: [
    {
      id: "changeStopOnErrorOff",
      display: "off",
      configValue: "off",
      exec: (): void => {
        UpdateConfig.setStopOnError("off");
      },
    },
    {
      id: "changeStopOnErrorLetter",
      display: "letter",
      configValue: "letter",
      exec: (): void => {
        UpdateConfig.setStopOnError("letter");
      },
    },
    {
      id: "changeStopOnErrorWord",
      display: "word",
      configValue: "word",
      exec: (): void => {
        UpdateConfig.setStopOnError("word");
      },
    },
  ],
};

const commandsPageWidth: MonkeyTypes.CommandsGroup = {
  title: "Page width...",
  configKey: "pageWidth",
  list: [
    {
      id: "setPageWidth100",
      display: "100",
      configValue: "100",
      exec: (): void => {
        UpdateConfig.setPageWidth("100");
      },
    },
    {
      id: "setPageWidth125",
      display: "125",
      configValue: "125",
      exec: (): void => {
        UpdateConfig.setPageWidth("125");
      },
    },
    {
      id: "setPageWidth150",
      display: "150",
      configValue: "150",
      exec: (): void => {
        UpdateConfig.setPageWidth("150");
      },
    },
    {
      id: "setPageWidth200",
      display: "200",
      configValue: "200",
      exec: (): void => {
        UpdateConfig.setPageWidth("200");
      },
    },
    {
      id: "setPageWidthMax",
      display: "max",
      configValue: "max",
      exec: (): void => {
        UpdateConfig.setPageWidth("max");
      },
    },
  ],
};

const commandsPractiseWords: MonkeyTypes.CommandsGroup = {
  title: "Practice words...",
  list: [
    {
      id: "practiseWordsMissed",
      display: "missed",
      noIcon: true,
      exec: (): void => {
        PractiseWords.init(true, false);
        TestLogic.restart({
          practiseMissed: true,
        });
      },
    },
    {
      id: "practiseWordsSlow",
      display: "slow",
      noIcon: true,
      exec: (): void => {
        PractiseWords.init(false, true);
        TestLogic.restart({
          practiseMissed: true,
        });
      },
    },
    {
      id: "practiseWordsBoth",
      display: "both",
      noIcon: true,
      exec: (): void => {
        PractiseWords.init(true, true);
        TestLogic.restart({
          practiseMissed: true,
        });
      },
    },
  ],
};

export const themeCommands: MonkeyTypes.CommandsGroup = {
  title: "Theme...",
  configKey: "theme",
  list: [],
};

Misc.getThemesList().then((themes) => {
  themes.forEach((theme) => {
    themeCommands.list.push({
      id: "changeTheme" + Misc.capitalizeFirstLetterOfEachWord(theme.name),
      display: theme.name.replace(/_/g, " "),
      configValue: theme.name,
      hover: (): void => {
        // previewTheme(theme.name);
        ThemeController.preview(theme.name, false);
      },
      exec: (): void => {
        UpdateConfig.setTheme(theme.name);
      },
    });
  });
});

export const commandsChallenges: MonkeyTypes.CommandsGroup = {
  title: "Load challenge...",
  list: [],
};

Misc.getChallengeList().then((challenges) => {
  challenges.forEach((challenge) => {
    commandsChallenges.list.push({
      id:
        "loadChallenge" + Misc.capitalizeFirstLetterOfEachWord(challenge.name),
      noIcon: true,
      display: challenge.display,
      exec: async (): Promise<void> => {
        navigate("/");
        await ChallengeController.setup(challenge.name);
        TestLogic.restart({
          nosave: true,
        });
      },
    });
  });
});

// export function showFavouriteThemesAtTheTop() {
export function updateThemeCommands(): void {
  if (Config.favThemes.length > 0) {
    themeCommands.list = [];
    Config.favThemes.forEach((theme: string) => {
      themeCommands.list.push({
        id: "changeTheme" + Misc.capitalizeFirstLetterOfEachWord(theme),
        display: theme.replace(/_/g, " "),
        hover: (): void => {
          // previewTheme(theme);
          ThemeController.preview(theme, false);
        },
        exec: (): void => {
          UpdateConfig.setTheme(theme);
        },
      });
    });
    Misc.getThemesList().then((themes) => {
      themes.forEach((theme) => {
        if ((Config.favThemes as string[]).includes(theme.name)) return;
        themeCommands.list.push({
          id: "changeTheme" + Misc.capitalizeFirstLetterOfEachWord(theme.name),
          display: theme.name.replace(/_/g, " "),
          hover: (): void => {
            // previewTheme(theme.name);
            ThemeController.preview(theme.name, false);
          },
          exec: (): void => {
            UpdateConfig.setTheme(theme.name);
          },
        });
      });
    });
  }
}

const commandsCopyWordsToClipboard: MonkeyTypes.CommandsGroup = {
  title: "Are you sure...",
  list: [
    {
      id: "copyNo",
      display: "Nevermind",
    },
    {
      id: "copyYes",
      display: "Yes, I am sure",
      exec: (): void => {
        const words = Misc.getWords();

        navigator.clipboard.writeText(words).then(
          () => {
            Notifications.add("Copied to clipboard", 1);
          },
          () => {
            Notifications.add("Failed to copy!", -1);
          }
        );
      },
    },
  ],
};

const commandsMonkeyPowerLevel: MonkeyTypes.CommandsGroup = {
  title: "Power mode...",
  configKey: "monkeyPowerLevel",
  list: [
    {
      id: "monkeyPowerLevelOff",
      display: "off",
      configValue: "off",
      exec: () => UpdateConfig.setMonkeyPowerLevel("off"),
    },
    {
      id: "monkeyPowerLevel1",
      display: "mellow",
      configValue: "1",
      exec: () => UpdateConfig.setMonkeyPowerLevel("1"),
    },
    {
      id: "monkeyPowerLevel2",
      display: "high",
      configValue: "2",
      exec: () => UpdateConfig.setMonkeyPowerLevel("2"),
    },
    {
      id: "monkeyPowerLevel3",
      display: "ultra",
      configValue: "3",
      exec: () => UpdateConfig.setMonkeyPowerLevel("3"),
    },
    {
      id: "monkeyPowerLevel4",
      display: "over 9000",
      configValue: "4",
      exec: () => UpdateConfig.setMonkeyPowerLevel("4"),
    },
  ],
};

const listsObject = {
  commandsChallenges,
  commandsLanguages,
  commandsDifficulty,
  commandsLazyMode,
  commandsPaceCaret,
  commandsShowAverage,
  commandsMinWpm,
  commandsMinAcc,
  commandsMinBurst,
  commandsFunbox,
  commandsConfidenceMode,
  commandsStopOnError,
  commandsLayouts,
  commandsOppositeShiftMode,
  commandsTags,
};

export type ListsObjectKeys = keyof typeof listsObject;

export function getList(list: ListsObjectKeys): MonkeyTypes.CommandsGroup {
  return listsObject[list];
}
