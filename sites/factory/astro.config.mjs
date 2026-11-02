import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://factory.goliathresearch.com",
  trailingSlash: "always",
  integrations: [sitemap()],
});
