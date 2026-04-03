export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/checkout/", "/track-order/"],
      },
    ],
    sitemap: "https://adventuresbookshop.org/sitemap.xml",
  };
}