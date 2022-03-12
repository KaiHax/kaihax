import CLASS_NAMES from "./CLASS_NAMES.json"

export default () => {
  const bar = document.getElementsByClassName(CLASS_NAMES.scroll_bottom_tips)[0];
  if (!bar) return;

  bar.firstChild.innerText = "You're viewing old messages";
  bar.lastChild.innerText = "Jump to present"
}