import { create } from "zustand";
import { authAPI } from "../lib/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAdmin: false,
  _hasHydrated: false,
  _isValidating: false, // ✅ Prevent multiple simultaneous calls

  setUser: (user) => {
    set({ user, isAdmin: user?.role === "admin" });
  },

  logout: async (router) => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ user: null, isAdmin: false });
      if (router) router.replace("/admin/login");
    }
  },

  setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),

  // ✅ Debounced validation - only runs once at a time
  validateSession: async () => {
    const state = get();
    
    // Skip if already validating
    if (state._isValidating) {
      return state.user;
    }

    set({ _isValidating: true });

    try {
      const { data } = await authAPI.me();
      set({ user: data, isAdmin: data?.role === "admin" });
      return data;
    } catch (err) {
      if (err.response?.status === 401) {
        set({ user: null, isAdmin: false });
      }
      return null;
    } finally {
      set({ _isValidating: false });
    }
  },

  // ✅ Only hydrate once on client mount
  hydrate: async () => {
    const state = get();
    
    if (state._hasHydrated) return; // Already hydrated

    const isLoginPage =
      typeof window !== "undefined" &&
      window.location.pathname.includes("/login");

    if (!isLoginPage) {
      await get().validateSession();
    }

    set({ _hasHydrated: true });
  },
}));

// ✅ Call hydrate only once when store initializes
if (typeof window !== "undefined") {
  useAuthStore.getState().hydrate();
}