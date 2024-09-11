import _ from "lodash";
import FunboxList from "../constants/funbox-list";

import {
  Mode,
  PersonalBest,
  PersonalBests,
} from "@monkeytype/contracts/schemas/shared";
import { Result as ResultType } from "@monkeytype/contracts/schemas/results";

type CheckAndUpdatePbResult = {
  isPb: boolean;
  personalBests: PersonalBests;
  lbPersonalBests?: MonkeyTypes.LbPersonalBests;
};

type Result = Omit<ResultType<Mode>, "_id" | "name">;

export function canFunboxGetPb(result: Result): boolean {
  const funbox = result.funbox;
  if (funbox === undefined || funbox === "" || funbox === "none") return true;

  let ret = true;
  const resultFunboxes = funbox.split("#");
  for (const funbox of FunboxList) {
    if (resultFunboxes.includes(funbox.name)) {
      if (!funbox.canGetPb) {
        ret = false;
      }
    }
  }

  return ret;
}

export function checkAndUpdatePb(
  userPersonalBests: PersonalBests,
  lbPersonalBests: MonkeyTypes.LbPersonalBests | undefined,
  result: Result
): CheckAndUpdatePbResult {
  const mode = result.mode;
  const mode2 = result.mode2;

  const userPb = userPersonalBests ?? {};
  userPb[mode] ??= {};
  userPb[mode][mode2] ??= [];

  const personalBestMatch = (userPb[mode][mode2] as PersonalBest[]).find((pb) =>
    matchesPersonalBest(result, pb)
  );

  let isPb = true;

  if (personalBestMatch) {
    const didUpdate = updatePersonalBest(personalBestMatch, result);
    isPb = didUpdate;
  } else {
    userPb[mode][mode2].push(buildPersonalBest(result));
  }

  if (!_.isNil(lbPersonalBests)) {
    updateLeaderboardPersonalBests(userPb, lbPersonalBests, result);
  }

  return {
    isPb,
    personalBests: userPb,
    lbPersonalBests: lbPersonalBests,
  };
}

function matchesPersonalBest(
  result: Result,
  personalBest: PersonalBest
): boolean {
  if (
    result.difficulty === undefined ||
    result.language === undefined ||
    result.punctuation === undefined ||
    result.lazyMode === undefined ||
    result.numbers === undefined
  ) {
    throw new Error("Missing result data (matchesPersonalBest)");
  }

  const sameLazyMode =
    (result.lazyMode ?? false) === (personalBest.lazyMode ?? false);
  const samePunctuation =
    (result.punctuation ?? false) === (personalBest.punctuation ?? false);
  const sameDifficulty = result.difficulty === personalBest.difficulty;
  const sameLanguage = result.language === personalBest.language;
  const sameNumbers =
    (result.numbers ?? false) === (personalBest.numbers ?? false);

  return (
    sameLazyMode &&
    samePunctuation &&
    sameDifficulty &&
    sameLanguage &&
    sameNumbers
  );
}

function updatePersonalBest(
  personalBest: PersonalBest,
  result: Result
): boolean {
  if (personalBest.wpm >= result.wpm) {
    return false;
  }

  if (
    result.difficulty === undefined ||
    result.language === undefined ||
    result.punctuation === undefined ||
    result.lazyMode === undefined ||
    result.acc === undefined ||
    result.consistency === undefined ||
    result.rawWpm === undefined ||
    result.wpm === undefined ||
    result.numbers === undefined
  ) {
    throw new Error("Missing result data (updatePersonalBest)");
  }

  personalBest.difficulty = result.difficulty;
  personalBest.language = result.language;
  personalBest.punctuation = result.punctuation;
  personalBest.lazyMode = result.lazyMode;
  personalBest.acc = result.acc;
  personalBest.consistency = result.consistency;
  personalBest.raw = result.rawWpm;
  personalBest.wpm = result.wpm;
  personalBest.numbers = result.numbers;
  personalBest.timestamp = Date.now();

  return true;
}

function buildPersonalBest(result: Result): PersonalBest {
  if (
    result.difficulty === undefined ||
    result.language === undefined ||
    result.punctuation === undefined ||
    result.lazyMode === undefined ||
    result.acc === undefined ||
    result.consistency === undefined ||
    result.rawWpm === undefined ||
    result.wpm === undefined ||
    result.numbers === undefined
  ) {
    throw new Error("Missing result data (buildPersonalBest)");
  }
  return {
    acc: result.acc,
    consistency: result.consistency,
    difficulty: result.difficulty,
    lazyMode: result.lazyMode,
    language: result.language,
    punctuation: result.punctuation,
    raw: result.rawWpm,
    wpm: result.wpm,
    numbers: result.numbers,
    timestamp: Date.now(),
  };
}

//TODO add tests, i changed implementation
function updateLeaderboardPersonalBests(
  userPersonalBests: PersonalBests,
  lbPersonalBests: MonkeyTypes.LbPersonalBests,
  result: Result
): void {
  if (!shouldUpdateLeaderboardPersonalBests(result)) {
    return;
  }

  const mode = result.mode;
  const mode2 = result.mode2;

  const lbPb = lbPersonalBests ?? {};
  lbPb[mode] ??= {};
  lbPb[mode][mode2] ??= {};

  const bestForEveryLanguage = {};

  userPersonalBests[mode][mode2].forEach((pb: PersonalBest) => {
    const language = pb.language;
    if (
      bestForEveryLanguage[language] === undefined ||
      bestForEveryLanguage[language].wpm < pb.wpm
    ) {
      bestForEveryLanguage[language] = pb;
    }
  });

  _.each(bestForEveryLanguage, (pb: PersonalBest, language: string) => {
    const languageDoesNotExist = lbPb[mode][mode2][language] === undefined;

    if (languageDoesNotExist || lbPb[mode][mode2][language].wpm < pb.wpm) {
      lbPb[mode][mode2][language] = pb;
    }
  });
}

function shouldUpdateLeaderboardPersonalBests(result: Result): boolean {
  const isValidTimeMode =
    result.mode === "time" && (result.mode2 === "15" || result.mode2 === "60");
  return isValidTimeMode && !result.lazyMode;
}
