"use client";

import { useState, useEffect } from "react";
import { productAPI } from "../../../lib/api";
import Image from "next/image";
import { useCartStore } from "../../../store/useCartStore";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { getImageUrl, placeholderSVG } from "../../../utils/imageUtils";
import Link from "next/link";

export default function ProductDetail({ id }) {  // ✅ receives id as prop now
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { items, addItem, removeItem, updateQuantity } = useCartStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await productAPI.getById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading product...</p>;
  if (!product) return <p className="text-center py-10">Product not found.</p>;

  const cartItem = mounted ? items.find((item) => item.id === product.id) : null;
  const inCart = !!cartItem;

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart!");
  };

  // Reduce quantity by one; remove the item when only one is left
  const handleDecrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      removeItem(product.id);
      toast.success("Removed from cart");
    } else {
      updateQuantity(product.id, cartItem.quantity - 1);
      toast.success("Quantity reduced");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full relative">
        <Image
          src={getImageUrl(product.image) || placeholderSVG}
          alt={product.name}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full max-w-md h-auto object-cover rounded-lg shadow"
        />
      </div>

      <div className="mt-4 w-full flex flex-col items-center space-y-3 text-center">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-lg font-semibold">Price: KES {product.price}</p>
        <p className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
          {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {product.stock_quantity > 0 && (
          <div className="w-full mt-3 flex gap-2">
            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              title="Add to cart"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDecrease}
              disabled={!inCart}
              aria-label="Remove one from cart"
              title="Remove one from cart"
              className="flex-1 border border-blue-500 text-blue-600 py-2 px-4 rounded hover:bg-blue-50 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        <Link
          href="/products"
          className="text-blue-600 hover:underline text-sm font-medium mb-6 inline-block"
        >
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}