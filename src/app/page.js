import Head from 'next/head';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import ProductGrid from '@/components/ProductGrid';
import PromoSection from '../components/PromoSection';
import PromoBannerSection from '@/components/PromoBannerSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>SchoolMall - Educational Materials & Supplies</title>
        <meta name="description" content="Your one-stop shop for educational materials, books, stationery, and technology for students of all ages." />
      </Head>
      

      
      <main>
        <HeroSection />
        <CategorySection />
        
        {/* Special Offers Banner */}

        <section className="py-8">
          <PromoBannerSection/>
        </section>

        <ProductGrid title="New Products" />
        <ProductGrid title="Best Seller" />
        
        {/* Newsletter */}
        <section className="bg-gray-900 py-12">
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
        </section>
      </main>
      
    
    </>
  );
}