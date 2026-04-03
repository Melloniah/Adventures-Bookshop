import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export const metadata = {
  title: "All Products",  // becomes "All Products | Adventures Bookshop" automatically
  description:
    "Browse our full range of books, stationery, school supplies, art materials and technology at Adventures Bookshop. Quality products at affordable prices, delivered in Nairobi.",
  keywords: [
    "bookshop",
    "books",
    "stationery",
    "buy books nairobi",
    "school stationery kenya",
    "art supplies nairobi",
    "exercise books kenya",
    "affordable stationery nairobi",
  ],
  alternates: {
    canonical: "https://adventuresbookshop.org/products",
  },
  openGraph: {
    title: "All Products | Adventures Bookshop",
    description:
      "Browse books, stationery, school supplies and more at Adventures Bookshop — Nairobi's trusted bookstore.",
    url: "https://adventuresbookshop.org/products",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}