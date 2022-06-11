import MENU_TEXTS from "./MENU_TEXTS.json";
import CLASS_NAMES from "./CLASS_NAMES.json";
import patcher from "../../patcher";

export default () =>
  patcher.observe(`.${CLASS_NAMES.menu_text},.${CLASS_NAMES.setting_item}`, (menuItem) => {
    if (menuItem.firstElementChild) {
      const replacement =
        MENU_TEXTS[
          menuItem.firstElementChild.textContent as keyof typeof MENU_TEXTS
        ];
      if (replacement) menuItem.firstElementChild.textContent = replacement;
    } else {
      const replacement =
        MENU_TEXTS[menuItem.textContent as keyof typeof MENU_TEXTS];
      if (replacement) menuItem.textContent = replacement;
    }
  });
