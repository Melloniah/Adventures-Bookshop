'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { orderAPI, paymentAPI, deliveryAPI } from 'lib/api';

export default function CheckoutForm() {
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState({
    full_name: '',
    phone: '',
    email: '',
    location: '',
    estate: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);

  const [deliverOrder, setDeliverOrder] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);

  const { items: cartItems, clearCart, getTotalPrice } = useCartStore();
  const totalAmount = getTotalPrice();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    deliveryAPI.getAllRoutes()
      .then((res) => setRoutes(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      deliveryAPI.getRouteById(selectedRoute)
        .then((res) => setStops(res.data.stops || []))
        .catch(console.error);
    } else {
      setStops([]);
    }
  }, [selectedRoute]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (deliverOrder && !selectedStop) {
      return toast.error('Please select a delivery stop');
    }

    setLoading(true);

    try {
      const stopObj = stops.find(s => s.id === parseInt(selectedStop));
      const fee = stopObj?.price || 0;

      const orderData = {
        full_name: customerInfo.full_name,
        email: customerInfo.email || null,
        phone: customerInfo.phone,
        location: deliverOrder && customerInfo.location ? customerInfo.location : null,
        estate: deliverOrder && customerInfo.estate ? customerInfo.estate : null,
        delivery_route_id: deliverOrder && selectedRoute ? parseInt(selectedRoute) : null,
        delivery_stop_id: deliverOrder && selectedStop ? parseInt(selectedStop) : null,
        delivery_fee: deliverOrder ? fee : 0,
        notes: customerInfo.notes || '',
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log('Order data being sent:', orderData);

      const orderResponse = await orderAPI.customerAddAOrder(orderData);
      const orderResult = orderResponse.data;

      clearCart();

      if (paymentMethod === 'mpesa') {
        const mpesaResponse = await paymentAPI.initiateMpesa({
          order_id: orderResult.id,
          phone_number: customerInfo.phone,
          amount: totalAmount + (deliverOrder ? fee : 0),
        });
        const mpesaResult = mpesaResponse.data;

        if (mpesaResult.success) {
          toast.success('M-Pesa STK push sent! Check your phone.');
          window.location.href = `/orders/${orderResult.id}?payment_pending=true`;
        } else {
          toast.error('M-Pesa payment failed. Try again.');
        }
      } else if (paymentMethod === 'whatsapp') {
        const whatsappResponse = await paymentAPI.sendWhatsappOrder(orderResult.id);
        const whatsappResult = whatsappResponse.data;

        if (whatsappResult.success) {
          window.open(whatsappResult.whatsapp_url, '_blank');
          toast.success('Order sent via WhatsApp! We will contact you soon.')
        } else {
          toast.error('Failed to send order via WhatsApp.');
        }
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'Order failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    clearCart();
    router.push('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to continue with checkout</p>
        <button
          onClick={handleContinueShopping}
          className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Continue Shopping
        </button>
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

        {deliverOrder && selectedRoute && selectedStop && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Delivery Details</h4>
            <p className="text-sm text-gray-700"><span className="font-medium">Route:</span> {routes.find(r => r.id === parseInt(selectedRoute))?.name}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">Stop:</span> {stops.find(s => s.id === parseInt(selectedStop))?.name}</p>
          </div>
        )}

        <div className="flex justify-between items-center font-bold text-lg mt-2">
          <span>Delivery Fee:</span>
          <span className="text-xl text-teal-600">KSh {(deliverOrder ? deliveryFee : 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg mt-2">
          <span>Total Amount:</span>
          <span className="text-xl text-teal-600">KSh {(totalAmount + (deliverOrder ? deliveryFee : 0)).toLocaleString()}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit}>
        {/* BASIC INFO - ALWAYS SHOWN */}
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
          <label className="block text-sm font-semibold mb-2 text-gray-700">Email (Optional)</label>
          <input type="email" name="email" value={customerInfo.email} onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" />
        </div>

        {/* DELIVER TOGGLE */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="deliverOrder"
            checked={deliverOrder}
            onChange={() => setDeliverOrder(!deliverOrder)}
            className="mr-3 h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="deliverOrder" className="text-gray-700 font-semibold">Deliver my order</label>
        </div>

        {/* DELIVERY SECTION - ONLY SHOWN WHEN deliverOrder IS TRUE */}
        {deliverOrder && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Location/Address *</label>
              <textarea name="location" required value={customerInfo.location} onChange={handleInputChange}
                placeholder="Enter your full delivery address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" rows={3} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Estate/Building Name (Optional)</label>
              <input type="text" name="estate" value={customerInfo.estate} onChange={handleInputChange}
                placeholder="E.g., Greenview Apartments, Block C"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Notes (Optional)</label>
              <textarea name="notes" value={customerInfo.notes} onChange={handleInputChange}
                placeholder="E.g., Apartment 5B, Call when you arrive, Leave at gate"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none" rows={3} />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Route *</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Select a route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>

              {stops.length > 0 && (
                <>
                  <label className="block text-sm font-semibold mb-2 mt-4 text-gray-700">Delivery Stop *</label>
                  <select
                    value={selectedStop}
                    onChange={(e) => {
                      const stopId = e.target.value;
                      setSelectedStop(stopId);
                      const stop = stops.find((s) => s.id === parseInt(stopId));
                      setDeliveryFee(stop ? stop.price : 0);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select a stop</option>
                    {stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} — KSh {stop.price}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </>
        )}

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

        <button type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg hover:bg-teal-700 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing Order...' : `Complete Order - KSh ${(totalAmount + (deliverOrder ? deliveryFee : 0)).toLocaleString()}`}
        </button>
      </form>
    </div>
  );
}