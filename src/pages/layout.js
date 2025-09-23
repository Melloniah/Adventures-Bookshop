import "./globals.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Footer";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "School Mall Limited",
  description: "Fuel your future. Think. Learn. Achieve.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans">
        {/* Promo bar */}
        <div className="bg-orange-500 text-white text-sm py-2 text-center">
          Free Delivery on Orders Over KSh 3,000 | Call Us: +254 793 488207
        </div>

        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
