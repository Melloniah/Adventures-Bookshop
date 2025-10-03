"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";
import { authAPI } from "../../../lib/api";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const { setUser, isAdmin, _hasHydrated, logout } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚀 Redirect if already logged in as admin
  useEffect(() => {
    console.log("🔍 Redirect check:", { mounted, _hasHydrated, isAdmin });
    if (mounted && _hasHydrated && isAdmin) {
      console.log("🚀 Redirecting to dashboard...");
      router.replace("/admin/dashboard");
    }
  }, [mounted, _hasHydrated, isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { user } = response.data;

      console.log("📥 Login response:", user);

      if (!user) {
        toast.error("Invalid login response");
        return;
      }

      if (user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      // ✅ Save to Zustand
      setUser(user);

      toast.success("Login successful!");
      
      console.log("🔄 Attempting redirect...");
      
      // ✅ Try multiple redirect strategies
      setTimeout(() => {
        console.log("⏰ Timeout redirect");
        window.location.href = "/admin/dashboard";
      }, 100);
      
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-teal-600 text-white px-4 py-2 rounded font-bold text-xl inline-block">
            ADVENTURES
            <span className="bg-black-400 text-black px-1">BOOKSHOP</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Email address"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
          >
            {loading ? "Signing in..." : "Login in"}
          </button>
        </form>
      </div>
    </div>
  );
}