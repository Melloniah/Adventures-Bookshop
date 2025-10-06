// app/checkout/page.js
'use client';
import CheckoutForm from '../../components/Cart/CheckOutForm';

export default function CheckoutPage() {
  return (
    <div className="py-8 max-w-2xl mx-auto">
      <CheckoutForm />
    </div>
  );
}
