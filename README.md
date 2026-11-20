# GoliathWeb

Static sites for Goliath Research Inc, in one repository. Each site builds on its own. `sites/www` is published to GitHub Pages. `sites/app`, `sites/omics`, `sites/crop`, `sites/factory`, and `sites/realty` in this repository are not published. This repository does not change DNS.

| Host | Directory | What it is |
| --- | --- | --- |
| [www.goliathresearch.com](https://www.goliathresearch.com) | `sites/www` | Global company site. Published from this repository. |
| [app.goliathresearch.com](https://app.goliathresearch.com) | (platform host, not this repo) | Live GoliathApp operator portal. Linked from www. |
| [omics.goliathresearch.com](https://omics.goliathresearch.com) | (platform host, not this repo) | Live GoliathOmics operator portal on the shared platform host. Linked from www. |
| crop / factory / realty | `sites/crop`, `sites/factory`, `sites/realty` | Unpublished placeholders in this repo. Those hostnames are not live and are not linked from www. |

`sites/app` and `sites/omics` remain unpublished static summaries in this repository. They are not the operator portals. Live application hosts are listed once in `packages/catalog/src/live-apps.ts` and rendered on www (header, footer, `/apps/`, and the products section). Add a child app to that list only when its host actually responds.

Documentation sites for the products themselves publish from each product repository (for example <https://goliath-research.github.io/GoliathApp/> and <https://goliath-research.github.io/GoliathOmics/>).

[academy.goliathresearch.com](https://academy.goliathresearch.com) stays on the academy host. This repo only links to it.

The generator is [Astro](https://astro.build/). Each site emits a static `dist/` directory. Shared chrome and type live in `packages/ui`. Product manifest loading lives in `packages/catalog` and is used only by `sites/www`.

## Layout

```text
packages/catalog/    fetch and validate .goliath/product.json
packages/ui/         shared layout, header, footer, and CSS
sites/www/           company site
sites/app/           platform-site placeholder
sites/omics/         omics-site placeholder
sites/crop/          crop-site placeholder
sites/factory/       factory-site placeholder
sites/realty/        realty-site placeholder
```

npm workspaces install from the repository root. A host must run the build there. Setting the project root to `sites/www` skips the lockfile and the shared packages.

## Company site

`sites/www` positions **Goliath Research Inc.** as an independent applied software and education company operating since 2021, clearly distinguishing the company from its live educational offering and its software platform initiative:

- **Company Overview (`/`)**: Presents the central message (*"Goliath Research combines practical data-science education with applied software development"*), two primary pathways (*Learn with Goliath Research Academy* and *Build with Goliath Research*), and all offerings grouped clearly by status (**Available Today**, **In Active Development / Pilot Ready**, and **Under Development / Planned**).
- **Goliath Research Academy (`/academy/`)**: Details the notebook-based teaching approach (concise theory and e-books, executable Jupyter notebooks, real-world examples, self-paced and instructor-assisted options) and core courses (Practical Python, Computational Statistics, Supervised Learning, Unsupervised & Deep Learning), linking to https://academy.goliathresearch.com.
- **Technology & Platform Initiative (`/technology/` and `/platform/`)**: Describes **GoliathApp** (role-based access control, workflow engine, semantic schemas, user-defined actions, distributed workers), includes a build-time demonstration from `@goliath/semantic`, highlights **GoliathOmics** (`/omics/`) and **GoliathGroundStation** as concrete validation applications, and shows a full development status table across the stack.
- **Partnerships & Pilots (`/partnerships/` and `/custom-development/`)**: Outlines collaboration tracks for **Education Partners** (course delivery, institutional licensing, student projects), **Research Partners** (workflow validation on GoliathApp and GoliathOmics), and **Industry Partners** (focused operational pilots and custom development).

Technical product pages under `/products/<id>/` are generated at build time from the public `main` branch of:

- Goliath-Research/GoliathApp
- Goliath-Research/GoliathOmics
- Goliath-Research/GoliathGroundStation
- Goliath-Research/GoliathCrop
- Goliath-Research/GoliathFactory
- Goliath-Research/GoliathRealty
- Goliath-Research/GoliathAlign
- Goliath-Research/GoliathExtractor

For each repository the build reads `.goliath/product.json` and `.goliath/product.schema.json`, checks the document against that schema, and requires `schemaVersion` 1. The fields used on the page are `id`, `name`, `tagline`, `description`, `category`, `features`, `links` (`repository`, `docs`, `website`), `related`, `dependsOn`, `license`, and `status`.

`dependsOn` is the hierarchy. GoliathApp is the top and does not name products that use it. GoliathOmics depends on GoliathApp, GoliathAlign, and GoliathExtractor. GoliathGroundStation, GoliathCrop, GoliathFactory, and GoliathRealty depend on GoliathApp only. GoliathAlign and GoliathExtractor are standalone and do not depend on GoliathApp or GoliathOmics. GoliathAlign is ready and working for linear and pangenome alignment on NVIDIA and AMD platforms, with continuous development to implement additional features and expand to other platforms. GoliathExtractor is a performance-optimized fork of MethylDackel, focused on extraction. A page’s “Used by” list is computed from other manifests; it is not a field those upstream products declare.

All six repositories are public, open source, and documented with MkDocs. The manifests do not yet link a published docs site. Product pages link the MkDocs source in the repository until GitHub Pages for those docs exists.

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

Dev ports: www `4321`, app `4322`, omics `4323`, crop `4324`, factory `4325`, realty `4326`. Build output:

- `sites/www/dist`
- `sites/app/dist`
- `sites/omics/dist`
- `sites/crop/dist`
- `sites/factory/dist`
- `sites/realty/dist`

`app`, `omics`, `crop`, `factory`, and `realty` do not fetch product manifests. `www` fails the build if a manifest is missing or invalid.

## Continuous integration

`.github/workflows/ci.yml` installs, validates the six manifests, lints, tests, typechecks, and builds all four sites. It does not deploy.

## Publishing www

`.github/workflows/pages.yml` builds `@goliath/www` and deploys `sites/www/dist` to GitHub Pages on every push to `main`, and when the workflow is run by hand. It does not build or deploy `sites/app`, `sites/omics`, `sites/crop`, `sites/factory`, or `sites/realty`. Pages on this repository is already set to GitHub Actions. The workflow does not change that setting.

`sites/www` is built for the custom domain at the root:

- `site`: `https://www.goliathresearch.com`
- `base`: `/`

Asset URLs are root paths such as `/_astro/...`. They match `https://www.goliathresearch.com/`. They do not match the project URL `https://goliath-research.github.io/GoliathWeb/` until the custom domain below is saved. The workflow does not use `actions/configure-pages`, which would rewrite `base` to `/GoliathWeb/`.

`sites/www/public/CNAME` is copied into the build as `sites/www/dist/CNAME` and contains one line, `www.goliathresearch.com`. A `CNAME` file in an Actions artifact is ignored. The custom domain is set in the repository settings.

The www build needs outbound HTTPS to `https://raw.githubusercontent.com`. Do not add a token.

This repository's Pages site publishes only `www.goliathresearch.com`. `app.goliathresearch.com` and `omics.goliathresearch.com` are live operator portals served by the GoliathApp platform host, not by this repository. `crop.goliathresearch.com`, `factory.goliathresearch.com`, and `realty.goliathresearch.com` are not live and are not linked from www. One GitHub repository has one Pages site and one custom domain. Leave `academy.goliathresearch.com` where it is.

### DNS

David adds this record at the DNS host for `goliathresearch.com`. This repository does not change DNS.

| Type | Name | Target |
| --- | --- | --- |
| CNAME | `www` | `goliath-research.github.io` |

Then, on `Goliath-Research/GoliathWeb`, open Settings → Pages:

1. Custom domain: `www.goliathresearch.com`
2. Enforce HTTPS
