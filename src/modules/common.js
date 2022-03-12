import webpack from "./webpack";

export default {
  React: webpack.findByProps("createElement"),
  lodash: _,
};
