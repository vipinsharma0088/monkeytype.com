import * as UpdateConfig from "../../config";

const commands: MonkeyTypes.CommandsGroup = {
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

export default commands;
