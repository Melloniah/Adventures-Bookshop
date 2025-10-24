"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "../../../lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-600 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to Adventures Bookshop Admin Panel
        </p>
      </header>

      {stats && (
        <>
          {/* --- STAT CARDS --- */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Products"
              value={stats.total_products}
              iconPath="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              color="red"
            />
            <StatCard
              title="Total Orders"
              value={stats.total_orders}
              iconPath="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2"
              color="blue"
            />
            <StatCard
              title="Active Categories"
              value={stats.category_stats?.active || 0}
              iconPath="M12 4v16m8-8H4"
              color="teal"
            />
            <StatCard
              title="Inactive Categories"
              value={stats.category_stats?.inactive || 0}
              iconPath="M4 4h16v16H4z"
              color="gray"
            />
          </section>

          {/* --- CATEGORY BREAKDOWN --- */}
          {stats.category_stats && (
            <section className="bg-white rounded-lg shadow p-6 mb-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Category Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <MiniStat
                  label="Total Categories"
                  value={stats.category_stats.total}
                />
                <MiniStat
                  label="Parent Categories"
                  value={stats.category_stats.parents}
                />
                <MiniStat
                  label="Subcategories"
                  value={stats.category_stats.subcategories}
                />
                <MiniStat
                  label="With Products"
                  value={stats.category_stats.with_products}
                />
                <MiniStat
                  label="Empty Categories"
                  value={stats.category_stats.empty}
                />
              </div>
            </section>
          )}

          {/* --- RECENT ORDERS --- */}
          {stats.recent_orders?.length > 0 && (
            <section className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <span className="text-sm text-gray-500">
                  {stats.recent_orders.length} shown
                </span>
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Order ID</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Total</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recent_orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {order.customer_name ||
                            order.customer_phone ||
                            "N/A"}
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-semibold">
                          KSh {order.total_amount?.toLocaleString() || "0"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE COLLAPSIBLE CARDS */}
              <div className="block md:hidden">
                {stats.recent_orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

/* --- Helper Components --- */

function StatCard({ title, value, iconPath, color }) {
  const colorMap = {
    red: "text-red-600 bg-red-100",
    blue: "text-blue-600 bg-blue-100",
    teal: "text-teal-600 bg-teal-100",
    gray: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}
      >
        <svg
          className={`w-6 h-6 ${colorMap[color].split(" ")[0]}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const badgeClasses = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        badgeClasses[status] || badgeClasses.default
      }`}
    >
      {status}
    </span>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border-b border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-800">Order #{order.id}</p>
          <p className="text-gray-600 text-sm">
            KSh {order.total_amount?.toLocaleString() || "0"}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {expanded && (
        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p>
            <strong>Customer:</strong>{" "}
            {order.customer_name || order.customer_phone || "N/A"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
