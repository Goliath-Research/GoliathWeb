import { liveAppNavItems, liveApps } from "@goliath/catalog";
import { brand } from "@goliath/ui/brand";
import type { FooterLink, NavItem } from "@goliath/ui/types";

export const nav: NavItem[] = [
  { href: "/academy/", label: "Academy" },
  { href: "/technology/", label: "Technology" },
  { href: "/partnerships/", label: "Partnerships" },
  { href: "/products/", label: "Products" },
  { href: "/apps/", label: "Apps" },
  { href: "/deployments/", label: "Deployments" },
  { href: "/contact/", label: "Contact" },
  ...liveAppNavItems(),
];

export const footerLinks: FooterLink[] = [
  { href: "/academy/", label: "Academy" },
  { href: brand.academy, label: "academy.goliathresearch.com" },
  { href: "/technology/", label: "Technology" },
  { href: "/partnerships/", label: "Partnerships" },
  { href: "/products/", label: "Products" },
  { href: "/apps/", label: "Apps" },
  ...liveApps.map((app) => ({ href: app.href, label: app.host })),
  { href: brand.github, label: "GitHub" },
  { href: "/contact/", label: "Contact" },
  { href: brand.contactMailto, label: brand.contactEmail },
];
