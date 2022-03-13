import MENU_TEXTS from "./MENU_TEXTS.json";
import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const menuItems = document.getElementsByClassName(CLASS_NAMES.menu_text);

  for (const menuItem of menuItems)
    if (menuItem.firstElementChild)
      menuItem.firstElementChild.innerText =
        MENU_TEXTS[menuItem.firstElementChild.innerText] ??
        menuItem.firstElementChild.innerText;
    else
      menuItem.innerText = MENU_TEXTS[menuItem.innerText] ?? menuItem.innerText;
};
