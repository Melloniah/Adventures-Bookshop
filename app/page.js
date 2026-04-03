import HeroSection from "../components/Home/HeroSection";
import CategorySection from "../components/Home/CategorySection";
import ProductSections from "../components/Home/ProductSections";

export const metadata = {
  title: "Adventures Bookshop | Books, School Supplies & Stationery in Nairobi",
  description:
    "Adventures Bookshop is your one-stop shop for school supplies, books, stationery, art materials and technology in Nairobi. Located on Mfangano Street, opposite Quickmart Afya Center. Free delivery on orders over KSh 3,000.",
  keywords: [
    "school supplies nairobi",
    "bookshop",
    "bookshops",
    "stationery kenya",
    "books nairobi",
    "art materials kenya",
    "exercise books nairobi",
    "toys",
    "school books kenya",
    "technology students nairobi",
    "adventures bookshop",
    "mfangano street nairobi",
  ],
  authors: [{ name: "Adventures Bookshop" }],
  creator: "Adventures Bookshop",
  metadataBase: new URL("https://adventuresbookshop.org/"), 
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Adventures Bookshop | Books, School Supplies & Stationery in Nairobi",
    description:
      "Your one-stop shop for school supplies, books, stationery, art materials and technology. Free delivery on orders over KSh 3,000.",
    url: "https://adventuresbookshop.org/", 
    siteName: "Adventures Bookshop",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Adventures Bookshop - Books and Stationery Supplies in Nairobi",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adventures Bookshop | Books, School Supplies in Nairobi",
    description:
      "Your one-stop shop for school supplies, books, stationery and more. Free delivery on orders over KSh 3,000.",
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

// Local Business Structured Data (helps Google Maps & local searches)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "BookStore",
  name: "Adventures Bookshop",
  description:
    "Your one-stop shop for educational materials, books, stationery, toys, and technology for students of all ages.",
  url: "https://adventuresbookshop.org", 
  telephone: "+254724047489",
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
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Books & Stationery",
  },
  priceRange: "KSh",
  currenciesAccepted: "KES",
  paymentAccepted: "Cash, M-Pesa",
  areaServed: {
    "@type": "City",
    name: "Nairobi",
  },
};

export default function Home() {
  return (
    <>
      {/* Inject Local Business structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <HeroSection />
      <CategorySection />
      <ProductSections />
    </>
  );
}