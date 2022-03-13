import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const elems = document.getElementsByClassName(CLASS_NAMES.search_input);

  for (const elem of elems)
    if (elem.firstChild.placeholder === "搜索")
      elem.firstChild.placeholder = "Search";
};
