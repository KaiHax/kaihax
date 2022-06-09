type Fiber = any;

function reactFiberWalker(node: Fiber, prop: string, goUp = false): Fiber {
  if (node.pendingProps?.[prop] !== undefined) return node;

  if (goUp) return reactFiberWalker(node.return, prop, goUp);

  if (node.child !== null) return reactFiberWalker(node.child, prop, goUp);

  if (node.sibling !== null) return reactFiberWalker(node.sibling, prop, goUp);
}

const getFiber = (node: Element): Fiber =>
  node[
    // @ts-expect-error
    Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))
  ];

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

const getComponentFromDom = async (className: string) => {
  let element: Element | undefined;

  while (!element) {
    element = document.getElementsByClassName(className)[0];
    await sleep(100);
  }

  const walk = (node: Fiber): Fiber =>
    typeof node.type === "function" ? node : walk(node.return);

  return walk(getFiber(element)).type;
};

// ascii will only take 7 bits, others will take two
const startsNotAscii = (text: string) => (text.charCodeAt(0) & 0xff80) > 0;

export default {
  reactFiberWalker,
  getFiber,
  sleep,
  getComponentFromDom,
  startsNotAscii,
};
