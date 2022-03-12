import constants from "./constants";
import dom from "./dom";

export default () => {
  const patches = [constants(), dom()];

  return () => _.forEachRight(patches, (p) => p());
};
