"use client";

import { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../../lib/api";
import Image from "next/image";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [creating, setCreating] = useState(false);

  // --------------------------
  // Fetch categories function
  // --------------------------
  const refreshCategories = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (searchQuery.trim()) {
        res = await adminAPI.searchAdminCategories({
          q: searchQuery,
          skip,
          limit,
        });
      } else {
        res = await adminAPI.getAdminCategories({ skip, limit });
      }
      setCategories(res.data.categories || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, searchQuery]);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  // --------------------------
  // Prefill form for edit
  // --------------------------
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || "");
      setDescription(editingCategory.description || "");
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setImageFile(null);
    }
  }, [editingCategory]);

  // --------------------------
  // Handle create/update
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Name is required!");
    setCreating(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description || "");
      if (imageFile) formData.append("image", imageFile);

      if (editingCategory?.id) {
        await adminAPI.updateCategory(editingCategory.id, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await adminAPI.createCategory(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setEditingCategory(null);
      setName("");
      setDescription("");
      setImageFile(null);
      setSkip(0); // reset to first page
      refreshCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
      alert(err?.response?.data?.detail || "Failed to save category");
    } finally {
      setCreating(false);
    }
  };

  // --------------------------
  // Handle delete
  // --------------------------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminAPI.deleteCategory(id);
      refreshCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert(err?.response?.data?.detail || "Failed to delete category");
    }
  };

  // --------------------------
  // Pagination helpers
  // --------------------------
  const handlePrev = () => setSkip((prev) => Math.max(prev - limit, 0));
  const handleNext = () => setSkip((prev) => prev + limit);

  // --------------------------
  // Search handler
  // --------------------------
  const handleSearch = () => setSkip(0);

  // --------------------------
  // Render
  // --------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center sm:text-left">
          Admin Categories
        </h1>

        {/* Search Bar */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Search
          </button>
        </div>

        {/* CREATE / EDIT FORM */}
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 sm:p-6 rounded shadow">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {creating ? "Saving..." : editingCategory ? "Update" : "Create"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* CATEGORY LIST */}
        {loading ? (
          <p className="text-gray-600 text-center">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-600 text-center">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 sm:p-6 rounded-lg bg-white shadow flex flex-col justify-between"
              >
                <div className="text-center mb-2 font-semibold">{cat.name}</div>
                {cat.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{cat.description}</p>
                )}
                {cat.image && (
                  <div className="mb-2 h-20 w-full relative">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover rounded" />
                  </div>
                )}
                <div className="flex justify-between mt-auto gap-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {total > limit && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={skip === 0}
              onClick={handlePrev}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={skip + limit >= total}
              onClick={handleNext}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
