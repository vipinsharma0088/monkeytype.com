import { navigate } from "../../controllers/route-controller";
import * as ChallengeController from "../../controllers/challenge-controller";
import * as TestLogic from "../../test/test-logic";
import { capitalizeFirstLetterOfEachWord } from "../../utils/strings";
import { Command, CommandsSubgroup } from "../types";

const subgroup: CommandsSubgroup = {
  title: "Load challenge...",
  list: [],
};

const commands: Command[] = [
  {
    id: "loadChallenge",
    display: "Load challenge...",
    icon: "fa-award",
    subgroup,
  },
];

function update(challenges: MonkeyTypes.Challenge[]): void {
  challenges.forEach((challenge) => {
    subgroup.list.push({
      id: "loadChallenge" + capitalizeFirstLetterOfEachWord(challenge.name),
      display: challenge.display,
      exec: async (): Promise<void> => {
        navigate("/");
        await ChallengeController.setup(challenge.name);
        TestLogic.restart({
          nosave: true,
        });
      },
    });
  });
}

export default commands;
export { update };
