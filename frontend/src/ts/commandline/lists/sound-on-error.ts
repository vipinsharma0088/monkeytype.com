import * as UpdateConfig from "../../config";
import * as SoundController from "../../controllers/sound-controller";

const subgroup: MonkeyTypes.CommandsSubgroup = {
  title: "Sound on error...",
  configKey: "playSoundOnError",
  list: [
    {
      id: "setPlaySoundOnErrorOff",
      display: "off",
      configValue: false,
      exec: (): void => {
        UpdateConfig.setPlaySoundOnError("off");
      },
    },
    {
      id: "setPlaySoundOnError1",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setPlaySoundOnError("1");
        SoundController.playError();
      },
    },
    {
      id: "setPlaySoundOnError2",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setPlaySoundOnError("2");
        SoundController.playError();
      },
    },
    {
      id: "setPlaySoundOnError3",
      display: "on",
      configValue: true,
      exec: (): void => {
        UpdateConfig.setPlaySoundOnError("3");
        SoundController.playError();
      },
    },
  ],
};

const commands: MonkeyTypes.Command[] = [
  {
    id: "changeSoundOnError",
    display: "Sound on error...",
    icon: "fa-volume-mute",
    subgroup,
  },
];

export default commands;
