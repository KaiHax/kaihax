import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () =>
  patcher.observe(`.${CLASS_NAMES.search_input}`, (elem) => {
    if (
      elem.firstChild! instanceof HTMLInputElement &&
      elem.firstChild.placeholder === "搜索"
    )
      elem.firstChild.placeholder = "Search";
  });
