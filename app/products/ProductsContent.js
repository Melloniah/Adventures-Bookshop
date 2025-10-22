'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productAPI } from "../../lib/api";
import { getImageUrl, handleImageError, placeholderSVG } from "utils/imageUtils";

export default function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const onSale = searchParams.get("on_sale") === "true";
  const isFeatured = searchParams.get("is_featured") === "true";
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productAPI.getAll({}); // Fetch all categories
        setCategories(res.data.categories || []); // Adjust if you have categories endpoint
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters or page change
  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          category: categorySlug || undefined,
          search: searchTerm || undefined,
          on_sale: onSale || undefined,
          is_featured: isFeatured || undefined,
        };

        const res = await productAPI.getAll(params);
        setProducts(res.data.products || []);
        setCurrentPage(res.data.current_page || 1);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts(currentPage);
  }, [categorySlug, searchTerm, onSale, isFeatured, currentPage]);

  const currentCategory = categories.find((cat) => cat.slug === categorySlug);

  const getPageTitle = () => {
    if (onSale) return "On Sale";
    if (isFeatured) return "Featured Products";
    if (currentCategory) return currentCategory.name;
    if (searchTerm) return `Search Results for "${searchTerm}"`;
    return "All Products";
  };

  const handleSearch = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (categorySlug) params.append("category", categorySlug);
    if (onSale) params.append("on_sale", "true");
    if (isFeatured) params.append("is_featured", "true");
    if (searchInput.trim()) params.append("search", searchInput.trim());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          {currentCategory?.description && !onSale && !isFeatured && (
            <p className="mt-2 text-gray-600">{currentCategory.description}</p>
          )}
          <p className="mt-2 text-gray-600">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Category Filter */}
        {!onSale && !isFeatured && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <Link
              href={`/products${searchTerm ? `?search=${searchTerm}` : ""}`}
              className={`px-4 py-2 rounded-lg ${
                !categorySlug ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}${searchTerm ? `&search=${searchTerm}` : ""}`}
                className={`px-4 py-2 rounded-lg ${
                  categorySlug === cat.slug ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button onClick={handleSearch} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Search
          </button>
        </div>

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
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
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

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}