import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () => patcher.observe(`.${CLASS_NAMES.welcome_tip}`, (tip) => {
  if (tip.textContent && !utils.startsNotAscii(tip.textContent)) return;

  if (tip.textContent?.startsWith("这里是你与")) {
    const userName = utils.reactFiberWalker(
      utils.getFiber(tip),
      "currentChat",
      true
    )?.pendingProps.currentChat.target_info.nickname;

    tip.textContent = `This is the beginning of your PMs with @${userName}.`;
  }
  else if (tip.textContent?.startsWith("欢迎来到")) {
    tip.firstChild!.textContent = "This is the beginning of #"
    tip.removeChild(tip.childNodes[2])
    tip.childNodes[2].textContent = ". "
    tip.lastChild!.textContent = "You are witnessing history."
  }
});
