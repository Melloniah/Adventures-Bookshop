import Script from "next/script";
import "./globals.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Adventures Bookshop | Your story starts here",
  description:
    "Order your favorite books online from Adventures Bookshop — Nairobi’s trusted bookstore. Enjoy fast delivery, great prices, and pay-after-delivery options.",
  keywords: [
    "Bookshop Kenya",
    "Buy books Kenya",
    "Adventures Bookshop",
    "Online bookstore Kenya",
    "Stationery Kenya",
    "Laptops and books Kenya",
    "Kids board games",
    "College materials Kenya",
    "Affordable books Nairobi",
    "Pay after delivery bookstore",
  ],
  authors: [{ name: "Melloniah Adventures Bookshop", url: "https://adventuresbookshop.org" }],
  metadataBase: new URL("https://adventuresbookshop.org"),

  openGraph: {
    title: "Adventures Bookshop | Open a book. Unlock a world.",
    description:
      "Discover and order your favorite books online from Adventures Bookshop — Kenyas favorite book and stationery store.",
    url: "https://adventuresbookshop.org",
    siteName: "Adventures Bookshop",
    images: [
      {
        url: "/Adventures-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Adventures Bookshop banner",
      },
    ],
    locale: "en_KE",
    type: "website",
  },

  alternates: {
    canonical: "https://adventuresbookshop.org",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-turquouise-green-50 font-sans">
        <Header />
        <main>{children}</main>
        <Footer />

        {/* ✅ JSON-LD Structured Data for SEO */}
        <Script
          id="ld-json-localbusiness"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BookStore",
              name: "Adventures Bookshop",
              url: "https://adventuresbookshop.org",
              logo: "https://adventuresbookshop.org/Adventures-logo.jpeg",
              description:
                "Adventures Bookshop is a Nairobi-based online bookstore offering books, stationery, college materials and learning materials with pay-after-delivery options.",
              telephone: "+254724047489",
              sameAs: [
        "https://www.facebook.com/adventures.bookshop.690147",
        "https://www.instagram.com/adventures_bookshop?igsh=MXA3dDZdHR1cjhxdw==",
        "https://wa.me/254724047489",
        "https://adventuresbookshop.org",
      ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Mfangano Street",
                addressLocality: "Nairobi",
                addressRegion: "Nairobi County",
                addressCountry: "KE",
              },
              openingHours: "Mon-Sun 08:00-19:00",
            }),
          }}
        />

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
