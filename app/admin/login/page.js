"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useStore";
import { authAPI } from "../../../lib/api";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const { setUser, isAdmin, _hasHydrated } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (mounted && _hasHydrated && isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [mounted, _hasHydrated, isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      console.log("Login response:", response.data); // Debug log
      
      const { access_token, user } = response.data;

      if (user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      // Save in localStorage (keep this for client-side access)
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // FIXED: Set cookie properly for middleware
      document.cookie = `token=${access_token}; path=/; samesite=lax; max-age=${60 * 60 * 24}`; // 24 hours

      // Update store
      setUser(user, access_token);

      toast.success("Login successful!");

      // Small delay to ensure state updates, then redirect
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 100);
      
    } catch (error) {
      console.error("Login error:", error); // Debug log
      const errorMessage = error.response?.data?.detail || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!mounted || !_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-auto text-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded font-bold text-xl inline-block">
              SCHOOL<span className="bg-yellow-400 text-black px-1">MALL</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}