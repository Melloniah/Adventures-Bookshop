'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { adminAPI } from '../../../../lib/api';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await adminAPI.updateOrderStatus(id, { status: newStatus });
      toast.success('Order status updated');
      await fetchOrder(); // refresh order data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-12">Loading order...</div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Customer Info */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
          <p><strong>Name:</strong> {order.full_name}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Location:</strong> {order.location}</p>
          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
        </div>

        {/* Items */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Items ({order.order_items.length})</h2>
          <ul className="divide-y divide-gray-200">
            {order.order_items.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold text-lg flex justify-between">
            <span>Total Amount:</span>
            <span>KSh {order.total_amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>

          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <div className="flex space-x-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('confirmed')}
                  className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                >
                  <CheckIcon className="h-5 w-5 mr-1" /> Confirm
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                <XMarkIcon className="h-5 w-5 mr-1" /> Cancel
              </button>
            </div>
          )}
        </div>

        <div>
          <strong>Payment Status:</strong> {order.payment_status}
        </div>
        <div>
          <strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
