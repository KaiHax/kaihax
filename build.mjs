import esbuild from "esbuild";
import fs from "fs/promises";

try {
  await esbuild.build({
    entryPoints: ["./src/index.js"],
    outfile: "./dist/build.js",
    minify: false,
    bundle: true,
    format: "iife",
    //external: ["react"],
    target: ["esnext"],
  });

  await fs.appendFile("./dist/build.js", `//# sourceURL=Kaihax`);
  console.log("Build successful!");
} catch (err) {
  console.error(err);
  process.exit(1);
}
