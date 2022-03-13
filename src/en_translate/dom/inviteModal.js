import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const inviteModal = document.getElementsByClassName(
    CLASS_NAMES.guild_invite_modal
  )[0];

  if (!inviteModal) return;

  const inviteModalTitle = inviteModal.getElementsByClassName(
    CLASS_NAMES.modal_title
  )[0];
  if (utils.startsNotAscii(inviteModalTitle.firstChild.textContent)) {
    const guildInfo = utils.reactFiberWalker(
      utils.getFiber(inviteModal),
      "guildInfo",
      true
    )?.pendingProps.guildInfo;

    inviteModalTitle.firstChild.textContent = `Invite users to join ${guildInfo.name}`;
  }

  inviteModal.getElementsByClassName(CLASS_NAMES.share_tips)[0].innerText =
    "Share this link, your friends can click to join";

  const inviteSetting = inviteModal.getElementsByClassName(CLASS_NAMES.invite_setting)[0];

  if (inviteSetting.firstChild.childNodes.length === 1) {
    inviteSetting.firstChild.textContent =
      "Your invite link will never expire. ";
  } else {
    const duration = inviteSetting.firstChild.childNodes[1];

    duration.textContent =
      duration.textContent
        .replaceAll("天", " days")
        .replaceAll("分钟", " minutes")
        .replaceAll("1个小时", "1 hour")
        .replaceAll("个小时", " hours");

    inviteSetting.firstChild.firstChild.textContent =
      "Your invite link will expire after ";
    inviteSetting.firstChild.lastChild.textContent = ".";
  }

  inviteSetting.lastChild.innerText = " Edit invite link";
};
