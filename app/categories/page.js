"use client";

import { useEffect, useState } from "react";
import { categoryAPI } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const res = await categoryAPI.getCategoryHierarchy();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch category hierarchy:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHierarchy();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-10 text-gray-900">Shop by Category</h1>

        {categories.map((parent) => (
          <div key={parent.id} className="mb-16 border-b pb-10">
            {/* Parent Category Header */}
            <div className="flex items-center gap-3 mb-6">
              {parent.image && (
                <Image
                  src={parent.image}
                  alt={parent.name}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
              )}
              <Link
                href={`/products?category=${parent.slug}`}
                className="text-2xl font-semibold hover:text-red-600 transition"
              >
                {parent.name}
              </Link>
            </div>

            {/* Parent Products */}
            {parent.products?.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-3 text-gray-700">
                  Products under {parent.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {parent.products.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      className="block bg-white p-4 rounded shadow hover:shadow-md transition"
                    >
                      {prod.image && (
                        <div className="mb-3 h-28 w-full relative">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <h4 className="font-semibold">{prod.name}</h4>
                      <p className="text-red-600 font-medium">KSh {prod.price}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Subcategories */}
            {parent.subcategories?.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-3 text-gray-700">
                  Subcategories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {parent.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/products?category=${sub.slug}`}
                      className="block bg-white p-4 rounded shadow hover:shadow-md transition"
                    >
                      {sub.image && (
                        <div className="mb-3 h-24 w-full relative">
                          <Image
                            src={sub.image}
                            alt={sub.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      )}
                      <h4 className="font-semibold">{sub.name}</h4>
                      {sub.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{sub.description}</p>
                      )}

                      {/* Subcategory Products (if any) */}
                      {sub.products?.length > 0 && (
                        <div className="mt-3 text-sm">
                          <p className="text-gray-700 font-medium mb-1">Products:</p>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {sub.products.slice(0, 3).map((p) => (
                              <li key={p.id}>
                                <Link
                                  href={`/products/${p.slug}`}
                                  className="hover:text-red-600"
                                >
                                  {p.name}
                                </Link>
                              </li>
                            ))}
                            {sub.products.length > 3 && (
                              <li className="text-red-600">
                                <Link href={`/products?category=${sub.slug}`}>
                                  View all →
                                </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Fallback */}
            {!parent.subcategories?.length && !parent.products?.length && (
              <p className="text-gray-500">No subcategories or products available.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
