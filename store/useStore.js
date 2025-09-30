import { create } from "zustand";
import { persist } from "zustand/middleware";
// import Cookies from "js-cookie";

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
      isAdmin: false,
      _hasHydrated: false,

      setUser: (user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }
        set({ user, isAdmin: user?.role === "admin" });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
        set({ user: null, isAdmin: false });
      },

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Hydration logic on the client side only needs to read the user
        // The token is handled by the server (middleware)
        if (typeof window === "undefined") return;
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) { // Check if user exists
            state?.setUser(user);
          }
        } catch {}
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useStore = useCartStore;