'use client';

import { useState, useEffect } from "react";
import { adminAPI } from "lib/api";
import RouteForm from "../../../components/Admin/RouteForm";

export default function AdminDeliveryRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20; // items per page

  const fetchRoutes = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllDeliveryRoutes({ page, limit });
      setRoutes(res.data.routes);
      setTotalPages(res.data.total_pages);
      setCurrentPage(res.data.current_page);
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await adminAPI.deleteDeliveryRoute(id);
      fetchRoutes(currentPage);
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingRoute(null);
    fetchRoutes(currentPage);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Delivery Routes</h1>
        <button
          onClick={() => {
            setEditingRoute(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          + Add Route
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6">
          <RouteForm route={editingRoute} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Routes Table */}
      {loading ? (
        <p className="text-gray-600 text-center py-6">Loading routes...</p>
      ) : routes.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No delivery routes found.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-700">#</th>
                  <th className="p-3 text-left font-medium text-gray-700">Route Name</th>
                  <th className="p-3 text-left font-medium text-gray-700">Stops</th>
                  <th className="p-3 text-left font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route, i) => (
                  <tr key={route.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{(currentPage - 1) * limit + i + 1}</td>
                    <td className="p-3 font-semibold">{route.name}</td>
                    <td className="p-3 text-gray-600">
                      {route.stops?.map((s) => `${s.name} (${s.price} KES)`).join(", ")}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => {
                            setEditingRoute(route);
                            setShowForm(true);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchRoutes(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchRoutes(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? 'bg-blue-500 text-white border-blue-500' : ''
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchRoutes(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
