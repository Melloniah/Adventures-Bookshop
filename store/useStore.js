import { create } from "zustand";
import { persist } from "zustand/middleware";

// Utility: get cookie by name
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// ---------------- CART STORE ----------------
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);

// ---------------- AUTH STORE ----------------
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAdmin: false,
      _hasHydrated: false,

      setUser: (user, token) => {
        // Save both in localStorage (for client) + cookies (for middleware)
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          document.cookie = `token=${token}; path=/; samesite=strict`; // 🔥
        }

        set({
          user,
          token,
          isAdmin: user?.role === "admin",
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict";
        }
        set({ user: null, token: null, isAdmin: false });
      },

      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Called after localStorage hydration
        // ✅ Sync cookies into Zustand if available
        const cookieToken = getCookie("token");
        if (cookieToken && !state?.token) {
          try {
            const user = JSON.parse(localStorage.getItem("user"));
            state?.setUser(user, cookieToken);
          } catch (err) {
            console.error("Failed to sync user from cookie:", err);
          }
        }
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useStore = useCartStore;
