import CategoriesContent from "./CategoriesContent";

export const metadata = {
  title: "Shop by Category",
  description:
    "Browse all categories at Adventures Bookshop — books, stationery, art materials, school supplies, technology and more. Find exactly what you need, delivered in Nairobi.",
  keywords: [
    "bookshop",
    "books",
    "book categories kenya",
    "school supplies categories",
    "stationery nairobi",
    "art materials kenya",
    "kids books nairobi",
    "college books kenya",
  ],
  alternates: {
    canonical: "https://adventuresbookshop.org/categories",
  },
  openGraph: {
    title: "Shop by Category | Adventures Bookshop",
    description:
      "Explore all product categories at Adventures Bookshop — Nairobi's trusted bookstore on Mfangano Street.",
    url: "https://adventuresbookshop.org/categories",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}