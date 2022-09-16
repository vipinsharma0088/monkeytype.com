import * as UpdateConfig from "../../config";

const commands: MonkeyTypes.CommandsSubgroup = {
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

export default commands;
