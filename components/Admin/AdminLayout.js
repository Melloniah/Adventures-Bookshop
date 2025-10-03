"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAdmin, logout, validateSession } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Products", href: "/admin/products", icon: ShoppingBagIcon },
    { name: "Orders", href: "/admin/orders", icon: ClipboardDocumentListIcon },
    { name: "Payments", href: "/admin/payments", icon: ClipboardDocumentListIcon },
    { name: "Hero Banners", href: "/admin/hero-banners", icon: PhotoIcon },
  ];

  // Validate session for admin pages
  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const user = await validateSession();
        if (!user || user.role !== "admin") {
          logout();
          router.replace("/admin/login");
        }
      } catch {
        logout();
        router.replace("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [pathname, validateSession, logout, router]);

  // Skip layout for login page
  if (pathname === "/admin/login") return <>{children}</>;

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        navigation={navigation}
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white shadow px-4 py-2 sm:px-6">
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
          <div className="flex-1" />
         <button
  onClick={() => logout(router)} // pass router here
  className="m-4 px-3 py-2 bg-teal-600 rounded hover:bg-gray-500 "
>
  Logout
</button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ navigation, pathname, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-teal-700 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out sm:translate-x-0 sm:static sm:flex sm:flex-col`}
      >
        <div className="p-4 text-xl font-bold">Adventures Admin</div>
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
           key={item.name}
href={item.href}
className={`${
  isActive ? "bg-gray-300 text-gray-900" : "hover:bg-gray-500 text-white-700"
} block px-2 py-2 rounded-md`}
onClick={() => setSidebarOpen(false)}
>
  <item.icon className="inline-block h-6 w-6 mr-2" />
  {item.name}
</Link>

            );
          })}
        </nav>
      </div>
    </>
  );
}
