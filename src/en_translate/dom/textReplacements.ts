import REPLACEMENTS from "./REPLACES.json";
import patcher from "../../patcher";

export default () => {
	const patches = Object.keys(REPLACEMENTS).map(k => patcher.observe(k, (elem) => {
		for (const match in REPLACEMENTS[k as keyof typeof REPLACEMENTS])
			if (elem.textContent === match)
				elem.innerHTML = (REPLACEMENTS[k as keyof typeof REPLACEMENTS] as Record<string, string>)[match];
	}));

	return () => patches.forEach(p => p());
}