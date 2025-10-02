'use client'

import { useState } from 'react';
import { useCartStore } from '../../store/useStore';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { orderAPI, paymentAPI } from 'lib/api';

export default function CheckoutForm() {
  const [customerInfo, setCustomerInfo] = useState({
    full_name: '',
    phone: '',
    email: '',
    location: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);

  const { items: cartItems, clearCart, getTotalPrice } = useCartStore();
  const totalAmount = getTotalPrice();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const orderData = {
      full_name: customerInfo.full_name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      location: customerInfo.location,
      notes: customerInfo.notes || '',
      payment_method: paymentMethod,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // Create order
    const orderResponse = await orderAPI.customerAddAOrder(orderData);
    const orderResult = orderResponse.data;

    if (paymentMethod === 'mpesa') {
      const mpesaResponse = await paymentAPI.initiateMpesa({
        order_id: orderResult.id,
        phone_number: customerInfo.phone,
        amount: totalAmount,
      });
      const mpesaResult = mpesaResponse.data;

      if (mpesaResult.success) {
        toast.success('M-Pesa STK push sent! Check your phone.');
        clearCart();
        window.location.href = `/orders/${orderResult.id}?payment_pending=true`;
      } else {
        toast.error('M-Pesa payment failed. Try again.');
      }

    } else if (paymentMethod === 'whatsapp') {
      const whatsappResponse = await paymentAPI.sendWhatsappOrder(orderResult.id);
      const whatsappResult = whatsappResponse.data;

      if (whatsappResult.success) {
        window.open(whatsappResult.whatsapp_url, '_blank');
        toast.success('Order sent via WhatsApp! We’ll contact you soon.');
        clearCart();
      } else {
        toast.error('Failed to send order via WhatsApp.');
      }
    }

  } catch (error) {
    console.error('Order failed:', error);
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else {
      toast.error('Order failed. Check your connection and try again.');
    }
  } finally {
    setLoading(false);
  }
};



  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to continue with checkout</p>
        <Link href="/products" className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>

      {/* Order Summary */}
      <div className="bg-red-50 p-6 rounded-lg mb-8 border-l-4 border-red-500">
        <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2 pb-2 border-b border-red-100">
            <span className="text-sm font-medium">{item.name} × {item.quantity}</span>
            <span className="text-lg font-bold text-red-600">KSh {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between items-center font-bold text-lg mt-4 pt-4 border-t border-red-200">
          <span>Total Amount:</span>
          <span className="text-xl text-red-600">KSh {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit}>
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name *</label>
            <input type="text" name="full_name" required value={customerInfo.full_name} onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Phone *</label>
            <input type="tel" name="phone" required value={customerInfo.phone} onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
          <input type="email" name="email" value={customerInfo.email} onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Location *</label>
          <textarea name="location" required value={customerInfo.location} onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" rows={3} />
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-4 text-gray-700">Payment Method</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'mpesa' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}>
              <input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-4 text-red-500" />
              <div>
                <div className="font-semibold">M-Pesa</div>
                <div className="text-sm text-gray-500">Secure STK Push</div>
              </div>
            </label>
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'whatsapp' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
              <input type="radio" name="payment" value="whatsapp" checked={paymentMethod === 'whatsapp'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-4 text-green-500" />
              <div>
                <div className="font-semibold">WhatsApp</div>
                <div className="text-sm text-gray-500">Order via chat</div>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Processing Order...' : `Complete Order - KSh ${totalAmount.toLocaleString()}`}
        </button>
      </form>
    </div>
  );
}
