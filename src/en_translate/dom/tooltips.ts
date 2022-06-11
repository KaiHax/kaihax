import TOOLTIPS from "./TOOLTIPS.json";
import patcher from "../../patcher";

const simpleTooltips: Record<string, string> = {};
const regexTooltips: [RegExp, string][] = [];

for (const key in TOOLTIPS) {
  const replacement = TOOLTIPS[key as keyof typeof TOOLTIPS];

  if (!key.startsWith("REGEX_")) simpleTooltips[key] = replacement;
  else regexTooltips.push([new RegExp(key.slice(6), "g"), replacement]);
}

const matchTooltip = (tip: string) => {
  if (simpleTooltips[tip]) return simpleTooltips[tip];

  for (const [match, replacement] of regexTooltips)
    if (tip.match(match)?.[0] === tip)
      return tip.replaceAll(match, replacement);
};

export default () =>
  patcher.observe("[data-tip]", (elem) => {
    // matching against an already translated string and relying on that is slow
    // so add a manual check
    if (elem.dataset.tipEN) return;
    elem.dataset.tipEN = '0';

    const tip = matchTooltip(elem.dataset.tip!);
    if (tip) // prevent undefined tooltips
      elem.dataset.tip = tip;
  });
