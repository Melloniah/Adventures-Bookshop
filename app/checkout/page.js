import CheckoutForm from '../../components/Cart/CheckOutForm';

export const metadata = {
  title: "Checkout",
  robots: {
    index: false,  // ✅ Don't let Google index checkout pages
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <div className="py-8 max-w-2xl mx-auto">
      <CheckoutForm />
    </div>
  );
}