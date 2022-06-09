import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () =>
  patcher.observe(`.${CLASS_NAMES.richeditor_placeholders}`, (elem) => {
    if (!elem.textContent?.startsWith("给"))
      return;

    const fiber = utils.getFiber(elem);

    const chatInfo = utils.reactFiberWalker(
      fiber,
      "currentChat",
      true
    )?.pendingProps;

    const channelName =
      chatInfo.currentChannelInfo.name ??
      chatInfo.currentChat.target_info?.nickname;

    elem.innerHTML = `Send a message to ${channelName}`;
  });
