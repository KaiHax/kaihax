import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () =>
  patcher.observe(`.${CLASS_NAMES.empty_channel}`, (emptyChannel) => {
    emptyChannel.getElementsByClassName(
      CLASS_NAMES.empty_channel_title
    )[0].innerHTML = "Welcome to the server";

    for (const desc of emptyChannel.getElementsByClassName(
      CLASS_NAMES.guide_desc
    )) {
      if (desc.textContent?.startsWith("使用即时邀请"))
        desc.innerHTML = "Invite your friends in one click.";
      else if (desc.textContent?.startsWith("扫码下载"))
        desc.innerHTML =
          "Scan the QR code to download the Kaiheila app to chat with your friends anytime, anywhere.";
      else if (desc.textContent?.startsWith("遇到问题"))
        desc.innerHTML =
          "Have an issue? View the support pages or get in touch with our support team.";
    }
  });
