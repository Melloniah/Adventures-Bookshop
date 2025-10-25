"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productAPI, categoryAPI } from "../../lib/api";
import { getImageUrl, handleImageError, placeholderSVG } from "utils/imageUtils";

export default function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]); // ✅ added
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const onSale = searchParams.get("on_sale") === "true";
  const isFeatured = searchParams.get("is_featured") === "true";
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchTerm);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // ✅ Fetch products + subcategories
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
        setSubcategories(res.data.subcategories || []);
        setCategoryName(res.data.category?.name || "");
        setCurrentPage(res.data.current_page || 1);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        console.error(err);
        setProducts([]);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts(currentPage);
  }, [categorySlug, searchTerm, onSale, isFeatured, currentPage]);

  // ✅ Fetch breadcrumbs (Books › Grade 1)
  useEffect(() => {
    if (!categorySlug) {
      setBreadcrumbs([]);
      return;
    }
    const fetchBreadcrumbs = async () => {
      try {
        const res = await categoryAPI.getBreadcrumbsBySlug(categorySlug);
        setBreadcrumbs(res.data);
      } catch (err) {
        console.error("Failed to load breadcrumbs", err);
        setBreadcrumbs([]);
      }
    };
    fetchBreadcrumbs();
  }, [categorySlug]);

  const getPageTitle = () => {
    if (onSale) return "On Sale";
    if (isFeatured) return "Featured Products";
    if (categoryName) return categoryName;
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* ✅ Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {" › "}
            {breadcrumbs.map((b, i) => (
              <span key={b.slug}>
                <Link
                  href={`/products?category=${b.slug}`}
                  className="hover:underline"
                >
                  {b.name}
                </Link>
                {i < breadcrumbs.length - 1 && " › "}
              </span>
            ))}
          </nav>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="mt-2 text-gray-600">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

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
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Search
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : subcategories.length > 0 ? (
          // ✅ SHOW SUBCATEGORY CARDS
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/products?category=${sub.slug}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden flex flex-col text-center"
              >
                <div className="relative aspect-[1/1] w-full bg-gray-100">
                  <Image
                    src={getImageUrl(sub.image) || placeholderSVG}
                    alt={sub.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-center"
                    onError={handleImageError}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : products.length > 0 ? (
          // ✅ SHOW PRODUCTS GRID
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[1/1] w-full bg-gray-100">
                    <Image
                      src={getImageUrl(product.image) || placeholderSVG}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-center"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-grow justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
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

            {/* Pagination */}
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
        ) : (
          //  No products / subcategories
          <div className="text-center py-12">
            <p className="text-gray-600">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
