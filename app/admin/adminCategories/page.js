"use client";

import { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../../lib/api";
import Image from "next/image";
import { ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [parentId, setParentId] = useState(null);

  // State to control expanded tree nodes
  const [expandedId, setExpandedId] = useState(null);

  // --------------------------
  // Fetch category tree
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
        setCategories(res.data.categories || []);
        setTotal(res.data.total || 0);
      } else {
        res = await adminAPI.getCategoryTree();
        setCategories(res.data || []);
        setTotal(res.data?.length || 0);
      }
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
      setParentId(editingCategory.parent_id || null);
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setParentId(null);
      setImageFile(null);
    }
  }, [editingCategory]);

  // --------------------------
  // Flatten categories for dropdown
  // --------------------------
  const flattenCategories = (cats, level = 0) => {
    let flattened = [];
    cats.forEach((cat) => {
      flattened.push({ ...cat, level });
      if (cat.subcategories && cat.subcategories.length > 0) {
        flattened = flattened.concat(
          flattenCategories(cat.subcategories, level + 1)
        );
      }
    });
    return flattened;
  };

  const flatCategories = flattenCategories(categories);

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
      formData.append("parent_id", parentId || "");
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

      await refreshCategories();
      setEditingCategory(null);
      setParentId(null);
      setName("");
      setDescription("");
      setImageFile(null);
      setSkip(0);
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
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-4 sm:p-6 rounded shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap">
            {/* Name */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                required
                className="mt-1 block w-full border-gray-300 rounded-md px-3 py-2 border"
              />
            </div>

            {/* Description */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="mt-1 block w-full border-gray-300 rounded-md px-3 py-2 border"
              />
            </div>

            {/* Parent Category - NOW WITH SUBCATEGORIES */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700">
                Parent Category
              </label>
              <select
                value={parentId || ""}
                onChange={(e) =>
                  setParentId(e.target.value ? Number(e.target.value) : null)
                }
                className="mt-1 block w-full border-gray-300 rounded-md px-3 py-2 border"
              >
                <option value="">None (Top-level)</option>
                {flatCategories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    disabled={editingCategory?.id === cat.id}
                    style={{ paddingLeft: `${cat.level * 20}px` }}
                  >
                    {cat.level > 0 && "├─ ".repeat(cat.level)}
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700">
                Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 block w-full text-sm"
              />
            </div>

            {/* Submit */}
            <div className="flex-shrink-0 mt-4 sm:mt-0">
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {creating
                  ? "Saving..."
                  : editingCategory
                  ? "Update"
                  : "Create"}
              </button>
            </div>

            {editingCategory && (
              <div className="flex-shrink-0 mt-4 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        {/* CATEGORY TREE LIST */}
        {loading ? (
          <p className="text-gray-600 text-center">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-600 text-center">No categories found.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                onEdit={setEditingCategory}
                onDelete={handleDelete}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
              />
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

// ----------------------------------------------------
// 🧩 Recursive Category Item (Single Expandable Parent)
// ----------------------------------------------------
function CategoryItem({
  category,
  onEdit,
  onDelete,
  level = 0,
  expandedId,
  setExpandedId,
}) {
  const isExpanded = expandedId === category.id;
  const hasSubcategories = category.subcategories?.length > 0;

  const toggleExpand = () => {
    if (isExpanded) setExpandedId(null);
    else setExpandedId(category.id);
  };

  return (
    <div className={`ml-${level * 4} border-l border-gray-200`}>
      {/* Header Row */}
      <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-2">
          {hasSubcategories && (
            <button
              onClick={toggleExpand}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              {isExpanded ? (
                <ChevronDown size={18} strokeWidth={2} />
              ) : (
                <ChevronRight size={18} strokeWidth={2} />
              )}
            </button>
          )}

          {category.image && (
            <Image
              src={category.image}
              alt={category.name}
              width={32}
              height={32}
              className="rounded object-cover"
            />
          )}

          <span className="font-medium text-gray-800">{category.name}</span>
          {category.parent_id && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              Subcategory
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category)}
            className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Subcategories */}
      <AnimatePresence>
        {isExpanded && hasSubcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-6 mt-2 space-y-2"
          >
            {category.subcategories.map((sub) => (
              <CategoryItem
                key={sub.id}
                category={sub}
                onEdit={onEdit}
                onDelete={onDelete}
                level={level + 1}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}