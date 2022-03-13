import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const placeholder = document.getElementsByClassName(
    CLASS_NAMES.richeditor_placeholders
  )[0];

  if (!placeholder?.firstChild.textContent.startsWith("给")) return;

  placeholder.lastChild.textContent = `Enter to send`;

  placeholder.firstChild.dataset.kaihaxenglish = "";

  const fiber = utils.getFiber(placeholder.firstChild);

  const chatInfo = utils.reactFiberWalker(
    fiber,
    "currentChat",
    true
  )?.pendingProps;

  const channelName =
    chatInfo.currentChannelInfo.name ?? chatInfo.currentChat.target_info?.nickname;

  placeholder.firstChild.textContent = `Send a message to ${channelName}`;
};
