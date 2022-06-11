import webpack from "./webpack";

const bothConstants = webpack.findByPropsAll("app_name");

const EN_APP_TITLE = "KAIHEI LA"

export default {
  React: webpack.findByProps("createElement"),
  // @ts-expect-error
  lodash: _,

  constantsCN: bothConstants.find(c => c.account_kaiheilatitle !== EN_APP_TITLE),
  constantsEN: bothConstants.find(c => c.account_kaiheilatitle === EN_APP_TITLE),
};
