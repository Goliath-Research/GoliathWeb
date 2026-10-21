export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductLinks {
  repository: string;
  docs: string | null;
  website: string | null;
}

export interface ProductSource {
  owner: string;
  repo: string;
  ref: string;
}

export interface Product {
  schemaVersion: 1;
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  features: ProductFeature[];
  links: ProductLinks;
  related: string[];
  dependsOn: string[];
  license: string;
  status: string;
  source: ProductSource;
}
