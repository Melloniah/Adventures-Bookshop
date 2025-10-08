"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";
import { authAPI } from "../../../lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const { setUser, isAdmin, _hasHydrated } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // ✅ Wait for auth store to hydrate before rendering
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // ✅ Redirect if already logged in as admin
  if (isAdmin) {
    router.replace("/admin/dashboard");
    return null; // do not render login form
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { user } = response.data;

      if (!user) {
        toast.error("Invalid login response");
        return;
      }

      if (user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      setUser(user);
      toast.success("Login successful!");

      // ✅ SPA-safe redirect
      router.replace("/admin/dashboard");
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

  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="bg-teal-600 text-white px-4 py-2 rounded font-bold text-lg sm:text-xl inline-block">
            ADVENTURES
            <span className="text-black bg-gray-100 px-1 ml-1 rounded">
              BOOKSHOP
            </span>
          </div>
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to access the admin dashboard.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
              placeholder="Email address"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Back to Home link */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="inline-block text-teal-600 text-sm sm:text-base hover:underline hover:text-teal-700 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
