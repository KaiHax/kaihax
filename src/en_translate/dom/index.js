import chatbarPlaceholders from "./chatbarPlaceholders";
import memberListGroup from "./memberListGroup";
import messageTime from "./messageTime";
import scrollToBottom from "./scrollToBottom";

const translateElements = () => {
  chatbarPlaceholders();
  memberListGroup();
  messageTime();
  scrollToBottom();
};

export default () => {
  // pain
  const interval = setInterval(translateElements, 500);

  return () => clearInterval(interval);
};
