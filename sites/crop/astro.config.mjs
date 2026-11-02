import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://crop.goliathresearch.com",
  trailingSlash: "always",
  integrations: [sitemap()],
});
