import { useState } from 'react';
import { useCartStore } from '../store/useStore'; // Updated to match your store
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CheckoutForm() {
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', email: '', address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // lowercase for consistency
  const [loading, setLoading] = useState(false);
  
  const { items: cartItems, clearCart, getTotalPrice } = useCartStore(); // Updated to match store
  const totalAmount = getTotalPrice(); // Use store method

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        full_name: customerInfo.name,        // Match backend schema
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address,
        city: 'Nairobi', // Default or ask user
        payment_method: paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      // Create order using your API structure
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const orderResult = await orderResponse.json();

      if (orderResponse.ok) {
        if (paymentMethod === 'mpesa') {
          // M-Pesa STK Push - Updated to match your backend
          const mpesaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/mpesa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: orderResult.id,
              phone_number: customerInfo.phone,
              amount: totalAmount
            })
          });

          const mpesaResult = await mpesaResponse.json();
          
          if (mpesaResult.success) {
            toast.success('M-Pesa payment request sent! Check your phone.');
            clearCart();
            // Redirect to order confirmation
            window.location.href = `/orders/${orderResult.id}?payment_pending=true`;
          } else {
            toast.error('M-Pesa payment failed. Please try again.');
          }
        } else if (paymentMethod === 'whatsapp') {
          // WhatsApp Order - Keep your existing logic
          const whatsappMessage = `
New Order from SchoolMall:
Order ID: ${orderResult.order_number}
Customer: ${customerInfo.name}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email}
Address: ${customerInfo.address}

Items:
${cartItems.map(item => `- ${item.name} x ${item.quantity} = KSh ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Total: KSh ${totalAmount.toLocaleString()}
          `;

          // Open WhatsApp with pre-filled message
          const whatsappUrl = `https://wa.me/254793488207?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(whatsappUrl, '_blank');
          
          toast.success('Order details sent to WhatsApp! We will contact you shortly.');
          clearCart();
        }
      } else {
        toast.error(orderResult.detail || 'Order creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Order failed:', error);
      toast.error('Order failed. Please check your connection and try again.');
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              placeholder="254712345678"
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Address *</label>
          <textarea
            name="address"
            required
            value={customerInfo.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
            rows={4}
            placeholder="Enter your full delivery address"
          />
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-4 text-gray-700">Choose Payment Method</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              paymentMethod === 'mpesa' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-4 text-red-500"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">📱</span>
                <div>
                  <div className="font-semibold">M-Pesa Payment</div>
                  <div className="text-sm text-gray-500">Secure STK Push payment</div>
                </div>
              </div>
            </label>
            
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              paymentMethod === 'whatsapp' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="whatsapp"
                checked={paymentMethod === 'whatsapp'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-4 text-green-500"
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
          className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Processing Order...
            </div>
          ) : (
            `Complete Order - KSh ${totalAmount.toLocaleString()}`
          )}
        </button>
      </form>
    </div>
  );
}