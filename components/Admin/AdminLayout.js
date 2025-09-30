
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useStore';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, logout, setUser, _hasHydrated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
  { name: 'Payments', href: '/admin/payments', icon: ClipboardDocumentListIcon },
  { name: 'Hero Banners', href: '/admin/hero-banners', icon: PhotoIcon },
];


  // Restore user from localStorage if store isn't hydrated yet
  useEffect(() => {
    if (_hasHydrated) {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser && !isAdmin) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'admin') {
          setUser(parsedUser, storedToken);
        }
      }
      setIsLoading(false);
    }
  }, [_hasHydrated, setUser, isAdmin]);

  // Redirect if not admin
  useEffect(() => {
    if (
      !isLoading &&
      _hasHydrated &&
      !isAdmin &&
      pathname.startsWith('/admin') &&
      pathname !== '/admin/login'
    ) {
      router.push('/admin/login');
    }
  }, [isLoading, _hasHydrated, isAdmin, pathname, router]);

  // Loading screen while hydrating or checking auth
  if (isLoading || !_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not admin and not on login → redirect message
  if (!isAdmin && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Redirecting...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <Sidebar navigation={navigation} handleLogout={handleLogout} pathname={pathname} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar navigation={navigation} handleLogout={handleLogout} pathname={pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile menu button */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ navigation, handleLogout, pathname }) {
  return (
    <div className="flex flex-col flex-grow bg-red-700 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="text-white font-bold text-xl">SchoolMall Admin</div>
      </div>
      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive ? 'bg-red-800 text-white' : 'text-red-100 hover:bg-red-600'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-white' : 'text-red-300'
                  } mr-3 flex-shrink-0 h-6 w-6`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex-shrink-0 flex border-t border-red-800 p-4">
          <button onClick={handleLogout} className="flex-shrink-0 w-full group block text-left">
            <div className="flex items-center text-red-100 hover:text-white">
              <ArrowRightOnRectangleIcon className="inline-block h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Sign out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
