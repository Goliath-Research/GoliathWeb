import { loadProducts } from "@goliath/catalog";

const products = await loadProducts();
for (const product of products) {
  console.log(
    `${product.id}\t${product.source.repo}\tdependsOn=${product.dependsOn.join(",") || "-"}\tfeatures=${product.features.length}\tstatus=${product.status}`,
  );
}
console.log(`Validated ${products.length} product manifests.`);
