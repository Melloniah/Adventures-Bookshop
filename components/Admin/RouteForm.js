"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";

export default function RouteForm({ route, onSaved }) {
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
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-3 mb-4 bg-white shadow">
      <h2 className="text-xl font-semibold">
        {route ? "Edit Delivery Route" : "Add New Delivery Route"}
      </h2>

      <input
        type="text"
        placeholder="Route Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 w-full"
      />

      <div>
        <label className="font-medium block mb-2">Stops</label>
        {stops.map((stop, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Stop name"
              value={stop.name}
              onChange={(e) => handleStopChange(i, "name", e.target.value)}
              className="border p-2 flex-1"
              required
            />
            <input
              type="number"
              placeholder="Price (KES)"
              value={stop.price}
              onChange={(e) => handleStopChange(i, "price", e.target.value)}
              className="border p-2 w-32"
              required
            />
            {stops.length > 1 && (
              <button
                type="button"
                onClick={() => removeStop(i)}
                className="bg-red-500 text-white px-3 rounded"
              >
                X
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addStop}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          + Add Stop
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : route ? "Update Route" : "Create Route"}
      </button>
    </form>
  );
}
