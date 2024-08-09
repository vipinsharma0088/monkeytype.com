import { defineConfig } from "vite";
import { node } from "@liuli-util/vite-plugin-node";
import { viteStaticCopy } from "vite-plugin-static-copy";

const base = {
  plugins: [
    node({
      formats: ["cjs"],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "./static",
          dest: "./",
        },
      ],
    }),
  ],
  define: {
    __STATICDIR__: JSON.stringify(__dirname + "/static"),
    __BACKENDDIR__: JSON.stringify(__dirname),
  },
};

export default defineConfig(({ command }) => {
  if (command === "build") {
    return {
      ...base,
      define: {
        __STATICDIR__: JSON.stringify(__dirname + "/dist/static"),
        __BACKENDDIR__: JSON.stringify(__dirname),
      },
    };
  } else {
    return base;
  }
});
