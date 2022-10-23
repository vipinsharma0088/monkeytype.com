import * as TestStats from "../test/test-stats";
import * as TestUI from "../test/test-ui";
import * as ManualRestart from "../test/manual-restart-tracker";
import * as TestLogic from "../test/test-logic";
import * as Funbox from "../test/funbox";
import Page from "./page";
import { updateTestPageAds } from "../controllers/ad-controller";
import * as ModesNotice from "../elements/modes-notice";

export const page = new Page(
  "test",
  $(".page.pageTest"),
  "/",
  async () => {
    TestLogic.restart();
    Funbox.clear();
    ModesNotice.update();
    $("#wordsInput").focusout();
  },
  async () => {
    updateTestPageAds(true);
  },
  async () => {
    updateTestPageAds(false);
    TestStats.resetIncomplete();
    ManualRestart.set();
    TestLogic.restart({
      noAnim: true,
    });
    Funbox.activate();
  },
  async () => {
    TestUI.focusWords();
  }
);
