import chatbarPlaceholders from "./chatbarPlaceholders";
import memberListGroup from "./memberListGroup";
import messageTime from "./messageTime";
/*import inviteModal from "./inviteModal";
import menuText from "./menuText";
import nowFriends from "./nowFriends";
import scrollToBottom from "./scrollToBottom";
import searchInput from "./searchInput";
import tooltips from "./tooltips";
import welcomeTips from "./welcomeTips";*/

export default () => {
  const unpatches = [
    chatbarPlaceholders(),
    memberListGroup(),
    messageTime()/*,
    scrollToBottom(),
    nowFriends(),
    welcomeTips(),
    tooltips(),
    menuText(),
    inviteModal(),
    searchInput(),*/
  ];

  return () => unpatches.forEach((p) => p());
};
