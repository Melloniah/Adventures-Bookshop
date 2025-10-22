"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "../../store/useCartStore";
import { getImageUrl, handleImageError, placeholderSVG } from '../../utils/imageUtils';
import toast from "react-hot-toast";

const ProductCard = ({ product, showSaleBadge = false }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart!");
  };

  // Safely get image URL
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="relative flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow h-full">
  
  {/* Status Badges */}
  <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
    {product.is_featured && (
      <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded">NEW</span>
    )}
    {showSaleBadge && product.on_sale && (
      <span className="bg-red-500 text-white px-2 py-1 text-xs rounded">ON SALE</span>
    )}
  </div>

  {/* Discount Badge */}
  {product.original_price && product.original_price > product.price && (
    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded z-10">
      -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
    </div>
  )}

  {/* Product Image */}
  <Link href={`/products/${product.id}`} className="flex-shrink-0">
    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
      <Image
        src={imageUrl || placeholderSVG}
        alt={product.name || "Product"}
        fill
        onError={handleImageError}
        unoptimized={!!product.image}
        className="object-contain w-full h-full p-2"
      />
    </div>
  </Link>

  {/* Product Info */}
  <div className="flex flex-col flex-grow p-4">
    <div className="text-xs text-gray-500 uppercase mb-1">
      {product.category?.name || "GENERAL"}
    </div>

    <Link href={`/products/${product.id}`}>
      <h3 className="font-medium text-gray-900 mb-2 hover:text-red-600 line-clamp-2">
        {product.name || "Unnamed Product"}
      </h3>
    </Link>

    {product.stock_quantity > 0 ? (
      <span className="text-green-600 text-xs">In Stock</span>
    ) : (
      <span className="text-red-600 text-xs">Out of Stock</span>
    )}

    {/* Push price & button to the bottom */}
    <div className="mt-auto">
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="text-lg font-bold text-red-600">
            KSh {product.price?.toLocaleString() || "0"}
          </span>
          {(product.original_price || product.originalPrice) && (
            <span className="text-sm text-gray-500 line-through ml-2">
              KSh {(product.original_price || product.originalPrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock_quantity <= 0}
        className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCartIcon className="h-4 w-4 mr-2" />
        {product.stock_quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"}
      </button>
    </div>
  </div>
</div>

  );
};

export default ProductCard;