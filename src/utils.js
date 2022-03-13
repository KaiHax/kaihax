function reactFiberWalker(node, prop, goUp = false) {
  if (node.pendingProps?.[prop] !== undefined) return node;

  if (goUp) return reactFiberWalker(node.return, prop, goUp);

  if (node.child !== null) return reactFiberWalker(node.child, prop, goUp);

  if (node.sibling !== null) return reactFiberWalker(node.sibling, prop, goUp);
}

const getFiber = (node) =>
  node[
    Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))
  ];

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const getComponentFromDom = async (className) => {
  let element;

  while (!element) {
    element = document.getElementsByClassName(className)[0];
    await sleep(100);
  }

  const walk = (node) =>
    typeof node.type === "function" ? node : walk(node.return);

  return walk(getFiber(element)).type;
};

// ascii will only take 7 bits, others will take two
const startsNotAscii = (text) => (text.charCodeAt() & 0xff80) > 0;

export default {
  reactFiberWalker,
  getFiber,
  sleep,
  getComponentFromDom,
  startsNotAscii,
};
