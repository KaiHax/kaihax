import wpRequire from "../wpRequire";

const modules = wpRequire.c;

function findAll(filter: (m: any) => boolean) {
  let found = [];

  for (const mod in modules) {
    if (modules.hasOwnProperty(mod)) {
      const module = modules[mod].exports;

      if (module === globalThis) continue;

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
  wpRequire,
  modules,
  
  getModule: (m: any) => {
    for (const k in modules)
      if (modules[k].exports?.default === m || modules[k].exports === m)
        return modules[k];
  },

  find: (filter: (m: any) => boolean) => findAll(filter)[0],
  findAll,

  findByPropsAll: (...props: string[]) =>
    findAll((m) => props.every((p) => m[p] !== undefined)),
  findByProps: (...props: string[]) => webpack.findByPropsAll(...props)[0],

  findByNestedPropsAll: (...props: string[]) =>
    findAll((m) =>
      props.every((p) => Object.keys(m).some((k) => m[k]?.[p] !== undefined))
    ),

  findByCodeAll: (code: string | RegExp) =>
    Object.entries(wpRequire.m)
      .filter(([, m]) => (m as Function).toString().match(code))
      .map(([id]) => wpRequire.c[id]?.exports)
      .filter((m) => m),

  findByCode: (code: string | RegExp) => webpack.findByCodeAll(code)[0],
};

export default webpack;
