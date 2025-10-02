import HeroSection from '../components/Home/HeroSection';
import CategorySection from '../components/Home/CategorySection';
import ProductGrid from '../components/Products/ProductGrid';
import { productAPI } from '../lib/api';

export const metadata = {
  title: 'Adventure Bookshop',
  description: 'Your story starts here!. Visit us, your one-stop shop for educational materials, books, stationery, and technology for students of all ages.',
};

export default async function Home() {
  // Fetch all products server-side
  let onSaleProducts = [];
  let featuredProducts = [];
  
  try {
    const [saleRes, featuredRes] = await Promise.all([
      productAPI.getProductsOnSale(),
      productAPI.getProductsFeatured()
    ]);
    onSaleProducts = saleRes.data || [];
    featuredProducts = featuredRes.data || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  const showOnSale = onSaleProducts.length > 0;

  return (
    <>
      <HeroSection />
      <CategorySection />

      {/* Special Offers Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-400 p-6 rounded-lg">
              <div className="text-sm font-medium text-black mb-2">BIG DEAL</div>
              <h3 className="text-xl font-bold text-black mb-2">Calculators</h3>
              <div className="text-black mb-4">SAVE BIG</div>
            </div>
            <div className="bg-purple-600 p-6 rounded-lg text-white">
              <div className="text-sm font-medium mb-2">LIMITED EDITION</div>
              <h3 className="text-xl font-bold mb-2">Office Report File Folder</h3>
              <div className="mb-4">MAKE ORDER NOW!</div>
            </div>
            <div className="bg-green-600 p-6 rounded-lg text-white">
              <div className="text-sm font-medium mb-2">ART SUPPLIES</div>
              <h3 className="text-xl font-bold mb-2">Washable Finger Water Colors</h3>
              <div className="mb-4">BEST PRICES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Section - Toggle between On Sale OR New Products */}
      {showOnSale ? (
        <ProductGrid 
          title="On Sale" 
          initialProducts={onSaleProducts.slice(0, 4)}
          viewAllLink="/products?on_sale=true"
          showSaleBadge={false}
        />
      ) : (
        featuredProducts.length > 0 && (
          <ProductGrid 
            title="New Products" 
            initialProducts={featuredProducts.slice(0, 4)}
            viewAllLink="/products?is_featured=true"
            showSaleBadge={true}
          />
        )
      )}

      {/* Best Seller Section - Always shown */}
      {featuredProducts.length > 0 && (
        <ProductGrid 
          title="Best Seller" 
          initialProducts={featuredProducts.slice(0, 4)}
          viewAllLink="/products?is_featured=true"
          showSaleBadge={true}
        />
      )}
    </>
  );
}