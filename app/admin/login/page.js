"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useStore";
import { authAPI } from "../../../lib/api";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const router = useRouter();
  const { setUser, isAdmin, _hasHydrated, setHasHydrated } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force hydration if not already done
    if (!_hasHydrated) {
      setHasHydrated(true);
    }
    // Clear any existing auth data when accessing login page
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, [_hasHydrated, setHasHydrated]);

  // Don't redirect if already logged in - let user login again
  // useEffect(() => {
  //   if (mounted && _hasHydrated && isAdmin) {
  //     router.replace("/admin/dashboard");
  //   }
  // }, [mounted, _hasHydrated, isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      if (!response.data) {
        toast.error("Invalid response from server");
        setLoading(false);
        return;
      }

      const { access_token, user } = response.data;
      

      if (!access_token || !user) {
        toast.error("Invalid login response");
        setLoading(false);
        return;
      }

      if (user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      // Store user info locally (token is in HttpOnly cookie)
      localStorage.setItem("user", JSON.stringify(user));

      // Update store (no token needed, cookie handles auth)
      setUser(user);

      toast.success("Login successful!");
      setTimeout(()=>{
       router.push("/admin/dashboard");
      }, 200)
       

    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || "Login failed";
      toast.error(errorMessage);
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
          <div className="bg-red-600 text-white px-4 py-2 rounded font-bold text-xl inline-block">
            ADVENTURES<span className="bg-turqouise-green-400 text-black px-1">MALL</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Sign In</h2>
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
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}