# GoliathWeb

Static sites for Goliath Research Inc, in one repository. Each site builds on its own. Nothing in this repo publishes a site or changes DNS.

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

`sites/www` describes the company in four parts:

1. Academy, linking to https://academy.goliathresearch.com
2. GoliathApp: role-based access control, workflow engine, user-defined actions, distributed workers
3. GoliathOmics: inherits GoliathApp and uses GoliathAlign, MethylExtractor, and process packs
4. Custom development

Product pages under `/products/<id>/` are generated at build time from the public `main` branch of:

- Goliath-Research/GoliathApp
- Goliath-Research/GoliathOmics
- Goliath-Research/GoliathAlign
- Goliath-Research/MethylExtractor

For each repository the build reads `.goliath/product.json` and `.goliath/product.schema.json`, checks the document against that schema, and requires `schemaVersion` 1. The fields used on the page are `id`, `name`, `tagline`, `description`, `category`, `features`, `links` (`repository`, `docs`, `website`), `related`, `dependsOn`, `license`, and `status`.

`dependsOn` is the hierarchy. GoliathApp is the top and does not name products that use it. GoliathOmics depends on GoliathApp, GoliathAlign, and MethylExtractor. GoliathAlign and MethylExtractor are standalone and do not depend on GoliathApp or GoliathOmics. MethylExtractor is a performance-optimized fork of MethylDackel, focused on extraction. A page’s “Used by” list is computed from other manifests; it is not a field those upstream products declare.

All four repositories are public, open source, and documented with MkDocs. The manifests do not yet link a published docs site. Product pages link the MkDocs source in the repository until GitHub Pages for those docs exists.

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

`.github/workflows/ci.yml` installs, validates the four manifests, lints, tests, typechecks, and builds all three sites. It does not deploy.

## Deploy later

David publishes each `dist/` directory on its own host. These steps are not wired up in CI, and this repo does not contain DNS records or a hosting config file.

Build from the repository root (Node.js 22.23.4 or newer, no environment variables):

```bash
npm ci && npm run build --workspace @goliath/www
npm ci && npm run build --workspace @goliath/app
npm ci && npm run build --workspace @goliath/omics
```

Publish `sites/www/dist`, `sites/app/dist`, and `sites/omics/dist` at the root of each hostname (`base` is `/`). The www build needs outbound HTTPS to `https://raw.githubusercontent.com` during the build. Do not add a token.

### Recommendation

Use **Cloudflare Pages on the free plan, three projects, one GitHub repository**. Cost is $0. The free plan includes unlimited sites, unlimited static bandwidth, 500 builds per month, one build at a time, and 100 custom domains per project. Static asset requests are not billed.

GitHub Pages is also $0, and it is the right place to publish **www alone** from this repository. One GitHub repository has one Pages site, and a Pages custom domain is a single hostname (`CNAME` holds one name). `www`, `app`, and `omics` cannot be three custom domains on that one site. Serving all three from GitHub Pages means two more repositories (one Pages site each) plus a publish step David adds later. That is still $0, and it splits the deploy away from this repo, so it is not the cheaper way to run three hostnames.

Netlify’s free tier can also host three sites from one repo. Cloudflare Pages is the recommendation: static bandwidth is unlimited, and three projects fit the free plan.

### Cloudflare Pages

Create three projects connected to `Goliath-Research/GoliathWeb`, or upload the `dist` folders by hand. Leave the root directory at the repository root.

| Project | Build command | Output directory | Custom domain, when DNS is ready |
| --- | --- | --- | --- |
| www | `npm ci && npm run build --workspace @goliath/www` | `sites/www/dist` | `www.goliathresearch.com` |
| app | `npm ci && npm run build --workspace @goliath/app` | `sites/app/dist` | `app.goliathresearch.com` |
| omics | `npm ci && npm run build --workspace @goliath/omics` | `sites/omics/dist` | `omics.goliathresearch.com` |

Production branch: `main`. Node.js version: 22.23.4 or newer. Do not set secrets. Connecting the Git repository makes Cloudflare build on later pushes; that is the publish step, and it is separate from the GitHub Actions workflow in this repo.

Leave `academy.goliathresearch.com` where it is.

### GitHub Pages, for www only

1. On `Goliath-Research/GoliathWeb`, open Settings → Pages.
2. Set the source to GitHub Actions.
3. Add a workflow David runs on purpose (do not add it to the CI workflow above) that uploads `sites/www/dist` with `actions/upload-pages-artifact` and deploys with `actions/deploy-pages`.
4. After the first deploy, set the custom domain to `www.goliathresearch.com` and follow GitHub’s DNS instructions.
5. For `app` and `omics`, either use the Cloudflare projects above or create two more repositories and publish those `dist` directories the same way.

Direct upload on Cloudflare (dashboard “Upload assets”, or `wrangler pages deploy sites/www/dist` after `npx wrangler login`) publishes one site without giving the host ongoing access to the repository. Repeat for `sites/app/dist` and `sites/omics/dist`.
