import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const messageTimes = document.getElementsByClassName(CLASS_NAMES.msg_time);

  for (const elem of messageTimes) {
    if (elem.innerText.startsWith("今天 凌晨"))
      elem.innerText = `Early this morning at ${elem.innerText
        .split(" ")
        .slice(2)}`;
    else if (utils.startsNotAscii(elem.innerText)) {
      const replaced = elem.innerText
        .replaceAll("上午", "morning")
        .replaceAll("下午", "afternoon")
        .replaceAll("今天", "This")
        .replaceAll("昨天", "Yesterday");

      elem.innerText =
        replaced.split(" ").slice(0, -1).join(" ") +
        " at " +
        _.last(replaced.split(" "));
    }
  }
};
