import CheckoutForm from '../../components/CheckoutForm';

export const metadata = {
  title: 'Checkout - SchoolMall Bookshop',
  description: 'Complete your order securely with M-Pesa or WhatsApp',
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutForm />
    </div>
  );
}