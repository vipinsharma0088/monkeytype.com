const esbuild = require("esbuild");
const { readdirSync, statSync } = require("fs");
const { join, extname } = require("path");

// Determine if the script should watch for changes
const isWatchMode = process.argv.includes("--watch");

// Recursive function to get all .ts files in a directory
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (extname(file) === ".ts") {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
};

// Get all TypeScript files from the src directory and subdirectories
const entryPoints = getAllFiles("./src");

// Function to generate output file names
const getOutfile = (entryPoint, format) => {
  const relativePath = entryPoint.replace("src/", "");
  const fileBaseName = relativePath.replace(".ts", "");
  return `./dist/${fileBaseName}.${format === "esm" ? "mjs" : "cjs"}`;
};

// Common build settings
const commonSettings = {
  bundle: true,
  sourcemap: true,
  minify: true,
};

// If watch mode is enabled, add the watch option
if (isWatchMode) {
  commonSettings.watch = {
    onRebuild(error, result) {
      if (error) {
        console.error("Watch build failed:", error);
      } else {
        console.log("Watch build succeeded:", result);
      }
    },
  };
}

// Build each file separately
entryPoints.forEach((entry) => {
  // ESM build
  esbuild
    .build({
      ...commonSettings,
      entryPoints: [entry],
      format: "esm",
      outfile: getOutfile(entry, "esm"),
    })
    .catch(() => process.exit(1));

  // CommonJS build
  esbuild
    .build({
      ...commonSettings,
      entryPoints: [entry],
      format: "cjs",
      outfile: getOutfile(entry, "cjs"),
    })
    .catch(() => process.exit(1));
});

console.log(isWatchMode ? "Watching for changes..." : "Build complete.");
