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
    cancelled: [],
  };

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrderById(id);
      setOrder(data);
      setNewStatus('');
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
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-12">Loading order...</div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const currentStatus = order.status;
  const statusHistory = order.status_history || [];

  return (
    <div className="max-w-full sm:max-w-5xl mx-auto space-y-6 px-3 sm:px-6 py-6">
      <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
        Order #{order.order_number}
      </h1>

      {/* Customer Info */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-3">
        <h2 className="font-semibold text-lg text-center sm:text-left">Customer Info</h2>
        <div className="text-sm sm:text-base space-y-1">
          <p><strong>Name:</strong> {order.full_name}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
        </div>
      </div>

      {/* Delivery Info */}
      {(order.delivery_route || order.delivery_stop || order.location) && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-2">
          <h2 className="font-semibold text-lg text-center sm:text-left">Delivery Info</h2>
          <div className="text-sm sm:text-base space-y-1">
            {order.delivery_route && <p><strong>Route:</strong> {order.delivery_route.name}</p>}
            {order.delivery_stop && <p><strong>Stop:</strong> {order.delivery_stop.name}</p>}
            {order.location && <p><strong>Location:</strong> {order.location}</p>}
            <p><strong>Delivery Fee:</strong> KSh {order.delivery_fee?.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-2 overflow-x-auto">
        <h2 className="font-semibold text-lg text-center sm:text-left">
          Items ({order.order_items.length})
        </h2>
        <div className="overflow-x-auto">
          <ul className="divide-y divide-gray-200 min-w-[300px] sm:min-w-[500px]">
            {order.order_items.map((item) => (
              <li key={item.id} className="py-2 flex justify-between text-xs sm:text-sm md:text-base">
                <span className="truncate">{item.product.name} × {item.quantity}</span>
                <span className="whitespace-nowrap">KSh {(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-2 font-bold text-sm sm:text-base flex justify-between">
          <span>Total Amount:</span>
          <span>KSh {(order.total_amount + (order.delivery_fee || 0)).toLocaleString()}</span>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 space-y-3">
        <h2 className="font-semibold text-lg text-center sm:text-left">Status</h2>
        <div className="flex justify-center sm:justify-start">
          <span
            className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(currentStatus)}`}
          >
            {currentStatus}
          </span>
        </div>

        {/* Admin dropdown */}
        {allowedTransitions[currentStatus]?.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:space-x-2 mt-2 space-y-2 sm:space-y-0">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <option value="">Select new status</option>
              {allowedTransitions[currentStatus].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={!newStatus || updating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-center sm:text-left">Status History</h3>
          <ul className="border-l-2 border-gray-200 pl-4 space-y-2 text-xs sm:text-sm md:text-base">
            {statusHistory.length === 0 ? (
              <li className="text-gray-500 text-center sm:text-left">No history yet</li>
            ) : (
              statusHistory.map((log, idx) => (
                <li key={idx} className="relative">
                  <span
                    className={`absolute -left-4 top-1 w-2 h-2 rounded-full ${getStatusColor(log.new_status)}`}
                  ></span>
                  {log.old_status} → <strong>{log.new_status}</strong> (
                  {new Date(log.changed_at).toLocaleString()})
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="text-xs sm:text-sm md:text-base"><strong>Payment Status:</strong> {order.payment_status}</div>
        <div className="text-xs sm:text-sm md:text-base"><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
}
