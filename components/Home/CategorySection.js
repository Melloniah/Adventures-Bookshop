"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryAPI } from "../../lib/api";

export const categoryIcons = {
  "pre-school": "🎨",
  "grade 1": "✏️",
  "grade 2": "📝",
  "grade-3": "📖",
  "arts": "🖌️",
  "stationery": "🖊️",
  "technology": "💻",
  "books": "📚"
};

const featuredCategories = ["pre-school","grade 1","grade 2","stationery","arts"];

export default function CategorySection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getCategories(); 
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const displayed = categories.filter(cat => featuredCategories.includes(cat.slug));

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayed.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group">
              <div className="p-6 rounded-lg text-center bg-white hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{categoryIcons[cat.slug]}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600">{cat.name}</h3>
                {cat.description && <p className="text-sm text-gray-600">{cat.description}</p>}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/categories" className="text-red-600 font-semibold hover:underline">View All Categories</Link>
        </div>
      </div>
    </section>
  );
}
