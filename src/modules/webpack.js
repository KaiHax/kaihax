import webpackJsonp from "../webpackJsonp";

const getModules = () => webpackJsonp();

function findAll(filter) {
  const modules = getModules();
  let found = [];

  for (const mod in modules) {
    if (modules.hasOwnProperty(mod)) {
      const module = modules[mod].exports;

      if (module) {
        if (module.default && module.__esModule && filter(module.default))
          found.push(module.default);

        if (filter(module)) found.push(module);
      }
    }
  }

  return found;
}

const webpack = {
  find: (filter) => findAll(filter)[0],
  findAll,

  findByPropsAll: (...props) =>
    findAll((m) => props.every((p) => m[p] !== undefined)),
  findByProps: (...props) => webpack.findByPropsAll(...props)[0],

  findByNestedPropsAll: (...props) =>
    findAll((m) =>
      props.every((p) => Object.keys(m).some((k) => m[k]?.[p] !== undefined))
    ),
};

Object.defineProperty(webpack, "modules", {
  configurable: false,
  enumerable: true,
  get: getModules,
})

export default webpack;
