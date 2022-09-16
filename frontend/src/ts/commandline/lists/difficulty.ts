import * as UpdateConfig from "../../config";

const commands: MonkeyTypes.CommandsSubgroup = {
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

export default commands;
