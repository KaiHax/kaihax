import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () =>
	patcher.observe(`.${CLASS_NAMES.userlist_grouptitle}`, (title) => {
		if (title.textContent?.startsWith("在线"))
			title.innerHTML = `Online ${title.textContent.split(" ")[1]}`;
		else if (title.textContent?.startsWith("离线"))
			title.innerHTML = `Offline ${title.textContent.split(" ")[1]}`;
	});
