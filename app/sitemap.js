import { productAPI, categoryAPI } from "../lib/api";

export default async function sitemap() {
  let products = [];
  let categories = [];

  try {
    const res = await productAPI.getAll();
    // Handle different response shapes
    products = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.results)
      ? res.data.results
      : [];
  } catch (err) {
    console.error("Sitemap: failed to fetch products", err);
  }

  try {
    const res = await categoryAPI.getCategoryHierarchy();
    categories = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.results)
      ? res.data.results
      : [];
  } catch (err) {
    console.error("Sitemap: failed to fetch categories", err);
  }

  const staticPages = [
    {
      url: "https://adventuresbookshop.org",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://adventuresbookshop.org/products",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://adventuresbookshop.org/categories",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const productPages = products.map((product) => ({
    url: `https://adventuresbookshop.org/products/${product.id}`,
    lastModified: product.updatedAt || product.updated_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `https://adventuresbookshop.org/products?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}