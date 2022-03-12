import webpack from "./modules/webpack";
import common from "./modules/common";
import Patcher from "simian";

if (window.kaihax) {
  console.error("Kaihax already loaded");
} else {
  const patcher = new Patcher("Kaihax");

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
      delete window.kaihax;
    },
  };

  console.log("Kaihax loaded");
}
