import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.goliathresearch.com",
  base: "/",
  trailingSlash: "always",
  integrations: [sitemap()],
  redirects: {
    "/products/methylextractor/": "/products/goliath-extractor/",
  },
});
