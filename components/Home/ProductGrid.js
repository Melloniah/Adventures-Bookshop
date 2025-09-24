"use client";


import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from 'store/useStore';
import { productAPI } from 'lib/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow">
      {product.sale && (
        <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded z-10">
          Sale
        </div>
      )}
      
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase mb-1">{product.category}</div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-red-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">⭐</span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(0)</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-red-600">
              KSh {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

const ProductGrid = ({ title = "Featured Products", category = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = category 
          ? await productAPI.getByCategory(category)
          : await productAPI.getAll();
        setProducts(response.data.slice(0, 8)); // Show only 8 products
      } catch (error) {
        console.error('Error fetching products:', error);
        // Mock data for development
        setProducts([
          {
            id: 1,
            name: 'TRS Guide Top Scholar Mathematics 7',
            category: 'TEXTBOOKS',
            price: 525,
            originalPrice: 550,
            image: '/product1.jpg',
            sale: true
          },
          {
            id: 2,
            name: 'Crayola Crayon NO.24',
            category: 'STATIONERY',
            price: 700,
            originalPrice: 720,
            image: '/product2.jpg',
            sale: true
          },
          // Add more mock products...
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <Link
            href="/products"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;