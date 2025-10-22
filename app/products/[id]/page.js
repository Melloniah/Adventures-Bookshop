"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { productAPI } from "../../../lib/api";
import Image from "next/image";
import { useCartStore } from "../../../store/useCartStore";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { getImageUrl, placeholderSVG } from '../../../utils/imageUtils';
import Link from "next/link";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

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

  const handleAddToCart = () => {
    addItem(product);
    toast.success("Added to cart!");
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
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-teal-400 text-black-700 py-2 px-4 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            ADD TO CART
          </button>
        )}
         <Link
        href="/products"
        className="text-red-600 hover:underline text-sm font-medium mb-6 inline-block"
      >
        ← Back to Products
      </Link>
      </div>
    </div>
  );
}
