
"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import RouteForm from "@/components/RouteForm";

export default function AdminDeliveryRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRoutes = async () => {
    try {
      const res = await adminAPI.getAllDeliveryRoutes();
      setRoutes(res.data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await adminAPI.deleteDeliveryRoute(id);
      fetchRoutes();
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingRoute(null);
    fetchRoutes();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Delivery Routes</h1>
        <button
          onClick={() => {
            setEditingRoute(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Route
        </button>
      </div>

      {showForm && (
        <RouteForm route={editingRoute} onSaved={handleSaved} />
      )}

      {loading ? (
        <p>Loading routes...</p>
      ) : routes.length === 0 ? (
        <p>No delivery routes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Route Name</th>
                <th className="p-3 text-left">Stops</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, i) => (
                <tr key={route.id} className="border-t">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{route.name}</td>
                  <td className="p-3">
                    {route.stops?.map((s) => `${s.name} (${s.price} KES)`).join(", ")}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingRoute(route);
                        setShowForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
