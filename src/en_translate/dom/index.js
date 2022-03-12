import chatbarPlaceholders from "./chatbarPlaceholders";

const translateElements = () => {
  chatbarPlaceholders();
};

export default () => {
  // pain
  const interval = setInterval(translateElements, 500);
  
  return () => clearInterval(interval);
};
