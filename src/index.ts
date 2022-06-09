import webpack from "./modules/webpack";
import common from "./modules/common";
import patcher from "./patcher";
import en_translate from "./en_translate";
import utils from "./utils";

// @ts-expect-error
if (window.kaihax) {
  console.log("Kaihax already loaded, uninjecting first");
  // @ts-expect-error
  kaihax.uninject();
}

const untranslate = en_translate();

// @ts-expect-error
window.kaihax = {
  modules: {
    webpack,
    common,
  },
  patcher: {
    after: patcher.after,
    before: patcher.before,
    instead: patcher.instead,
  },
  utils,
  uninject: () => {
    patcher.unpatchAll();
    untranslate();
    // @ts-expect-error
    delete window.kaihax;
  },
};

console.log("Kaihax loaded");
