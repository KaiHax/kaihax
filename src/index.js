import webpack from "./modules/webpack";
import common from "./modules/common";
import patcher from "./patcher";
import en_translate from "./en_translate";
import utils from "./utils";

if (window.kaihax) {
  console.log("Kaihax already loaded, uninjecting first");
  kaihax.uninject();
}

const untranslate = en_translate();

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
    patcher.cleanupAll();
    untranslate();
    delete window.kaihax;
  },
};

console.log("Kaihax loaded");
