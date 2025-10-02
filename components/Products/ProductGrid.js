"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { productAPI } from "../../lib/api";

const ProductGrid = ({ title = "Featured Products", category = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = category
          ? await productAPI.getByCategory(category)
          : await productAPI.getAll();

        setProducts(response.data.slice(0, 8)); // limit to 8 products
      } catch (error) {
        console.error("Error fetching products:", error);

        // Fallback mock
        setProducts([
          {
            id: 1,
            name: "TRS Guide Top Scholar Mathematics 7",
            category: "TEXTBOOKS",
            price: 525,
            originalPrice: 550,
            image: "/product1.jpg",
            sale: true,
            rating: 4,
            reviews_count: 5,
            stock_quantity: 10,
          },
          {
            id: 2,
            name: "Crayola Crayon NO.24",
            category: "STATIONERY",
            price: 700,
            originalPrice: 720,
            image: "/product2.jpg",
            sale: true,
            rating: 5,
            reviews_count: 8,
            stock_quantity: 0,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div className="text-center py-12">Loading products...</div>;
  if (products.length === 0) return <div className="text-center py-12">No products found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
