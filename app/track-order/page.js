'use client';

import { useState } from 'react';
import { orderAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function TrackOrder() {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!email || !orderNumber) return toast.error('Please fill both fields');

    setLoading(true);
    try {
      const { data } = await orderAPI.customerTrackOrder(email, orderNumber);
      setOrder(data);
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.detail || 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const currentStatus = order?.status;
  const statusHistory = order?.status_logs_list || [];

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Track Your Order</h1>

      <form onSubmit={handleTrackOrder} className="space-y-4">
        <input
          type="email"
          placeholder="Email used for order"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Order Number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track Order'}
        </button>
      </form>

      {order && (
        <div className="mt-8 bg-white shadow rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Order #{order.order_number}</h2>
          <p><strong>Name:</strong> {order.full_name}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Location:</strong> {order.location}</p>

          <div className="mt-2 font-bold">
            <span>Status: </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Status History Timeline */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Status History</h3>
            {statusHistory.length === 0 ? (
              <p className="text-sm text-gray-500">No history yet</p>
            ) : (
              <ul className="relative border-l-2 border-gray-200 pl-6 space-y-6">
                {statusHistory.map((log, idx) => {
                  const isCurrent = log.new_status === currentStatus;
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="text-sm text-gray-700 relative"
                    >
                      <span
                        className={`absolute -left-5 top-0 w-3 h-3 rounded-full ${getStatusColor(log.new_status)} ${
                          isCurrent ? 'w-4 h-4 animate-pulse' : ''
                        }`}
                      ></span>
                      <div>
                        <span className="font-medium">{log.old_status}</span> →{' '}
                        <span className={`font-semibold ${isCurrent ? 'text-indigo-600' : ''}`}>
                          {log.new_status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.changed_at).toLocaleString()}
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Items */}
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Items ({order.order_items.length})</h3>
            <ul className="divide-y divide-gray-200">
              {order.order_items.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 font-bold flex justify-between">
              <span>Total Amount:</span>
              <span>KSh {order.total_amount.toLocaleString()}</span>
            </div>
          </div>

          <div><strong>Payment Status:</strong> {order.payment_status}</div>
          <div><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
