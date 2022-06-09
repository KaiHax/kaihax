import * as sr from "spitroast";

type MutationNode = HTMLElement | SVGElement;
type ObserverCb = (e: MutationNode) => void;
const observations = new Set<[string, ObserverCb]>();

const observer = new MutationObserver((records) => {
  // TODO: figure out if the addedNodes etc is or is not recursive

  // de-dupe to be sure
  const changedElems = new Set<MutationNode>();
  const changedChildren = new Set<MutationNode | Text>();

  for (const record of records) {
    changedElems.add(record.target as MutationNode);
    for (const e of record.addedNodes)
      changedChildren.add(e as MutationNode | Text);
    for (const e of record.removedNodes)
      changedChildren.add(e as MutationNode | Text);
  }

  for (const elem of changedElems)
    for (const [sel, cb] of observations) if (elem.matches(sel)) cb(elem);

  /*for (const elem of changedChildren)
    for (const [sel, cb] of observations)
      if (!(elem instanceof Text)) {
        if (elem.matches(sel)) cb(elem);*/
        /*for (const e of elem.querySelectorAll(sel))
          if (e instanceof HTMLElement || e instanceof SVGElement) cb(e);*/
      //}
});

// mutation observe the entire fking DOM LMAO
observer.observe(document.getElementById("root")!, {
  subtree: true,
  childList: true,
  attributes: true,
});

export default {
  ...sr,
  observe: (sel: string, cb: ObserverCb) => {
    const entry: [string, ObserverCb] = [sel, cb];
    observations.add(entry);
    return () => observations.delete(entry);
  },
  unobserve: () => {
    observations.clear();
    observer.disconnect();
  },
};
