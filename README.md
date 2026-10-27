# GoliathWeb

Static sites for Goliath Research Inc, in one repository. Each site builds on its own. `sites/www` is published to GitHub Pages. `sites/app` and `sites/omics` are not published. This repository does not change DNS.

| Host | Directory | What it is |
| --- | --- | --- |
| [www.goliathresearch.com](https://www.goliathresearch.com) | `sites/www` | Global company site. Built now. |
| [app.goliathresearch.com](https://app.goliathresearch.com) | `sites/app` | GoliathApp platform site. Placeholder. |
| [omics.goliathresearch.com](https://omics.goliathresearch.com) | `sites/omics` | GoliathOmics site. Placeholder. |

[academy.goliathresearch.com](https://academy.goliathresearch.com) stays on the academy host. This repo only links to it.

The generator is [Astro](https://astro.build/). Each site emits a static `dist/` directory. Shared chrome and type live in `packages/ui`. Product manifest loading lives in `packages/catalog` and is used only by `sites/www`.

## Layout

```text
packages/catalog/    fetch and validate .goliath/product.json
packages/ui/         shared layout, header, footer, and CSS
sites/www/           company site
sites/app/           platform-site placeholder
sites/omics/         omics-site placeholder
```

npm workspaces install from the repository root. A host must run the build there. Setting the project root to `sites/www` skips the lockfile and the shared packages.

## Company site

`sites/www` describes the company in five parts:

1. Academy, linking to https://academy.goliathresearch.com
2. GoliathApp: role-based access control, workflow engine, user-defined actions, distributed workers
3. GoliathOmics: inherits GoliathApp and uses GoliathAlign, MethylExtractor, and process packs
4. GoliathGroundStation: launch-ops and ground-station monitoring on GoliathApp
5. Custom development

Product pages under `/products/<id>/` are generated at build time from the public `main` branch of:

- Goliath-Research/GoliathApp
- Goliath-Research/GoliathOmics
- Goliath-Research/GoliathGroundStation
- Goliath-Research/GoliathAlign
- Goliath-Research/MethylExtractor

For each repository the build reads `.goliath/product.json` and `.goliath/product.schema.json`, checks the document against that schema, and requires `schemaVersion` 1. The fields used on the page are `id`, `name`, `tagline`, `description`, `category`, `features`, `links` (`repository`, `docs`, `website`), `related`, `dependsOn`, `license`, and `status`.

`dependsOn` is the hierarchy. GoliathApp is the top and does not name products that use it. GoliathOmics depends on GoliathApp, GoliathAlign, and MethylExtractor. GoliathGroundStation depends on GoliathApp only. GoliathAlign and MethylExtractor are standalone and do not depend on GoliathApp or GoliathOmics. MethylExtractor is a performance-optimized fork of MethylDackel, focused on extraction. A page’s “Used by” list is computed from other manifests; it is not a field those upstream products declare.

All five repositories are public, open source, and documented with MkDocs. The manifests do not yet link a published docs site. Product pages link the MkDocs source in the repository until GitHub Pages for those docs exists.

`/deployments/` is reserved for real GoliathApp and GoliathOmics deployment write-ups, including the current GoliathOmics test setup (remote workers, gateway, database, and long-term storage). That example is not written here.

The previous hand-written hub (`index.html` and the old section directories) is removed. This repository root is no longer the website.

## Local commands

Requires Node.js 22.23.4 or newer and outbound HTTPS to `raw.githubusercontent.com` for the company-site build. No tokens and no secrets.

```bash
npm ci
npm run validate:products
npm run lint
npm run test
npm run check
npm run build
```

One site:

```bash
npm run build --workspace @goliath/www
npm run dev --workspace @goliath/www
```

Dev ports: www `4321`, app `4322`, omics `4323`. Build output:

- `sites/www/dist`
- `sites/app/dist`
- `sites/omics/dist`

`app` and `omics` do not fetch product manifests. `www` fails the build if a manifest is missing or invalid.

## Continuous integration

`.github/workflows/ci.yml` installs, validates the five manifests, lints, tests, typechecks, and builds all three sites. It does not deploy.

## Publishing www

`.github/workflows/pages.yml` builds `@goliath/www` and deploys `sites/www/dist` to GitHub Pages on every push to `main`, and when the workflow is run by hand. It does not build or deploy `sites/app` or `sites/omics`. Pages on this repository is already set to GitHub Actions. The workflow does not change that setting.

`sites/www` is built for the custom domain at the root:

- `site`: `https://www.goliathresearch.com`
- `base`: `/`

Asset URLs are root paths such as `/_astro/...`. They match `https://www.goliathresearch.com/`. They do not match the project URL `https://goliath-research.github.io/GoliathWeb/` until the custom domain below is saved. The workflow does not use `actions/configure-pages`, which would rewrite `base` to `/GoliathWeb/`.

`sites/www/public/CNAME` is copied into the build as `sites/www/dist/CNAME` and contains one line, `www.goliathresearch.com`. A `CNAME` file in an Actions artifact is ignored. The custom domain is set in the repository settings.

The www build needs outbound HTTPS to `https://raw.githubusercontent.com`. Do not add a token.

`app.goliathresearch.com` and `omics.goliathresearch.com` stay unpublished. One GitHub repository has one Pages site and one custom domain, so those two hostnames need a separate host when they are ready. Leave `academy.goliathresearch.com` where it is.

### DNS

David adds this record at the DNS host for `goliathresearch.com`. This repository does not change DNS.

| Type | Name | Target |
| --- | --- | --- |
| CNAME | `www` | `goliath-research.github.io` |

Then, on `Goliath-Research/GoliathWeb`, open Settings → Pages:

1. Custom domain: `www.goliathresearch.com`
2. Enforce HTTPS
