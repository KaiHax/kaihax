import utils from "../../utils";
import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

// TODO: change either this class or fix the observer so this hits
export default () => patcher.observe(`.${CLASS_NAMES.msg_time}`, (elem) => {
  debugger;
  if (elem.textContent?.startsWith("今天 凌晨"))
    elem.innerHTML = `Early this morning at ${elem.textContent
      .split(" ")
      .slice(2)}`;
  else if (elem.textContent && !elem.textContent.includes("at")) {
    const replaced = elem.textContent
      .replaceAll("上午", "morning")
      .replaceAll("中午", "midday")
      .replaceAll(" 凌晨", "early morning")
      .replaceAll("下午", "afternoon")
      .replaceAll("今天", "This")
      .replaceAll("昨天", "Yesterday")
      .replaceAll("星期四", "Thursday")
      .replaceAll("星期三", "Wednesday")
      // TODO: more weekdays
      .replaceAll(/(\d{4})年(\d{2})月(\d{2})日/g, "$1-$2-$3 in the ");

    const part1 = replaced.split(" ").slice(0, -1).join(" ");
    // @ts-expect-error lodash moment
    const part2 = _.last(replaced.split(" "));
    elem.innerHTML = `${part1} at ${part2}`;
  }
});
