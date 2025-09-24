import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from 'store/useStore';
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} handleLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} handleLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, handleLogout }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-grow bg-red-700 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="text-white font-bold text-xl">
          SchoolMall Admin
        </div>
      </div>
      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-red-800 text-white'
                    : 'text-red-100 hover:bg-red-600'
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
          <button
            onClick={handleLogout}
            className="flex-shrink-0 w-full group block text-left"
          >
            <div className="flex items-center text-red-100 hover:text-white">
              <ArrowRightOnRectangleIcon className="inline-block h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Sign out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;