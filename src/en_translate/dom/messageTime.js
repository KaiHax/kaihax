import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const messageTimes = document.getElementsByClassName(CLASS_NAMES.msg_time);

  for (const elem of messageTimes) {
    if (elem.innerText.startsWith("今天 下午"))
      elem.innerText = `This afternoon at ${elem.innerText
        .split(" ")
        .slice(2)}`;
      
    // TODO: MORE TIMES
  }
};
