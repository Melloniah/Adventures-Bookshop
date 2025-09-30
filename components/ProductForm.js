'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '../lib/api';
import { getImageUrl } from '../utils/imageUtils';
import Image from 'next/image';

export default function ProductForm({ product, categories = [], onSaved }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prefill form on mount or when `product` changes
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSlug(product.slug || '');
      setDescription(product.description || '');
      setPrice(product.price || '');
      setOriginalPrice(product.original_price || '');
      setStock(product.stock_quantity || 0);
      setCategoryId(product.category_id || '');
      setIsActive(product.is_active ?? true);
      setIsFeatured(product.is_featured ?? false);
      setOnSale(product.on_sale ?? false);
      setPreviewUrl(product.image ? getImageUrl(product.image) : null);
    } else {
      // Reset for new product
      setName('');
      setSlug('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setStock(0);
      setCategoryId('');
      setIsActive(true);
      setIsFeatured(false);
      setOnSale(false);
      setPreviewUrl(null);
    }
  }, [product]);

  // Preview image when selected
  useEffect(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let filename = product?.image || null;

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await adminAPI.uploadImage(formData);
        filename = uploadRes.data.filename;
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
// update or create
      if (product?.id) {
        await adminAPI.updateProduct(product.id, payload);
      } else {
        await adminAPI.createProduct(payload);
      }

      onSaved();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-3 mb-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <input
        type="text"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
        rows={3}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Original Price"
        value={originalPrice}
        onChange={(e) => setOriginalPrice(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Stock Quantity"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="border p-2 w-full"
      />

      {/* Category selector */}
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Select Category</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {/* Checkboxes */}
      <div className="flex space-x-4">
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          /> Active
        </label>
        <label>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          /> Featured
        </label>
        <label>
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => setOnSale(e.target.checked)}
          /> On Sale
        </label>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border p-2 w-full"
      />

      {previewUrl && (
        <div className="mt-2">
          <p className="text-sm mb-1">Image Preview:</p>
          <Image
            src={previewUrl}
            alt="Preview"
            width={150}
            height={150}
            className="w-32 h-32 object-cover border"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : product?.id ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}
