import CLASS_NAMES from "./CLASS_NAMES.json"
import patcher from "../../patcher";

export default () => patcher.observe(`.${CLASS_NAMES.internet_fraud_tip}`, e => {
	if (e.textContent?.startsWith("聊"))
	e.firstChild!.textContent = "Please beware of internet scams in chat, click to learn how to avoid scams"
})