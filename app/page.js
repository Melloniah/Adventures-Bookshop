import HeroSection from '../components/Home/HeroSection';
import CategorySection from '../components/Home/CategorySection';
import ProductGrid from '../components/Home/ProductGrid';

export const metadata = {
  title: 'Adventure Bookshop - ',
  description: ' "Open a book. Unlock a world. Return renewed."Visit us, your one-stop shop for educational materials, books, stationery, and technology for students of all ages.',
};

export default function Home() {
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

      <ProductGrid title="New Products" />
      <ProductGrid title="Best Seller" />
      
      {/* Newsletter */}
      {/* <section className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-8">
            Get the latest updates on new products and special offers
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-red-600 text-white px-6 py-3 rounded-r-lg hover:bg-red-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}
    </>
  );
}