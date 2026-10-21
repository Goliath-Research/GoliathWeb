import { brand } from "@goliath/ui/brand";
import type { FooterLink, NavItem } from "@goliath/ui/types";

export const nav: NavItem[] = [
  { href: brand.academy, label: "Academy" },
  { href: "/platform/", label: "Platform" },
  { href: "/omics/", label: "Omics" },
  { href: "/custom-development/", label: "Custom development" },
  { href: "/products/", label: "Products" },
  { href: "/deployments/", label: "Deployments" },
];

export const footerLinks: FooterLink[] = [
  { href: brand.academy, label: "Academy" },
  { href: "/products/", label: "Products" },
  { href: brand.github, label: "GitHub" },
  { href: "/contact/", label: "Contact" },
  { href: brand.contactMailto, label: brand.contactEmail },
  { href: brand.hosts.app, label: "app.goliathresearch.com" },
  { href: brand.hosts.omics, label: "omics.goliathresearch.com" },
];
