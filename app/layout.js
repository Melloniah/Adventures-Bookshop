import Script from "next/script";
import "./globals.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

export const metadata = {
  title: "Adventurs Bookshop ",
  description: "Open a book. Unlock a world. Return renewed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-turquouise-green-50 font-sans">
        <Header />

        <main>{children}</main>
        <div className="bg-orange-500 text-white text-sm py-2 text-center">
          Free Delivery on Orders Over KSh 3,000 | Call Us: +254 793 488207
        </div>

        <Script
          src="https://example.com/chat-widget.js"
          strategy="afterInteractive"
        />

        <Footer />
      </body>
    </html>
  );
}
