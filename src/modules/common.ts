import webpack from "./webpack";

const bothConstants = webpack.findByPropsAll("app_name");

const EN_APP_TITLE = "KAIHEI LA"

export default {
  React: webpack.findByProps("createElement"),
  ReactDOM: webpack.findByProps("hydrate"),
  ReactCSS: webpack.findByProps("ReactCSS"),
  SdpTransform: webpack.findByProps("parseSimulcastStreamList"),
  ReactTooltip: webpack.find(m => m.a?.displayName === "ReactTooltip")?.a,
  MomentJS: webpack.findByProps("relativeTimeRounding"),
  AntV: webpack.findByProps("G2"),
  highlightjs: webpack.findByProps("highlightElement"),
  htmlParser2: webpack.findByProps("htmlparser2"),
  Ledap: webpack.findByProps("LedapVue"),
  pinyin: webpack.findByProps("STYLE_FIRST_LETTER"),
  pako: webpack.findByProps("deflateRaw"),
  // @ts-expect-error
  lodash: webpack.findByProps("curryRight") ?? _,

  constantsCN: bothConstants.find(c => c.account_kaiheilatitle !== EN_APP_TITLE),
  constantsEN: bothConstants.find(c => c.account_kaiheilatitle === EN_APP_TITLE),
};
