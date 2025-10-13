'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductForm from '../../../components/Products/ProductForm';
import { getImageUrl, handleImageError, placeholderSVG } from '../../../utils/imageUtils';
import { adminAPI, categoryAPI } from 'lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // ✅ Separate debounced value
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // ✅ Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Fetch products when debounced search or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res;
        if (debouncedSearch.trim()) {
          res = await adminAPI.searchProducts(debouncedSearch, currentPage, itemsPerPage);
        } else {
          res = await adminAPI.getAllProducts(currentPage, itemsPerPage);
        }

        setProducts(res.data.products || []);
        setCurrentPage(res.data.current_page || 1);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [debouncedSearch, currentPage]);

  // ✅ Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Delete product
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminAPI.deleteProduct(productId);
      // Refetch current page
      const res = debouncedSearch.trim()
        ? await adminAPI.searchProducts(debouncedSearch, currentPage, itemsPerPage)
        : await adminAPI.getAllProducts(currentPage, itemsPerPage);
      
      setProducts(res.data.products || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // ✅ Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // ✅ Add new product
  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // ✅ After form save - refetch current page
  const handleFormSaved = async () => {
    setShowForm(false);
    try {
      const res = debouncedSearch.trim()
        ? await adminAPI.searchProducts(debouncedSearch, currentPage, itemsPerPage)
        : await adminAPI.getAllProducts(currentPage, itemsPerPage);
      
      setProducts(res.data.products || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error('Error refetching products:', err);
    }
  };

  // ✅ Pagination handler
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          All Products
        </h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
        >
          + Add New Product
        </button>
      </div>

      {/* 🔎 Search Bar */}
      <div className="w-full mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
        />
      </div>

      {/* 🛒 Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-40 sm:h-44 relative rounded overflow-hidden">
                <Image
                  src={getImageUrl(product.image) || placeholderSVG}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  onError={handleImageError}
                />
              </div>

              {/* Details */}
              <div className="mt-3 flex-1">
                <h2 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-gray-700 mt-1 text-sm sm:text-base">
                  KSh {product.price?.toLocaleString()}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm sm:text-base w-full sm:w-1/2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm sm:text-base w-full sm:w-1/2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-sm sm:text-base">
            No products found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded hover:bg-gray-300 ${
                  pageNum === currentPage ? 'bg-red-600 text-white' : 'bg-gray-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSaved={handleFormSaved}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}