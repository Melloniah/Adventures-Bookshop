import Script from "next/script";
import "./globals.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Toaster } from "react-hot-toast";
import { HeartOff } from "lucide-react";

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
       

        <Script
          src="https://example.com/chat-widget.js"
          strategy="afterInteractive"
        />

        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
