/**
 * Live application hosts linked from the company site.
 *
 * Add a child app here when its <id>.goliathresearch.com host is actually
 * responding. Do not add reserved or planned hostnames (crop, factory, realty,
 * and similar) until they are live. Header nav, the /apps/ page, the products
 * section, and product pages all read this list.
 */
export type LiveApp = {
  /** Product manifest id, for example goliathapp. */
  id: string;
  name: string;
  /** Public hostname, no scheme. */
  host: string;
  /** Absolute https URL. */
  href: string;
  /** Short label for the site header. */
  navLabel: string;
  description: string;
};

export const liveApps: readonly LiveApp[] = [
  {
    id: "goliathapp",
    name: "GoliathApp",
    host: "app.goliathresearch.com",
    href: "https://app.goliathresearch.com",
    navLabel: "App",
    description:
      "GoliathApp operator portal (platform host). Signed-in routes under /app are how operators visualize, create, edit, and manage workflows, actions, domain programs, and the Meta model.",
  },
  {
    id: "goliathomics",
    name: "GoliathOmics",
    host: "omics.goliathresearch.com",
    href: "https://omics.goliathresearch.com",
    navLabel: "Omics",
    description:
      "GoliathOmics operator portal on the shared GoliathApp platform host. Child-app classes, programs, and site parameters are seeded by GoliathOmics and edited in the generic editors.",
  },
] as const;

export function liveAppFor(productId: string): LiveApp | undefined {
  return liveApps.find((app) => app.id === productId);
}

export function liveAppNavItems(): { href: string; label: string }[] {
  return liveApps.map((app) => ({ href: app.href, label: app.navLabel }));
}
