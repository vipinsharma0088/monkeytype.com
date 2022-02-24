import * as ThemeColors from "../elements/theme-colors";
import * as ChartController from "./chart-controller";
import * as Misc from "../misc";
import Config, * as UpdateConfig from "../config";
import tinycolor from "tinycolor2";
import * as BackgroundFilter from "../elements/custom-background-filter";
import * as ConfigEvent from "../observables/config-event";
import * as DB from "../db";
import * as Notifications from "../elements/notifications";

let isPreviewingTheme = false;
export let randomTheme: string | null = null;

export const colorVars = [
  "--bg-color",
  "--main-color",
  "--caret-color",
  "--sub-color",
  "--text-color",
  "--error-color",
  "--error-extra-color",
  "--colorful-error-color",
  "--colorful-error-extra-color",
];

async function updateFavicon(size: number, curveSize: number): Promise<void> {
  setTimeout(async () => {
    let maincolor, bgcolor;
    bgcolor = await ThemeColors.get("bg");
    maincolor = await ThemeColors.get("main");
    if (window.location.hostname === "localhost") {
      const swap = maincolor;
      maincolor = bgcolor;
      bgcolor = swap;
    }
    if (bgcolor == maincolor) {
      bgcolor = "#111";
      maincolor = "#eee";
    }
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.beginPath();
    ctx.moveTo(0, curveSize);
    //top left
    ctx.quadraticCurveTo(0, 0, curveSize, 0);
    ctx.lineTo(size - curveSize, 0);
    //top right
    ctx.quadraticCurveTo(size, 0, size, curveSize);
    ctx.lineTo(size, size - curveSize);
    ctx.quadraticCurveTo(size, size, size - curveSize, size);
    ctx.lineTo(curveSize, size);
    ctx.quadraticCurveTo(0, size, 0, size - curveSize);
    ctx.fillStyle = bgcolor;
    ctx.fill();
    ctx.font = "900 " + (size / 2) * 1.2 + "px Lexend Deca";
    ctx.textAlign = "center";
    ctx.fillStyle = maincolor;
    ctx.fillText("mt", size / 2 + 1, (size / 3) * 2.1);
    // $("body").prepend(canvas);
    $("#favicon").attr("href", canvas.toDataURL("image/png"));
  }, 125);
}

function clearCustomTheme(): void {
  colorVars.forEach((e) => {
    document.documentElement.style.setProperty(e, "");
  });
}

const loadStyle = async function (name: string): Promise<void> {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.id = "currentTheme";
    link.onload = (): void => {
      resolve();
    };
    link.href = `themes/${name}.css`;

    const headScript = document.querySelector("#currentTheme") as Element;
    headScript.replaceWith(link);
  });
};

export async function apply(
  themeNameOrIndex: string | number,
  isPreview = false
): Promise<void> {
  clearCustomTheme();

  if (themeNameOrIndex === -1) themeNameOrIndex = Config.theme;

  if (typeof themeNameOrIndex === "number") {
    // The user has not yet loaded
    if (DB.getSnapshot() === undefined) {
      return;
    }
    // We have been given the index of the custom theme
    const customThemes = DB.getSnapshot().customThemes;
    console.log(customThemes);
    const customTheme = customThemes ? customThemes[themeNameOrIndex] : null;
    if (customTheme === undefined || customTheme === null) {
      Notifications.add(`No custom theme at index: ${themeNameOrIndex}`, 0);
      return;
    }
    const themeName = customTheme.name;
    Misc.swapElements(
      $('.pageSettings [tabContent="preset"]'),
      $('.pageSettings [tabContent="custom"]'),
      250
    );

    ThemeColors.reset();

    colorVars.forEach((e, index) => {
      document.documentElement.style.setProperty(e, customTheme?.colors[index]);
    });

    try {
      firebase.analytics().logEvent("changedCustomTheme", {
        theme: themeName,
      });
    } catch (e) {
      console.log("Analytics unavailable");
    }

    if (!isPreview) {
      UpdateConfig.setCustomThemeColors([...customTheme.colors]);
      ThemeColors.getAll().then((colors) => {
        $(".current-theme .text").text(
          "custom: " + themeName.replace(/_/g, " ")
        );
        $(".keymap-key").attr("style", "");
        ChartController.updateAllChartColors();
        updateFavicon(128, 32);
        $("#metaThemeColor").attr("content", colors.bg);
      });
    }
  } else {
    const themeName = themeNameOrIndex;
    Misc.swapElements(
      $('.pageSettings [tabContent="custom"]'),
      $('.pageSettings [tabContent="preset"]'),
      250
    );
    ThemeColors.reset();

    loadStyle(themeName).then(() => {
      ThemeColors.update();
      try {
        firebase.analytics().logEvent("changedTheme", {
          theme: themeNameOrIndex,
        });
      } catch (e) {
        console.log("Analytics unavailable");
      }
      if (!isPreview) {
        ThemeColors.getAll().then((colors) => {
          $(".current-theme .text").text(themeName.replace(/_/g, " "));
          $(".keymap-key").attr("style", "");
          ChartController.updateAllChartColors();
          updateFavicon(128, 32);
          $("#metaThemeColor").attr("content", colors.bg);
        });
      }
    });
  }
}

