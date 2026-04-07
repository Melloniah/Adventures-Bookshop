import { productAPI } from "../../../lib/api";
import { getImageUrl } from "../../../utils/imageUtils";
import ProductDetail from "./ProductDetail";

// ✅ Dynamic SEO metadata per product
export async function generateMetadata({ params }) {
  const { id } = await params; 
  
  try {
    // 2. USE 'id' HERE (NOT params.id)
    const res = await productAPI.getById(id); 
    const product = res.data?.product || res.data;

    if (!product || !product.name) {
  throw new Error("Product data missing");
    }
    const imageUrl = getImageUrl(product.image)
      ? `https://adventuresbookshop.org${getImageUrl(product.image)}`
      : "https://adventuresbookshop.org/og-image.jpg";

    return {
      title: product.name,
      description: product.description
        ? `${product.description.slice(0, 150)}...`
        : `Buy ${product.name} at Adventures Bookshop. Quality school supplies and stationery in Nairobi.`,
      openGraph: {
        title: `${product.name} | Adventures Bookshop`,
        description: product.description || `Buy ${product.name} at Adventures Bookshop, Nairobi.`,
        // 3. USE 'id' HERE TOO
        url: `https://adventuresbookshop.org/products/${id}`, 
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description || `Buy ${product.name} at Adventures Bookshop.`,
        images: [imageUrl],
      },
      alternates: {
        // 4. AND HERE
        canonical: `https://adventuresbookshop.org/products/${id}`,
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Product Not Found",
      description: "Browse our full range of books and stationery at Adventures Bookshop.",
    };
  }
}

// ✅ JSON-LD structured data for the product
async function ProductSchema({ id }) {
  try {
    const res = await productAPI.getById(id);
    const product = res.data?.product || res.data;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: getImageUrl(product.image)
        ? `https://adventuresbookshop.org${getImageUrl(product.image)}`
        : "https://adventuresbookshop.org/og-image.jpg",
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "KES",
        availability:
          product.stock_quantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Adventures Bookshop",
        },
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  } catch {
    return null;
  }
}
export default async function ProductPage({ params }) {
  // 1. We resolve the promise here
  const { id } = await params;
  
  return (
    <>
      {/* 2. Use the 'id' variable, NOT 'params.id' */}
      <ProductSchema id={id} />
      <ProductDetail id={id} />
    </>
  );
}