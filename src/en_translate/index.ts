import constants from "./constants";
// @ts-expect-error
import dom from "./dom";

export default () => {
  const patches = [constants(), dom()];

  // @ts-expect-error
  return () => _.forEachRight(patches, (p) => p());
};
