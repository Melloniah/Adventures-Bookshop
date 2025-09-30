'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductForm from '../../../components/ProductForm';
import { getImageUrl } from '../../../utils/imageUtils';
import { adminAPI } from 'lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔎 Fetch products from API with optional search query
  const fetchProducts = async (query = '') => {
    try {
      const res = await adminAPI.getAllProducts(query); 
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //  Call API whenever searchTerm changes (with debounce)

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm.trim()) {
      adminAPI.searchProducts(searchTerm)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error searching products:", err));
    } else {
      adminAPI.getAllProducts()
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error fetching products:", err));
    }
  }, 500); // debounce

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);



  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminAPI.deleteProduct(productId);
      fetchProducts(searchTerm);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormSaved = () => {
    setShowForm(false);
    fetchProducts(searchTerm);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Products</h1>
      <button
        onClick={handleAddNew}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Product
      </button>

      {/* 🔎 Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {showForm && (
        <ProductForm product={editingProduct} onSaved={handleFormSaved} />
      )}

      <div className="grid grid-cols-3 gap-4 mt-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="border p-2 rounded space-y-2">
              <Image
                src={getImageUrl(product.image)}
                alt={product.name}
                width={150}
                height={150}
                className="object-cover"
              />
              <h2 className="font-bold">{product.name}</h2>
              <p>${product.price}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
