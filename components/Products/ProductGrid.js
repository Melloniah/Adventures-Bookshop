'use client';

import { useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";

const ProductGrid = ({ 
  title = "Featured Products", 
  viewAllLink = null,
  initialProducts = [],
  showSaleBadge = false
}) => {
  const [products] = useState(initialProducts);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-red-600 hover:underline">
              View All
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
  {products.map((product) => (
    <ProductCard 
      key={product.id} 
      product={product}
      showSaleBadge={showSaleBadge}
    />
  ))}
</div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;