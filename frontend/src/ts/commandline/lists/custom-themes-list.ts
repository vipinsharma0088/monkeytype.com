import * as UpdateConfig from "../../config";
import { Auth } from "../../firebase";
import * as DB from "../../db";
import * as ThemeController from "../../controllers/theme-controller";

export const commands: MonkeyTypes.CommandsSubgroup = {
  title: "Custom themes list...",
  // configKey: "customThemeId",
  list: [],
};

export function update(): void {
  if (Auth.currentUser === null) {
    return;
  }

  commands.list = [];

  const snapshot = DB.getSnapshot();

  if (!snapshot) return;

  if (DB.getSnapshot().customThemes.length === 0) {
    return;
  }
  DB.getSnapshot().customThemes.forEach((theme) => {
    commands.list.push({
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
}

export default commands;
