"use client";
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mock products for demo - replace with API call later
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "TRS GUIDE TOP SCHOLAR MATHEMATICS GRADE 7",
        price: 850,
        original_price: 950,
        image_url: "/api/placeholder/200/250",
        category: "Books",
        author: "TRS Publishers",
        description: "CBC-Aligned: Fully supports the Grade 7 Mathematics syllabus",
      },
      {
        id: 2,
        name: "FX-82MS/2nd Edition Casio Calculator",
        price: 1200,
        original_price: 1400,
        image_url: "/api/placeholder/200/250",
        category: "Calculators",
      },
      {
        id: 3,
        name: "Lenovo E15 G4 Core i3 12th Generation",
        price: 45000,
        original_price: 50000,
        image_url: "/api/placeholder/200/250",
        category: "Electronics",
      },
      {
        id: 4,
        name: "Racer Medium Biro Pens",
        price: 120,
        original_price: 150,
        image_url: "/api/placeholder/200/250",
        category: "Stationery",
      },
      {
        id: 5,
        name: "SPOTLIGHT CRE GRADE 5",
        price: 650,
        original_price: 750,
        image_url: "/api/placeholder/200/250",
        category: "Books",
      },
    ];

    // normalize keys to match ProductCard
    const normalized = mockProducts.map((p) => ({
      id: p.id,
      title: p.name,
      price: p.price,
      oldPrice: p.original_price,
      image: p.image_url,
      category: p.category,
      author: p.author || "",
      description: p.description || "",
    }));

    setProducts(normalized);
    setFilteredProducts(normalized);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const categories = ["all", "Books", "Stationery", "Calculators", "Electronics"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none pl-10"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-lg h-80"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} p={product} />
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
