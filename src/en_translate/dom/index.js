import chatbarPlaceholders from "./chatbarPlaceholders";
import memberListGroup from "./memberListGroup";
import messageTime from "./messageTime";
import nowFriends from "./nowFriends";
import scrollToBottom from "./scrollToBottom";
import welcomeTips from "./welcomeTips";

const translateElements = () => {
  chatbarPlaceholders();
  memberListGroup();
  messageTime();
  scrollToBottom();
  nowFriends();
  welcomeTips();
};

export default () => {
  // pain
  const interval = setInterval(translateElements, 500);

  return () => clearInterval(interval);
};
