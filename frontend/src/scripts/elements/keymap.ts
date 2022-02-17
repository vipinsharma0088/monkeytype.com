import Config from "../config";
import * as ThemeColors from "./theme-colors";
import layouts from "../test/layouts";
import * as SlowTimer from "../states/slow-timer";
import * as ConfigEvent from "../observables/config-event";

export function highlightKey(currentKey: string): void {
  if (Config.mode === "zen") return;
  try {
    if ($(".active-key") != undefined) {
      $(".active-key").removeClass("active-key");
    }

    let highlightKey;
    switch (currentKey) {
      case "\\":
      case "|":
        highlightKey = "#KeyBackslash";
        break;
      case "}":
      case "]":
        highlightKey = "#KeyRightBracket";
        break;
      case "{":
      case "[":
        highlightKey = "#KeyLeftBracket";
        break;
      case '"':
      case "'":
        highlightKey = "#KeyQuote";
        break;
      case ":":
      case ";":
        highlightKey = "#KeySemicolon";
        break;
      case "<":
      case ",":
        highlightKey = "#KeyComma";
        break;
      case ">":
      case ".":
        highlightKey = "#KeyPeriod";
        break;
      case "?":
      case "/":
        highlightKey = "#KeySlash";
        break;
      case "":
        highlightKey = "#KeySpace";
        break;
      default:
        highlightKey = `#Key${currentKey}`;
    }

    $(highlightKey).addClass("active-key");
    if (highlightKey === "#KeySpace") {
      $("#KeySpace2").addClass("active-key");
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log("could not update highlighted keymap key: " + e.message);
    }
  }
}

export async function flashKey(key: string, correct: boolean): Promise<void> {
  if (key == undefined) return;
  switch (key) {
    case "\\":
    case "|":
      key = "#KeyBackslash";
      break;
    case "}":
    case "]":
      key = "#KeyRightBracket";
      break;
    case "{":
    case "[":
      key = "#KeyLeftBracket";
      break;
    case '"':
    case "'":
      key = "#KeyQuote";
      break;
    case ":":
    case ";":
      key = "#KeySemicolon";
      break;
    case "<":
    case ",":
      key = "#KeyComma";
      break;
    case ">":
    case ".":
      key = "#KeyPeriod";
      break;
    case "?":
    case "/":
      key = "#KeySlash";
      break;
    case "" || "Space":
      key = "#KeySpace";
      break;
    default:
      key = `#Key${key.toUpperCase()}`;
  }

  if (key == "#KeySpace") {
    key = ".key-split-space";
  }

  const themecolors = await ThemeColors.getAll();

  try {
    if (correct || Config.blindMode) {
      $(key)
        .stop(true, true)
        .css({
          color: themecolors.bg,
          backgroundColor: themecolors.main,
          borderColor: themecolors.main,
        })
        .animate(
          {
            color: themecolors.sub,
            backgroundColor: "transparent",
            borderColor: themecolors.sub,
          },
          SlowTimer.get() ? 0 : 500,
          "easeOutExpo"
        );
    } else {
      $(key)
        .stop(true, true)
        .css({
          color: themecolors.bg,
          backgroundColor: themecolors.error,
          borderColor: themecolors.error,
        })
        .animate(
          {
            color: themecolors.sub,
            backgroundColor: "transparent",
            borderColor: themecolors.sub,
          },
          SlowTimer.get() ? 0 : 500,
          "easeOutExpo"
        );
    }
  } catch (e) {}
}

export function hide(): void {
  $("#keymap").addClass("hidden");
}

export function show(): void {
  $("#keymap").removeClass("hidden");
}

export function refresh(layout: string = Config.layout): void {
  if (!layout) return;
  try {
    let lts = layouts[layout as keyof typeof layouts]; //layout to show
    let layoutString = layout;
    if (Config.keymapLayout === "overrideSync") {
      if (Config.layout === "default") {
        lts = layouts["qwerty"];
        layoutString = "default";
      } else {
        lts = layouts[Config.layout as keyof typeof layouts];
        layoutString = Config.layout;
      }
    }

    if (layout === "default") {
      lts = layouts["qwerty"];
      layoutString = "default";
    }

    const showTopRow = (lts as typeof layouts["qwerty"]).keymapShowTopRow;

    const isMatrix =
      Config.keymapStyle === "matrix" || Config.keymapStyle === "split_matrix";

    let keymapElement = "";

    Object.keys(lts.keys).forEach((row, index) => {
      const rowKeys = lts.keys[row];
      let rowElement = "";
      if (row === "row1" && !showTopRow) {
        return;
      }

      if ((row === "row2" || row === "row3" || row === "row4") && !isMatrix) {
        rowElement += "<div></div>";
      }

      if (row === "row4" && lts.type !== "iso" && !isMatrix) {
        rowElement += "<div></div>";
      }

      if (row === "row5") {
        rowElement += "<div></div>";
        rowElement += `<div class="keymap-key key-space">
          <div class="letter">${layoutString.replace(/_/g, " ")}</div>
        </div>`;
        rowElement += `<div class="keymap-split-spacer"></div>`;
        rowElement += `<div class="keymap-key key-split-space">
          <div class="letter"></div>
        </div>`;
      } else {
        for (let i = 0; i < rowKeys.length; i++) {
          if (row === "row2" && i === 12) continue;
          if (
            (Config.keymapStyle === "matrix" ||
              Config.keymapStyle === "split_matrix") &&
            i >= 10
          )
            continue;
          const key = rowKeys[i];
          const bump = row === "row3" && (i === 3 || i === 7) ? true : false;
          const keyElement = `<div class="keymap-key" data-key="${key}">
              <span class="letter">${key[0]}</span>
              ${bump ? "<div class='bump'></div>" : ""}
          </div>`;

          let splitSpacer = "";
          if (
            Config.keymapStyle === "split" ||
            Config.keymapStyle === "split_matrix" ||
            Config.keymapStyle === "alice"
          ) {
            if (i === 5) {
              splitSpacer += `<div class="keymap-split-spacer"></div>`;
            }
          }

          if (Config.keymapStyle === "alice" && i === 5 && row === "row4") {
            splitSpacer += `<div class="extra-key"><span class="letter"></span></div>`;
          }

          rowElement += splitSpacer + keyElement;
        }
      }

      keymapElement += `<div class="row r${index + 1}">${rowElement}</div>`;
    });

    $("#keymap").html(keymapElement);

    $("#keymap").removeClass("staggered");
    $("#keymap").removeClass("matrix");
    $("#keymap").removeClass("split");
    $("#keymap").removeClass("split_matrix");
    $("#keymap").removeClass("alice");
    $("#keymap").addClass(Config.keymapStyle);
  } catch (e) {
    if (e instanceof Error) {
      console.log(
        "something went wrong when changing layout, resettings: " + e.message
      );
      // UpdateConfig.setKeymapLayout("qwerty", true);
    }
  }
}

ConfigEvent.subscribe((eventKey) => {
  if (eventKey === "layout" && Config.keymapLayout === "overrideSync")
    refresh(Config.keymapLayout);
  if (eventKey === "keymapLayout" || eventKey === "keymapStyle") refresh();
});
