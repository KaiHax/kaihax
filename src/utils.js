function reactFiberWalker(node, prop, goUp = false) {
  if (node.pendingProps?.[prop] !== undefined)
    return node;
  
  if (goUp)
    return reactFiberWalker(node.return, prop, goUp);
  
  if (node.child !== null)
    return reactFiberWalker(node.child, prop, goUp);
  
  if (node.sibling !== null)
    return reactFiberWalker(node.sibling, prop, goUp);
}

const getFiber = (node) => node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];

export default {
  reactFiberWalker,
  getFiber
}