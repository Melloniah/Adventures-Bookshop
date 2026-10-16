import Link from "next/link";
import Image from "next/image";
import ProductGrid from "../../components/Products/ProductGrid";
import { productAPI } from "../../lib/api";

export default async function ProductSections() {
  let onSaleProducts = [];
  let featuredProducts = [];

  try {
    const [saleRes, featuredRes] = await Promise.all([
      productAPI.getProductsOnSale(),
      productAPI.getProductsFeatured(),
    ]);

    onSaleProducts = saleRes.data.products || [];
    featuredProducts = featuredRes.data.products || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  return (
    <>
      {/* Category Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

            {/* Books Card */}
            <Link href="/products?category=books">
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Image
                  src="/books.jpg"
                  alt="Books"
                  width={400}
                  height={250}
                  className="w-full h-40 md:h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800">
                  Books
                </h3>
              </div>
            </Link>

            {/* Stationery Card */}
            <Link href="/products?category=stationery">
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Image
                  src="/office-stationery.webp"
                  alt="Stationery"
                  width={400}
                  height={250}
                  className="w-full h-40 md:h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800">
                  Stationery
                </h3>
              </div>
            </Link>

            {/* Technology Card */}
            <Link href="/products?category=technology">
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Image
                  src="/technology.png"
                  alt="Technology"
                  width={400}
                  height={250}
                  className="w-full h-40 md:h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800">
                  Technology
                </h3>
              </div>
            </Link>

            {/* Toys Card */}
            <Link href="/products?category=toys">
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <Image
                  src="/boardgames.jpg"
                  alt="Toys"
                  width={400}
                  height={250}
                  className="w-full h-40 md:h-48 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg md:text-xl font-semibold text-center text-gray-800">
                  Toys
                </h3>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* On Sale Section */}
      {onSaleProducts.length > 0 && (
        <ProductGrid
          title="On Sale"
          initialProducts={onSaleProducts.slice(0, 4)}
          viewAllLink="/products?on_sale=true"
          showSaleBadge={true}
        />
      )}

      {/* New Arrivals Section */}
      {featuredProducts.length > 0 && (
        <ProductGrid
          title="New Arrivals"
          initialProducts={featuredProducts.slice(0, 4)}
          viewAllLink="/products?is_featured=true"
          showSaleBadge={false}
        />
      )}
    </>
  );
}