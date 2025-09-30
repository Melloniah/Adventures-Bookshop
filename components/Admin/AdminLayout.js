"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../store/useStore";
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, logout, setUser, _hasHydrated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Products", href: "/admin/products", icon: ShoppingBagIcon },
    { name: "Orders", href: "/admin/orders", icon: ClipboardDocumentListIcon },
    { name: "Payments", href: "/admin/payments", icon: ClipboardDocumentListIcon },
    { name: "Hero Banners", href: "/admin/hero-banners", icon: PhotoIcon },
  ];

  // Restore user from localStorage/cookie
  useEffect(() => {
    if (_hasHydrated) {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (token && user && user.role === "admin" && !isAdmin) {
        setUser(user, token);
      }

      setIsLoading(false);
    }
  }, [_hasHydrated, setUser, isAdmin]);

  // Redirect non-admins
  useEffect(() => {
    if (!_hasHydrated || isLoading) return;

    // Don't redirect if on login page
    if (pathname === "/admin/login") return;

    if (!isAdmin && pathname.startsWith("/admin")) {
      router.replace("/admin/login");
    }
  }, [_hasHydrated, isLoading, isAdmin, pathname, router]);

  // If on login page, don't show loading or admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      // Call logout API to clear HttpOnly cookie
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // Clear local state
    logout();
    localStorage.removeItem("user");
    router.replace("/admin/login");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar navigation={navigation} handleLogout={handleLogout} pathname={pathname} />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <main className="py-6">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ navigation, handleLogout, pathname }) {
  return (
    <div className="w-64 flex flex-col bg-red-700 text-white">
      <div className="p-4 text-xl font-bold">SchoolMall Admin</div>
      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                isActive ? "bg-red-800" : "hover:bg-red-600"
              } block px-2 py-2 rounded-md`}
            >
              <item.icon className="inline-block h-6 w-6 mr-2" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="p-4 hover:bg-red-600 text-left">
        Sign Out
      </button>
    </div>
  );
}