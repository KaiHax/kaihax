import webpack from "./webpack";

const bothConstants = webpack.findByPropsAll("app_name");

const EN_APP_NAME = "Kaiheila"

export default {
  React: webpack.findByProps("createElement"),
  // @ts-expect-error
  lodash: _,

  constantsCN: bothConstants.find(c => c.app_name !== EN_APP_NAME),
  constantsEN: bothConstants.find(c => c.app_name === EN_APP_NAME),
};
