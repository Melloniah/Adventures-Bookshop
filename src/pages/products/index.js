import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../layout';
import ProductGrid from '../../components/Home/ProductGrid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const ProductsPage = () => {
  const router = useRouter();
  const { category, search, sort } = router.query;
  const [filters, setFilters] = useState({
    category: category || '',
    search: search || '',
    sort: sort || 'newest',
    priceRange: [0, 10000]
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'books', label: 'Books' },
    { value: 'stationery', label: 'Stationery' },
    { value: 'technology', label: 'Technology' },
    { value: 'art-supplies', label: 'Art Supplies' },
    { value: 'pre-school', label: 'Pre-school' },
    { value: 'grade-1', label: 'Grade 1' },
    { value: 'grade-2', label: 'Grade 2' },
    { value: 'grade-3', label: 'Grade 3' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  return (
    <>
      <Head>
        <title>Products - SchoolMall</title>
        <meta name="description" content="Browse our wide selection of educational materials, books, and supplies." />
      </Head>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Category</h3>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                      })}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [filters.priceRange[0], parseInt(e.target.value) || 10000]
                      })}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Search</h3>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <button
                  onClick={() => setFilters({ category: '', search: '', sort: 'newest', priceRange: [0, 10000] })}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
                </h1>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ProductGrid category={filters.category} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProductsPage;