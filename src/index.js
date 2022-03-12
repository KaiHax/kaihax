import webpack from "./modules/webpack";
import common from "./modules/common";
import patcher from "./patcher";
import en_translate from "./en_translate";

if (window.kaihax) {
  console.error("Kaihax already loaded");
} else {
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
    uninject: () => {
      patcher.cleanupAll();
      untranslate();
      delete window.kaihax;
    },
  };

  console.log("Kaihax loaded");
}
