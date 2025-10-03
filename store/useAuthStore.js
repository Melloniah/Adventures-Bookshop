import { create } from "zustand";
import { authAPI } from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAdmin: false,
  _hasHydrated: false,

  // Set user and isAdmin
  setUser: (user) => {
    set({ user, isAdmin: user?.role === "admin" });
  },

   // Logout clears backend cookie + local state + optional redirect
  logout: async (router) => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ user: null, isAdmin: false });
      // redirect immediately if router is passed
      if (router) router.replace("/admin/login");
    }
  },
  
  // Hydration flag
  setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),

  // Validate cookie-based session
  validateSession: async () => {
    try {
      const { data } = await authAPI.me();
      set({ user: data, isAdmin: data?.role === "admin" });
      return data;
    } catch (err) {
      if (err.response?.status === 401) {
        set({ user: null, isAdmin: false });
      }
      return null;
    }
  },

  // Hydrate on initial load
  hydrate: async () => {
    const isLoginPage = typeof window !== "undefined" && window.location.pathname.includes("/login");
    if (!isLoginPage) {
      await get().validateSession();
    }
    set({ _hasHydrated: true });
  },
}));
