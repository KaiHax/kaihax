import chatbarPlaceholders from "./chatbarPlaceholders";
import inviteModal from "./inviteModal";
import memberListGroup from "./memberListGroup";
import menuText from "./menuText";
import messageTime from "./messageTime";
import nowFriends from "./nowFriends";
import scrollToBottom from "./scrollToBottom";
import searchInput from "./searchInput";
import tooltips from "./tooltips";
import welcomeTips from "./welcomeTips";

const translateElements = () => {
  chatbarPlaceholders();
  memberListGroup();
  messageTime();
  scrollToBottom();
  nowFriends();
  welcomeTips();
  tooltips();
  menuText()
  inviteModal()
  searchInput()
};

export default () => {
  // pain
  const interval = setInterval(translateElements, 500);

  return () => clearInterval(interval);
};
