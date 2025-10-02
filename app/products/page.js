"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../lib/api";
import { getImageUrl, handleImageError, placeholderSVG } from "utils/imageUtils";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const router = useRouter();
const [searchInput, setSearchInput] = useState(searchTerm); 

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever category or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categorySlug) params.append("category", categorySlug);
        if (searchTerm) params.append("search", searchTerm);

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug, searchTerm]);

  const currentCategory = categories.find((cat) => cat.slug === categorySlug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentCategory ? currentCategory.name : "All Products"}
          </h1>
          {currentCategory?.description && (
            <p className="mt-2 text-gray-600">{currentCategory.description}</p>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Link
            href={`/products${searchTerm ? `?search=${searchTerm}` : ""}`}
            className={`px-4 py-2 rounded-lg ${
              !categorySlug
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}${searchTerm ? `&search=${searchTerm}` : ""}`}
              className={`px-4 py-2 rounded-lg ${
                categorySlug === cat.slug
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

         <div className="mb-6">
  <input
    type="text"
    placeholder="Search products..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        // Update URL with current category + search term
        const params = new URLSearchParams();
        if (categorySlug) params.append("category", categorySlug);
        if (searchInput.trim()) params.append("search", searchInput.trim());
        router.push(`/products?${params.toString()}`);
      }
    }}
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
  />
</div>
        
        <button
  onClick={() => {
    const params = new URLSearchParams();
    if (categorySlug) params.append("category", categorySlug);
    if (searchInput.trim()) params.append("search", searchInput.trim());
    router.push(`/products?${params.toString()}`);
  }}
  className="ml-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
>
  Search
</button>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={getImageUrl(product.image) || placeholderSVG}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-600">
                      KSh {product.price?.toLocaleString()}
                    </span>
                    {product.stock_quantity > 0 ? (
                      <span className="text-xs text-green-600">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-600">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
