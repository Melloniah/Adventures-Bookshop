import { useState } from 'react';
import { useStore } from '../store/useStore';
import Link from 'next/link';

export default function CheckoutForm() {
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', email: '', address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Mpesa');
  const [loading, setLoading] = useState(false);
  
  const { cartItems, clearCart } = useStore();
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        delivery_address: customerInfo.address,
        payment_method: paymentMethod,
        order_items: JSON.stringify(cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))),
        total_amount: totalAmount
      };

      // Create order
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const orderResult = await orderResponse.json();

      if (orderResponse.ok) {
        if (paymentMethod === 'mpesa') {
          // M-Pesa STK Push
          const mpesaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mpesa/stk-push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone_number: customerInfo.phone,
              amount: totalAmount,
              order_id: orderResult.order_id
            })
          });

          const mpesaResult = await mpesaResponse.json();
          
          if (mpesaResult.success) {
            alert('M-Pesa payment request sent! Check your phone for the prompt.');
            clearCart();
          } else {
            alert('M-Pesa payment failed. Please try again.');
          }
        } else if (paymentMethod === 'whatsapp') {
          // WhatsApp Order
          const whatsappResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whatsapp/send-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_info: customerInfo,
              order_items: cartItems,
              total_amount: totalAmount,
              order_id: orderResult.order_id
            })
          });

          if (whatsappResponse.ok) {
            alert('Your order has been sent via WhatsApp! We will contact you shortly.');
            clearCart();
          }
        }
      } else {
        alert('Order creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to continue with checkout</p>
        <Link href="/products" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center">Checkout</h2>
      
      {/* Order Summary */}
      <div className="bg-orange-50 p-6 rounded-lg mb-8 border-l-4 border-orange-500">
        <h3 className="font-semibold mb-4 text-lg">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2 pb-2 border-b border-orange-100">
            <span className="text-sm font-medium">{item.name} × {item.quantity}</span>
            <span className="text-lg font-bold text-orange-600">KES {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between items-center font-bold text-lg mt-4 pt-4 border-t border-orange-200">
          <span>Total Amount:</span>
          <span className="text-xl text-orange-600">KES {totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={customerInfo.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
              placeholder="0712345678"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Address</label>
          <textarea
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            rows={4}
            placeholder="Enter your full delivery address"
          />
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-4 text-gray-700">Choose Payment Method</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
              <input
                type="radio"
                name="payment"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-4 text-orange-500"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">📱</span>
                <div>
                  <div className="font-semibold">M-Pesa Payment</div>
                  <div className="text-sm text-gray-500">Secure STK Push payment</div>
                </div>
              </div>
            </label>
            
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
              <input
                type="radio"
                name="payment"
                value="whatsapp"
                checked={paymentMethod === 'whatsapp'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-4 text-orange-500"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">💬</span>
                <div>
                  <div className="font-semibold">WhatsApp Order</div>
                  <div className="text-sm text-gray-500">Order via WhatsApp chat</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Processing Order...
            </div>
          ) : (
            `Complete Order - KES ${totalAmount.toLocaleString()}`
          )}
        </button>
      </form>
    </div>
  );
}