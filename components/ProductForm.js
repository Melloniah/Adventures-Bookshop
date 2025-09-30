'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '../lib/api';
import { getImageUrl } from '../utils/imageUtils';
import Image from 'next/image';

export default function ProductForm({ product, onSaved }) {
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [price, setPrice] = useState(product?.price || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(product?.image ? getImageUrl(product.image) : null);
  const [loading, setLoading] = useState(false);

  // Preview when file selected
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

      // 1️⃣ Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await adminAPI.uploadImage(formData);
        filename = uploadRes.data.filename;
      }

      // 2️⃣ Create or update product
      const payload = { name, slug, price: parseFloat(price), image: filename };
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
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="border p-2 w-full"
      />
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
