import chatbarPlaceholders from "./chatbarPlaceholders";
import memberListGroup from "./memberListGroup";
import messageTime from "./messageTime";
import scrollToBottom from "./scrollToBottom";
import nowFriends from "./nowFriends";
import pmWelcomeTips from "./pmWelcomeTips";
import tooltips from "./tooltips";
import menuText from "./menuText";
/*import inviteModal from "./inviteModal";
import searchInput from "./searchInput";*/

export default () => {
  const unpatches = [
    chatbarPlaceholders(),
    memberListGroup(),
    messageTime(),
    scrollToBottom(),
    nowFriends(),
    pmWelcomeTips(),
    tooltips(),
    menuText()/*,
    inviteModal(),
    searchInput(),*/
  ];

  return () => unpatches.forEach((p) => p());
};
