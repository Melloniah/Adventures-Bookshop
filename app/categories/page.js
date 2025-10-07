"use client";

import CategorySection, { categoryIcons } from "../../components/Home/CategorySection";
import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryAPI } from "../../lib/api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-600 text-lg">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center sm:text-left">
          All Categories
        </h1>

        {categories.length === 0 ? (
          <p className="text-gray-600 text-center sm:text-left">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <div className="p-4 sm:p-6 rounded-lg text-center bg-white hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{categoryIcons[cat.slug] || "📕"}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base group-hover:text-red-600 truncate">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
