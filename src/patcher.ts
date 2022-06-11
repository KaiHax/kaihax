import * as sr from "spitroast";

type MutationNode = HTMLElement | SVGElement;
type ObserverCb = (e: MutationNode) => void;
const observations = new Set<[string, ObserverCb]>();

const observer = new MutationObserver((records) => {
	// de-dupe to be sure
	const changedElems = new Set<MutationNode>();

	for (const record of records)
		changedElems.add(record.target as MutationNode);

	for (const elem of changedElems)
		for (const [sel, cb] of observations) {
			if (elem.matches(sel)) cb(elem);
			elem.querySelectorAll(sel).forEach(e => (e instanceof HTMLElement || e instanceof SVGElement) && cb(e));
		}
});

// mutation observe the entire fking DOM LMAO
observer.observe(document.body, {
  subtree: true,
  childList: true,
  attributes: true,
})

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
