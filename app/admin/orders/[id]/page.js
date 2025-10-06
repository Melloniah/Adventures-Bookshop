'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { adminAPI } from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const allowedTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: []
  };

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrderById(id);
      setOrder(data);
      setNewStatus(''); // reset dropdown
    } catch (error) {
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    const normalizedStatus = newStatus.trim().toLowerCase();

    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(id, { status: normalizedStatus });
      toast.success(`Order status updated to "${normalizedStatus}"`);
      await fetchOrder();
      setNewStatus('');
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.detail || 'Failed to update status');
    } finally {
      setUpdating(false);
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

  if (loading) return <div className="text-center py-12">Loading order...</div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const currentStatus = order.status;
  const statusHistory = order.status_history || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>

      {/* Customer Info */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
        <p><strong>Name:</strong> {order.full_name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
      </div>

      {/* Delivery Info */}
      {(order.delivery_route || order.delivery_stop || order.location) && (
        <div className="bg-white shadow rounded-lg p-6 space-y-2">
          <h2 className="font-semibold text-lg mb-2">Delivery Info</h2>
          {order.delivery_route && <p><strong>Route:</strong> {order.delivery_route.name}</p>}
{order.delivery_stop && <p><strong>Stop:</strong> {order.delivery_stop.name}</p>}

          {order.location && <p><strong>Location:</strong> {order.location}</p>}
          <p><strong>Delivery Fee:</strong> KSh {order.delivery_fee?.toLocaleString()}</p>
        </div>
      )}

      {/* Items */}
      <div className="bg-white shadow rounded-lg p-6 space-y-2">
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
          <span>KSh {(order.total_amount + (order.delivery_fee || 0)).toLocaleString()}</span>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white shadow rounded-lg p-6 space-y-2">
        <h2 className="font-semibold text-lg mb-1">Status</h2>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentStatus)}`}>
          {currentStatus}
        </span>

        {/* Admin dropdown */}
        {allowedTransitions[currentStatus]?.length > 0 && (
          <div className="flex space-x-2 mt-2">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1"
            >
              <option value="">Select new status</option>
              {allowedTransitions[currentStatus].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={!newStatus || updating}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Status History</h3>
          <ul className="border-l-2 border-gray-200 pl-4 space-y-1">
            {statusHistory.length === 0 ? (
              <li className="text-sm text-gray-500">No history yet</li>
            ) : (
              statusHistory.map((log, idx) => (
                <li key={idx} className="text-sm text-gray-700 relative">
                  <span className={`absolute -left-4 top-0 w-2 h-2 rounded-full ${getStatusColor(log.new_status)}`}></span>
                  {log.old_status} → <strong>{log.new_status}</strong> ({new Date(log.changed_at).toLocaleString()})
                </li>
              ))
            )}
          </ul>
        </div>

        <div><strong>Payment Status:</strong> {order.payment_status}</div>
        <div><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
}
