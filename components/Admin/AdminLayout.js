"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import {
  HomeIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  Bars3Icon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: ShoppingBagIcon },
  { name: "Orders", href: "/admin/orders", icon: ClipboardDocumentListIcon },
  { name: "Delivery Routes", href: "/admin/delivery-routes", icon: MapPinIcon },
  { name: "Hero Banners", href: "/admin/hero-banners", icon: PhotoIcon },
  { name: "Categories", href: "/admin/adminCategories", icon: TagIcon },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user, isAdmin, _hasHydrated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Only wait for hydration - middleware already validated
  useEffect(() => {
    if (!_hasHydrated) return;

    // Login page - redirect if already admin
    if (pathname === "/admin/login" && isAdmin) {
      router.replace("/admin/dashboard");
      return;
    }

    // Protected pages - redirect if not admin
    if (pathname !== "/admin/login" && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [pathname, isAdmin, _hasHydrated, router]);

  // Show loading only while hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // Render login page without sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      <Sidebar
        navigation={navigation}
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between bg-white shadow px-4 py-3 sm:px-6 sticky top-0 z-20">
          <button
            className="sm:hidden text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          <h1 className="text-lg font-semibold text-gray-800 sm:hidden">
            Admin Panel
          </h1>

          <div className="flex-1" />

          <button
            onClick={() => logout(router)}
            className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ navigation, pathname, sidebarOpen, setSidebarOpen }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`fixed z-50 inset-y-0 left-0 bg-teal-700 text-white transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:flex sm:flex-col
          ${expanded ? "sm:w-64" : "sm:w-20"}
        `}
      >
        <div className="p-4 border-b border-teal-600 flex items-center justify-center sm:justify-start">
          <span
            className={`text-xl font-bold whitespace-nowrap transition-all duration-200 ${
              expanded ? "opacity-100 ml-2" : "opacity-0 sm:hidden"
            } sm:block`}
          >
            {expanded && "Adventures Admin"}
          </span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation?.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive ? "bg-gray-100 text-teal-700" : "hover:bg-teal-600 text-gray-100"}
                `}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={`ml-3 transition-all duration-200 ${expanded ? "opacity-100" : "opacity-0 hidden sm:block"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}