import chatbarPlaceholders from "./chatbarPlaceholders";
import memberListGroup from "./memberListGroup";
import messageTime from "./messageTime";
import scrollToBottom from "./scrollToBottom";
import nowFriends from "./nowFriends";
import pmWelcomeTips from "./pmWelcomeTips";
import tooltips from "./tooltips";
import inviteModal from "./inviteModal";
import searchInput from "./searchInput";
import fraud from "./fraud";
import serverWelcome from "./serverWelcome";
import textReplacements from "./textReplacements";

export default () => {
  const unpatches = [
    //chatbarPlaceholders(),
    //memberListGroup(),
    messageTime(),
    //scrollToBottom(),
    //nowFriends(),
    //pmWelcomeTips(),
    tooltips(),
    //inviteModal(),
    //searchInput(),
    //fraud(),
    //serverWelcome(),
    textReplacements(),
  ];

  return () => unpatches.forEach((p) => p());
};
