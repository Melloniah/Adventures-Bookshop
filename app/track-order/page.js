import TrackOrderContent from "./TrackOrderContent";

export const metadata = {
  title: "Track Your Order",
  description: "Track the status of your Adventures Bookshop order using your email and order number.",
  robots: {
    index: false,  // ✅ No need for Google to index personal order tracking
    follow: false,
  },
};

export default function TrackOrderPage() {
  return <TrackOrderContent />;
}