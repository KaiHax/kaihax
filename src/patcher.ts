import * as sr from "spitroast";

const observations = new Set<[string, (e: Element) => void]>();

const observer = new MutationObserver((records) => {
  // de-dupe to be sure
  const changedElems = new Set<Element>();

  for (const record of records) {
    const elem =
      record.type === "characterData"
        ? record.target.parentElement
        : (record.target as Element); // TS trol

    if (elem) changedElems.add(elem);
  }

  for (const elem of changedElems)
    for (const [sel, cb] of observations) if (elem.matches(sel)) cb(elem);
});

// mutation observe the entire fking DOM LMAO
// TODO: make sure this id is correct
observer.observe(document.getElementById("root")!, {
  subtree: true,
  childList: true,
  characterData: true,
});

export default {
  ...sr,
  observe: (cb: (e: Element) => void, sel: string) =>
    observations.add([sel, cb]),
  unobserve: () => {
    observations.clear();
    observer.disconnect();
  },
};
