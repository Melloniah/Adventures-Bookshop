"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ p }) {
  return (
    <Link href={`/products/${p.id}`}>
      <div className="border rounded-lg p-4 bg-white hover:shadow-md transition">
        <div className="relative">
          {p.oldPrice && (
            <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          )}
          <Image
            src={p.image || "/images/book-placeholder.jpg"}
            alt={p.title}
            width={300}
            height={200}
            className="w-full h-56 object-contain rounded"
          />
        </div>
        <div className="mt-3 text-xs text-gray-500">{p.category}</div>
        <div className="font-semibold mt-1">{p.title}</div>
        {p.author && <div className="text-sm text-gray-600">{p.author}</div>}
        <div className="mt-2">
          <span className="text-red-600 font-bold">KSh {p.price}.00</span>
          {p.oldPrice && (
            <span className="line-through text-gray-400 text-sm ml-2">
              KSh {p.oldPrice}.00
            </span>
          )}
        </div>
        <button className="w-full mt-3 border rounded py-2 text-sm hover:bg-gray-50">
          ADD TO CART
        </button>
      </div>
    </Link>
  );
}
