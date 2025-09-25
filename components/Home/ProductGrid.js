"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
// import { useCartStore } from "@/store/useStore"; 
import { useCartStore } from "../../store/useStore";
import { productAPI } from "../../lib/api";
import toast from "react-hot-toast";

// 🔹 Single Product Card Component
const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  // 🖤 Handle wishlist (you can connect this to a store or API later)
  const handleWishlist = () => {
    toast.success("Added to wishlist!");
  };

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart!");
  };

  // 🔹 Calculate discount if both prices exist
  const discount =
    product.original_price || product.originalPrice
      ? Math.round(
          ((product.original_price - product.price) /
            product.original_price) *
            100
        )
      : null;

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow">
      {/* ✅ Sale badge (works for both backend + mock) */}
      {(product.sale || product.on_sale) && (
        <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded z-10">
          Sale
        </div>
      )}

      {/* ✅ Discount badge */}
      {discount && (
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded z-10">
          -{discount}%
        </div>
      )}

      {/* 🖤 Wishlist button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-10 bg-white rounded-full p-2 shadow hover:text-red-600 z-10"
      >
        <HeartIcon className="h-5 w-5" />
      </button>

      {/* ✅ Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <image
                    className="h-10 w-10 rounded-full object-cover"
                    src={getImageUrl(product.image)}  // ✅ Use utility function
                    alt={product.name || 'Product'}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
        </div>
      </Link>

      <div className="p-4">
        {/* ✅ Category: works with string (mock) OR object (backend) */}
        <div className="text-xs text-gray-500 uppercase mb-1">
          {typeof product.category === "string"
            ? product.category
            : product.category?.name || "GENERAL"}
        </div>

        {/* ✅ Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-red-600 line-clamp-2">
            {product.name || "Unnamed Product"}
          </h3>
        </Link>

        {/* ⭐ Dynamic Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">
                {i < Math.round(product.rating || 0) ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews_count || 0})
          </span>
        </div>

        {/* ✅ Stock status */}
        {product.in_stock ? (
          <span className="text-green-600 text-xs">In Stock</span>
        ) : (
          <span className="text-red-600 text-xs">Out of Stock</span>
        )}

        {/* ✅ Price (supports backend + mock fields) */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-red-600">
              KSh {product.price?.toLocaleString() || "0"}
            </span>
            {(product.original_price || product.originalPrice) && (
              <span className="text-sm text-gray-500 line-through ml-2">
                KSh{" "}
                {(
                  product.original_price || product.originalPrice
                ).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* ✅ Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          {product.in_stock ? "ADD TO CART" : "OUT OF STOCK"}
        </button>
      </div>
    </div>
  );
};

// 🔹 Product Grid (fetches data)
const ProductGrid = ({ title = "Featured Products", category = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ Fetch products from API (by category or all)
        const response = category
          ? await productAPI.getByCategory(category)
          : await productAPI.getAll();

        setProducts(response.data.slice(0, 8)); // limit to 8 products
      } catch (error) {
        console.error("Error fetching products:", error);

        // ✅ Mock data fallback for dev
        setProducts([
          {
            id: 1,
            name: "TRS Guide Top Scholar Mathematics 7",
            category: "TEXTBOOKS",
            price: 525,
            originalPrice: 550,
            image: "/product1.jpg",
            sale: true,
            rating: 4,
            reviews_count: 5,
            in_stock: true,
          },
          {
            id: 2,
            name: "Crayola Crayon NO.24",
            category: "STATIONERY",
            price: 700,
            originalPrice: 720,
            image: "/product2.jpg",
            sale: true,
            rating: 5,
            reviews_count: 8,
            in_stock: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <Link
            href="/products"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
