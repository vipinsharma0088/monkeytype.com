import * as UpdateConfig from "../../config";
import * as SoundController from "../../controllers/sound-controller";

const commands: MonkeyTypes.CommandsSubgroup = {
  title: "Sound volume...",
  configKey: "soundVolume",
  list: [
    {
      id: "setSoundVolume0.1",
      display: "quiet",
      configValue: "0.1",
      exec: (): void => {
        UpdateConfig.setSoundVolume("0.1");
        SoundController.playClick();
      },
    },
    {
      id: "setSoundVolume0.5",
      display: "medium",
      configValue: "0.5",
      exec: (): void => {
        UpdateConfig.setSoundVolume("0.5");
        SoundController.playClick();
      },
    },
    {
      id: "setSoundVolume1.0",
      display: "loud",
      configValue: "1.0",
      exec: (): void => {
        UpdateConfig.setSoundVolume("1.0");
        SoundController.playClick();
      },
    },
  ],
};

export default commands;
