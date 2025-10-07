"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import BannerForm from "../../../components/Admin/BannerForm";
import Image from "next/image";
import { getImageUrl, handleImageError, placeholderSVG } from "utils/imageUtils";
import toast from "react-hot-toast";

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
      toast.success("Banner created successfully!");
      fetchBanners();
    } catch (err) {
      toast.error("Failed to create banner.");
      console.error("Failed to create banner:", err.response?.data || err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/admin/hero-banners/${editingBanner.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Banner updated successfully!");
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      toast.error("Failed to update banner.");
      console.error("Failed to update banner:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.delete(`/admin/hero-banners/${id}`);
      toast.success("Banner deleted successfully!");
      setBanners((prev) => prev.filter((b) => b.id !== id)); // update UI immediately
    } catch (err) {
      toast.error("Failed to delete banner.");
      console.error("Failed to delete banner:", err.response?.data || err);
    }
  };

  const handleCancel = () => {
    setEditingBanner(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Hero Banners
      </h1>

      <BannerForm
        onSubmit={editingBanner ? handleUpdate : handleCreate}
        initialData={editingBanner}
        isEditing={!!editingBanner}
        onCancel={handleCancel}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200 space-y-2"
          >
            <Image
              src={getImageUrl(banner.image) || placeholderSVG}
              alt={banner.title || "Banner"}
              width={400}
              height={200}
              className="h-40 w-full object-cover rounded-md"
              onError={handleImageError}
            />

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                {banner.title}
              </h2>
              <p className="text-sm text-gray-600">{banner.subtitle}</p>
              <p className="text-xs text-gray-500">{banner.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
              <button
                onClick={() => setEditingBanner(banner)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="text-red-600 hover:underline text-sm font-medium"
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
