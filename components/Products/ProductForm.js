"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { adminAPI, categoryAPI } from "../../lib/api";
import { getImageUrl, handleImageError, placeholderSVG } from "../../utils/imageUtils";

export default function ProductForm({ product, onSaved }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Prefill fields when editing
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setOriginalPrice(product.original_price || "");
      setStock(product.stock_quantity || 0);
      setCategoryId(product.category_id || "");
      setIsActive(product.is_active ?? true);
      setIsFeatured(product.is_featured ?? false);
      setOnSale(product.on_sale ?? false);
      setPreviewUrl(product.image ? getImageUrl(product.image) : placeholderSVG);
    } else {
      // Reset when adding a new product
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setOriginalPrice("");
      setStock(0);
      setCategoryId("");
      setIsActive(true);
      setIsFeatured(false);
      setOnSale(false);
      setPreviewUrl(null);
    }
  }, [product]);

  // 🔹 Preview selected image
  useEffect(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let filename = product?.image || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await adminAPI.uploadImage(formData);
        filename = uploadRes.data.url;
      }

      const payload = {
        name,
        slug,
        description,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        stock_quantity: parseInt(stock),
        category_id: categoryId ? parseInt(categoryId) : null,
        is_active: isActive,
        is_featured: isFeatured,
        on_sale: onSale,
        image: filename,
      };

      if (product?.id) {
        await adminAPI.updateProduct(product.id, payload);
      } else {
        await adminAPI.createProduct(payload);
      }

      onSaved();
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm space-y-4"
    >
      {/* --- Two-column grid on large screens --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="text"
          placeholder="Slug (auto or custom)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Discounted Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="number"
          placeholder="Original Price"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* --- Category selector --- */}
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* --- Status checkboxes --- */}
      <div className="flex flex-wrap gap-4 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
          />
          <span>On Sale</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Active</span>
        </label>
      </div>

      {/* --- Badge Preview --- */}
      {(isFeatured || onSale) && (
        <div className="flex gap-2 mt-2">
          {isFeatured && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              FEATURED
            </span>
          )}
          {onSale && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              ON SALE
            </span>
          )}
        </div>
      )}

      {/* --- Image Upload --- */}
      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border px-3 py-2 rounded w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* --- Image Preview --- */}
      {previewUrl && (
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <Image
            src={previewUrl}
            alt="Preview"
            width={120}
            height={120}
            className="object-cover border rounded"
            onError={handleImageError}
          />
          <p className="text-sm text-gray-500">Preview of uploaded image</p>
        </div>
      )}

      {/* --- Submit Button --- */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full sm:w-auto mt-3 transition"
      >
        {loading
          ? "Saving..."
          : product?.id
          ? "Update Product"
          : "Add Product"}
      </button>
    </form>
  );
}
