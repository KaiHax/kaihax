import CLASS_NAMES from "./CLASS_NAMES.json";

export default () => {
  const titles = Array.from(
    document.getElementsByClassName(CLASS_NAMES.userlist_grouptitle)
  );

  const online = titles.find((t) => t.innerText.startsWith("在线"));
  if (online) online.innerText = `Online ${online.innerText.split(" ")[1]}`;

  const offline = titles.find(t => t.innerText.startsWith("离线"));
  if (offline) offline.innerText = `Offline ${offline.innerText.split(" ")[1]}`;
};
