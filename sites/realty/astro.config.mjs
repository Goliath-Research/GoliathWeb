import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://realty.goliathresearch.com",
  trailingSlash: "always",
  integrations: [sitemap()],
});
