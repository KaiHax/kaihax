import TOOLTIPS from "./TOOLTIPS.json";

const simpleTooltips = {};
const regexTooltips = [];

for (const key in TOOLTIPS) {
  const replacement = TOOLTIPS[key];

  if (key.startsWith("REGEX_"))
    regexTooltips.push([new RegExp(key.substr(6), "g"), replacement]);
  else simpleTooltips[key] = replacement;
}

const matchTooltip = (tip) => {
  if (simpleTooltips[tip]) return simpleTooltips[tip];

  for (const [match, replacement] of regexTooltips)
    if (tip.match(match)?.[0] === tip)
      return tip.replaceAll(match, replacement);
};

export default () => {
  const elems = document.querySelectorAll("[data-tip]");

  for (const elem of elems)
    elem.dataset.tip = matchTooltip(elem.dataset.tip) ?? elem.dataset.tip;
};
