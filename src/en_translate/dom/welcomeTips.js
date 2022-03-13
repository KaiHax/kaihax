import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const tip = document.getElementsByClassName(CLASS_NAMES.welcome_tip)[0];

  if (!tip || !utils.startsNotAscii(tip.innerText)) return;

  if (tip.innerText.startsWith("这里是你与")) {
    const userName = utils.reactFiberWalker(
      utils.getFiber(tip),
      "currentChat",
      true
    )?.pendingProps.currentChat.target_info.nickname;

    tip.innerText = `This is the beginning of your PMs with @${userName}.`;
  }
  else if (tip.innerText.startsWith("欢迎来到")) {
    tip.firstChild.textContent = "This is the beginning of #"
    tip.removeChild(tip.childNodes[2])
    tip.childNodes[2].textContent = ". "
    tip.lastChild.innerText = "You are witnessing history."
  }
};
