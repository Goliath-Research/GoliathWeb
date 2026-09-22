# GoliathWeb

Public hub for Goliath Research Inc. It explains the academy, GoliathApp, GoliathOmics, and the open-source tools. It does not host courses or the omics portal.

Follows [SITE_HUB_WIREFRAME.md](https://github.com/Goliath-Research/GoliathApp/blob/main/docs/SITE_HUB_WIREFRAME.md).

## Preview

From this directory:

```bash
python3 -m http.server 8088
```

Open http://127.0.0.1:8088/

## Pages

| Path | Primary action |
|------|----------------|
| `/` | Go to Academy, and Open GoliathOmics (not live yet) |
| `/learn/` | Enter Academy → https://academy.goliathresearch.com |
| `/platforms/goliath-app/` | View on GitHub |
| `/platforms/goliath-omics/` | Portal button disabled; public repo is the live action |
| `/platforms/tools/` | mojo-align and MethylExtractor |
| `/open-source/` | GitHub organization |
| `/about/` | Contact us |
| `/contact/` | mailto:contact@goliathresearch.com |

Change the contact address in the HTML if the public mailbox is different.

## Deploy

Static files. Point `www.goliathresearch.com` here when DNS is ready. Leave `academy` on LearnWorlds. Leave `omics` unset until the portal moves.
