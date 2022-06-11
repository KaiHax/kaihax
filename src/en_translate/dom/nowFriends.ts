import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () => patcher.observe(`.${CLASS_NAMES.message_oneline}`, (elem) => {
  if (!elem.lastChild?.textContent?.startsWith("你与")) return;

  const friendName = utils.reactFiberWalker(
    utils.getFiber(elem),
    "currentChat",
    true
  )?.pendingProps.currentChat.target_info.nickname;

  elem.lastChild.textContent = `You and ${friendName} are now friends.`;
});
