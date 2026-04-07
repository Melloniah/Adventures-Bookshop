import { productAPI } from "../../../lib/api";
import { getImageUrl } from "../../../utils/imageUtils";
import ProductDetail from "./ProductDetail";

// ✅ Dynamic SEO metadata per product
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await productAPI.getById(params.id);
    const product = res.data;

    const imageUrl = getImageUrl(product.image)
      ? `https://adventuresbookshop.org${getImageUrl(product.image)}`
      : "https://adventuresbookshop.org/og-image.jpg";

    return {
      
      title: product.name,  // layout.js template adds "| Adventures Bookshop" automatically
      description: product.description
        ? `${product.description.slice(0, 150)}...`
        : `Buy ${product.name} at Adventures Bookshop. Quality school supplies and stationery in Nairobi.`,
      openGraph: {
        title: `${product.name} | Adventures Bookshop`,
        description: product.description || `Buy ${product.name} at Adventures Bookshop, Nairobi.`,
        url: `https://adventuresbookshop.org/products/${params.id}`,
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
        canonical: `https://adventuresbookshop.org/products/${params.id}`,
      },
    };
  } catch {
    // Fallback if product fetch fails
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
    const product = res.data;

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
  const { id } = await params;
  
  return (
    <>
     <div className="bg-red-500 text-white p-10">
      <h1>IF YOU SEE THIS, THE ROUTE IS WORKING. ID: {id}</h1>
      <ProductDetail id={id} />
    </div>
      <ProductSchema id={params.id} />
      <ProductDetail id={params.id} />
    </>
  );
}