import HeroSection from "../components/Home/HeroSection";
import CategorySection from "../components/Home/CategorySection";
import ProductSections from "../components/Home/ProductSections";

export const metadata = {
  title: 'Adventure Bookshop',
  description: 'Your story starts here!. Visit us, your one-stop shop for educational materials, books, stationery, and technology for students of all ages.',
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <ProductSections />
    </>
  );
}