export function preview(themeName: string | number, randomTheme = false): void {
  isPreviewingTheme = true;
  apply(themeName, true && !randomTheme);
}

export function set(themeNameOrIndex: string | number): void {
  apply(themeNameOrIndex);
}

export function clearPreview(): void {
  if (isPreviewingTheme) {
    isPreviewingTheme = false;
    randomTheme = null;
    if (Config.customThemeIndex !== -1) {
      // Rizwan TODO: Update the apply theme to support custom themes
      apply(Config.customThemeIndex);
    } else {
      apply(Config.theme);
    }
  }
}

export function randomizeTheme(): void {
  let randomList;
  Misc.getThemesList().then((themes) => {
    if (Config.randomTheme === "fav" && Config.favThemes.length > 0) {
      randomList = Config.favThemes;
    } else if (Config.randomTheme === "light") {
      randomList = themes
        .filter((t) => tinycolor(t.bgColor).isLight())
        .map((t) => t.name);
    } else if (Config.randomTheme === "dark") {
      randomList = themes
        .filter((t) => tinycolor(t.bgColor).isDark())
        .map((t) => t.name);
    } else {
      randomList = themes.map((t) => {
        return t.name;
      });
    }

    const previousTheme = randomTheme;
    randomTheme = randomList[Math.floor(Math.random() * randomList.length)];

    preview(randomTheme, true);

    if (previousTheme != randomTheme) {
      // Notifications.add(randomTheme.replace(/_/g, " "), 0);
    }
  });
}

export function clearRandom(): void {
  randomTheme = null;
}

export function applyCustomBackgroundSize(): void {
  if (Config.customBackgroundSize == "max") {
    $(".customBackground img").css({
      // width: "calc(100%)",
      // height: "calc(100%)",
      objectFit: "",
    });
  } else {
    $(".customBackground img").css({
      objectFit: Config.customBackgroundSize,
    });
  }
}

export function applyCustomBackground(): void {
  // $(".customBackground").css({
  //   backgroundImage: `url(${Config.customBackground})`,
  //   backgroundAttachment: "fixed",
  // });
  if (Config.customBackground === "") {
    $("#words").removeClass("noErrorBorder");
    $("#resultWordsHistory").removeClass("noErrorBorder");
    $(".customBackground img").remove();
  } else {
    $("#words").addClass("noErrorBorder");
    $("#resultWordsHistory").addClass("noErrorBorder");
    $(".customBackground").html(`<img src="${Config.customBackground}" />`);
    BackgroundFilter.apply();
    applyCustomBackgroundSize();
  }
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  ?.addEventListener("change", (event) => {
    if (!Config.autoSwitchTheme || Config.customThemeIndex !== -1) return;
    if (event.matches) {
      set(Config.themeDark);
    } else {
      set(Config.themeLight);
    }
  });

ConfigEvent.subscribe((eventKey, eventValue, nosave) => {
  if (eventKey === "customThemeIndex") {
    // Rizwan TODO: Update this
    console.log("customThemeIndex changed");
    console.log(eventValue);
    set(eventValue);
  }
  if (eventKey === "theme") {
    clearPreview();
    set(eventValue);
  }
  if (eventKey === "setThemes") {
    clearPreview();
    if (eventValue) {
      // Rizwan TODO: Take a look at this
      console.log("Printing event value ");
      setTimeout(() => {
        console.log(eventValue);
        set(eventValue);
      });
    } else {
      if (Config.autoSwitchTheme) {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          set(Config.themeDark);
        } else {
          set(Config.themeLight);
        }
      } else {
        set(Config.theme);
      }
    }
  }
  if (eventKey === "randomTheme" && eventValue === "off") clearRandom();
  if (eventKey === "customBackground") applyCustomBackground();
  if (eventKey === "customBackgroundSize") applyCustomBackgroundSize();
  if (eventKey === "autoSwitchTheme") {
    if (eventValue) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        set(Config.themeDark);
      } else {
        set(Config.themeLight);
      }
    } else {
      set(Config.theme);
    }
  }
  if (
    eventKey === "themeLight" &&
    Config.autoSwitchTheme &&
    !(
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) &&
    !nosave
  ) {
    set(Config.themeLight);
  }
  if (
    eventKey === "themeDark" &&
    Config.autoSwitchTheme &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches &&
    !nosave
  ) {
    set(Config.themeDark);
  }
});
