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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>

        {categories.length === 0 ? (
          <p className="text-gray-600">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group">
                <div className="p-6 rounded-lg text-center bg-white hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{categoryIcons[cat.slug] || "📕"}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600">
                    {cat.name}
                  </h3>
                  {cat.description && <p className="text-sm text-gray-600">{cat.description}</p>}
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