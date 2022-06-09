import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

// TODO: change either this class or fix the observer so this hits
export default () => patcher.observe(`.${CLASS_NAMES.msg_time}`, (elem) => {
  if (elem.textContent?.startsWith("今天 凌晨"))
    elem.innerHTML = `Early this morning at ${elem.textContent
      .split(" ")
      .slice(2)}`;
  else if (elem.textContent && utils.startsNotAscii(elem.textContent)) {
    const replaced = elem.textContent
      .replaceAll("上午", "morning")
      .replaceAll("下午", "afternoon")
      .replaceAll("今天", "This")
      .replaceAll("昨天", "Yesterday");

    const part1 = replaced.split(" ").slice(0, -1).join(" ");
    // @ts-expect-error lodash moment
    const part2 = _.last(replaced.split(" "));
    elem.innerHTML = `${part1} at ${part2}`;
  }
});
