import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () => patcher.observe(`.${CLASS_NAMES.scroll_bottom_tips}`, (bar) => {
	if (bar.firstChild)
		bar.firstChild.textContent = "You're viewing old messages";
	if (bar.lastChild)
		bar.lastChild.textContent = "Jump to present";
})