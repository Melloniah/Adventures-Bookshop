"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api";

export default function RouteForm({ route, onSaved, onCancel }) {
  const [name, setName] = useState("");
  const [stops, setStops] = useState([{ name: "", price: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route) {
      setName(route.name || "");
      setStops(route.stops || [{ name: "", price: "" }]);
    } else {
      setName("");
      setStops([{ name: "", price: "" }]);
    }
  }, [route]);

  const handleStopChange = (i, field, value) => {
    const updated = [...stops];
    updated[i][field] = value;
    setStops(updated);
  };

  const addStop = () => setStops([...stops, { name: "", price: "" }]);
  const removeStop = (i) => setStops(stops.filter((_, index) => index !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        stops: stops.map((s) => ({
          name: s.name.trim(),
          price: parseFloat(s.price),
        })),
      };

      if (route?.id) {
        await adminAPI.updateDeliveryRoute(route.id, payload);
      } else {
        await adminAPI.createDeliveryRoute(payload);
      }

      onSaved();
    } catch (err) {
      console.error("Error saving route:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 border rounded-lg bg-white shadow-sm space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
        {route ? "Edit Delivery Route" : "Add New Delivery Route"}
      </h2>

      {/* Route name */}
      <input
        type="text"
        placeholder="Route Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-gray-300 p-2 sm:p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Stops */}
      <div>
        <label className="font-medium block mb-2 text-gray-700">Stops</label>
        {stops.map((stop, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3"
          >
            <input
              type="text"
              placeholder="Stop name"
              value={stop.name}
              onChange={(e) => handleStopChange(i, "name", e.target.value)}
              className="border border-gray-300 p-2 sm:p-3 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Price (KES)"
              value={stop.price}
              onChange={(e) => handleStopChange(i, "price", e.target.value)}
              className="border border-gray-300 p-2 sm:p-3 w-full sm:w-32 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {stops.length > 1 && (
              <button
                type="button"
                onClick={() => removeStop(i)}
                className="bg-red-500 text-white px-3 py-2 sm:py-1 rounded-md hover:bg-red-600 transition w-full sm:w-auto"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addStop}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition text-sm sm:text-base"
        >
          + Add Stop
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:py-3 rounded-md font-medium transition w-full sm:w-auto"
        >
          {loading ? "Saving..." : route ? "Update Route" : "Create Route"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-red-200 hover:bg-gray-300 text-white-800 px-5 py-2 sm:py-3 rounded-md font-medium transition w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
