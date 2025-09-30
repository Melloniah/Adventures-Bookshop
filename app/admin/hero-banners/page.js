"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import BannerForm from "../../../components/Admin/BannerForm";
import Image from "next/image";

export default function HeroBannersPage() {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await api.get("/admin/hero-banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await api.post("/admin/hero-banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchBanners();
    } catch (err) {
      console.error("Failed to create banner:", err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/admin/hero-banners/${editingBanner.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      console.error("Failed to update banner:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.delete(`/admin/hero-banners/${id}`);
      fetchBanners();
    } catch (err) {
      console.error("Failed to delete banner:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Hero Banners</h1>

      <BannerForm
        onSubmit={editingBanner ? handleUpdate : handleCreate}
        initialData={editingBanner}
        isEditing={!!editingBanner}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              className="h-40 w-full object-cover rounded"
            />
            <h2 className="text-lg font-semibold">{banner.title}</h2>
            <p className="text-sm text-gray-600">{banner.subtitle}</p>
            <p className="text-xs text-gray-500">{banner.description}</p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setEditingBanner(banner)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}