// app/products/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api"; 

export default function ProductDetail() {
  const { id } = useParams();   // gets :id from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="font-semibold">Price: KES {product.price}</p>
      <p className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
  {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
</p>

{product.stock_quantity > 0 && (
  <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
    Add to Cart
  </button>
)}
    </div>
  );
}
