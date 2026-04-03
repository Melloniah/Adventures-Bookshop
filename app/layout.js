import Script from "next/script";
import "./globals.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: {
    default: "Adventures Bookshop | Your Story Starts Here",
    template: "%s | Adventures Bookshop", // ✅ Auto-appends site name to all page titles
  },
  description:
    "Order books, stationery, art materials and school supplies online from Adventures Bookshop — Nairobi's trusted bookstore on Mfangano Street. Fast delivery, great prices, and pay-after-delivery options.",
  keywords: [
    "Bookshop",
    "bookshop kenya",
    "buy books kenya",
    "adventures bookshop",
    "online bookstore kenya",
    "stationery kenya",
    "school supplies nairobi",
    "kids board games kenya",
    "college materials kenya",
    "affordable books nairobi",
    "pay after delivery bookstore",
    "mfangano street nairobi",
    "art materials kenya",
    "exercise books nairobi",
  ],
  authors: [{ name: "Adventures Bookshop", url: "https://adventuresbookshop.org" }],
  creator: "Adventures Bookshop",
  metadataBase: new URL("https://adventuresbookshop.org"),
  alternates: {
    canonical: "https://adventuresbookshop.org",
  },

  openGraph: {
    title: "Adventures Bookshop | Open a Book. Unlock a World.",
    description:
      "Discover and order books, stationery and school supplies from Adventures Bookshop — Kenya's favourite book and stationery store. Located on Mfangano Street, Nairobi.",
    url: "https://adventuresbookshop.org",
    siteName: "Adventures Bookshop",
    images: [
      {
        url: "/og-image.jpg", // ✅ Use the OG image we just created, not the logo directly
        width: 1200,
        height: 630,
        alt: "Adventures Bookshop - Books, Stationery & School Supplies in Nairobi",
      },
    ],
    locale: "en_KE",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Adventures Bookshop | Your Story Starts Here",
    description:
      "Books, stationery and school supplies delivered in Nairobi. Free delivery on orders over KSh 3,000.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "BookStore",
  name: "Adventures Bookshop",
  url: "https://adventuresbookshop.org",
  logo: "https://adventuresbookshop.org/og-image.jpg",
  description:
    "Adventures Bookshop is a Nairobi-based bookstore offering books, stationery, school supplies, art materials and learning resources with pay-after-delivery options.",
  telephone: "+254724047489",
  sameAs: [
    "https://www.facebook.com/adventures.bookshop.690147",
    "https://www.instagram.com/adventures_bookshop?igsh=MXA3dDZdHR1cjhxdw==",
    "https://wa.me/254724047489",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mfangano Street, Opposite Quickmart Afya Center",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.2872,
    longitude: 36.8283,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:30",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "07:30",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:00",
      closes: "19:00",
    },
  ],
  priceRange: "KSh",
  currenciesAccepted: "KES",
  paymentAccepted: "Cash, M-Pesa",
  areaServed: {
    "@type": "City",
    name: "Nairobi",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-turquouise-green-50 font-sans">
        <Header />
        <main>{children}</main>
        <Footer />

        <Script
          id="ld-json-localbusiness"
          type="application/ld+json"
          strategy="beforeInteractive" // ✅ Changed: helps Google find it faster
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />

        <Toaster position="top-right" />
      </body>
    </html>
  );
}