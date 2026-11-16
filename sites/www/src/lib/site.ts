import { brand } from "@goliath/ui/brand";
import type { FooterLink, NavItem } from "@goliath/ui/types";

export const nav: NavItem[] = [
  { href: "/academy/", label: "Academy" },
  { href: "/technology/", label: "Technology" },
  { href: "/partnerships/", label: "Partnerships" },
  { href: "/products/", label: "Products" },
  { href: "/deployments/", label: "Deployments" },
  { href: "/contact/", label: "Contact" },
];

export const footerLinks: FooterLink[] = [
  { href: "/academy/", label: "Academy" },
  { href: brand.academy, label: "academy.goliathresearch.com" },
  { href: "/technology/", label: "Technology" },
  { href: "/partnerships/", label: "Partnerships" },
  { href: "/products/", label: "Products" },
  { href: brand.github, label: "GitHub" },
  { href: "/contact/", label: "Contact" },
  { href: brand.contactMailto, label: brand.contactEmail },
];
