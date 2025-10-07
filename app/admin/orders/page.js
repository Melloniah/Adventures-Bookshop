'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminAPI } from '../../../lib/api';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
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

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
          Orders Management
        </h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading orders...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white shadow overflow-x-auto sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Order #',
                    'Customer',
                    'Stop',
                    'Route',
                    'Items',
                    'Total',
                    'Status',
                    'Date',
                    'Actions',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{order.full_name}</div>
                      <div className="text-gray-500">{order.email}</div>
                      <div className="text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.delivery_stop?.name || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.delivery_route?.name || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.order_items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      KSh {order.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        {order.status === 'pending' && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, 'confirmed')
                            }
                            className="text-green-600 hover:text-green-900"
                            title="Confirm Order"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        )}
                        {order.status !== 'cancelled' &&
                          order.status !== 'delivered' && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order.id, 'cancelled')
                              }
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Order"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-base sm:text-lg">
                      Order #{order.order_number}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/admin/orders/${order.id}`}>
                    <EyeIcon className="h-6 w-6 text-teal-600" />
                  </Link>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Customer:</strong> {order.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Stop:</strong> {order.delivery_stop?.name || '—'}
                  </p>
                  <p>
                    <strong>Route:</strong> {order.delivery_route?.name || '—'}
                  </p>
                  <p>
                    <strong>Total:</strong> KSh{' '}
                    {order.total_amount?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>

                {/* Mobile Actions */}
                <div className="flex justify-end mt-3 space-x-3">
                  {order.status === 'pending' && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(order.id, 'confirmed')
                      }
                      className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-800"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>Confirm</span>
                    </button>
                  )}
                  {order.status !== 'cancelled' &&
                    order.status !== 'delivered' && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.id, 'cancelled')
                        }
                        className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
