"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { categoryAPI } from "../../lib/api";

export const categoryIcons = {
  "pre-school": "🎨",
  "grade-1": "✏️",
  "grade-2": "📝",
  "grade-3": "📖",
  "arts": "🖌️",
  "stationery": "🖊️",
  "technology": "💻",
  "books": "📚",
};

const featuredCategories = ["pre-school", "grade-1", "grade-2", "stationery", "arts"];

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getCategoryHierarchy();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch category tree:", err);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayed = categories.flatMap((cat) => {
    const isFeaturedParent = featuredCategories.includes(cat.slug);
    const featuredSubs =
      cat.subcategories?.filter((sub) => featuredCategories.includes(sub.slug)) || [];
    return isFeaturedParent ? [cat, ...featuredSubs] : featuredSubs;
  });

  // All categories flat list for dropdown
  const allCategories = categories.flatMap((cat) => [
    cat,
    ...(cat.subcategories || []),
  ]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shop By Category
          </h2>

          {/* All Categories dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              {/* Hamburger icon */}
              <span className="flex flex-col gap-1">
                <span className="block w-4 h-0.5 bg-white rounded" />
                <span className="block w-4 h-0.5 bg-white rounded" />
                <span className="block w-4 h-0.5 bg-white rounded" />
              </span>
              <span className="hidden sm:inline">All Categories</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-3 bg-red-600">
                  <p className="text-white font-semibold text-sm">All Categories</p>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {allCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                      <span className="text-xl">
                        {categoryIcons[cat.slug] || "🛒"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-red-600">
                          {cat.name}
                        </p>
                        {cat.description && (
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 ml-auto text-gray-300 group-hover:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <Link
                    href="/categories"
                    onClick={() => setDropdownOpen(false)}
                    className="block text-center text-sm text-red-600 font-semibold hover:underline"
                  >
                    Browse All Categories →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Featured categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayed.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group">
              <div className="p-6 rounded-lg text-center bg-white hover:shadow-lg transition-all hover:-translate-y-0.5 border border-gray-100">
                <div className="text-3xl mb-3">{categoryIcons[cat.slug] || "🛒"}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-red-600 text-sm sm:text-base">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom link */}
        <div className="mt-6 text-center">
          <Link href="/categories" className="text-red-600 font-semibold hover:underline text-sm sm:text-base">
            View All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}