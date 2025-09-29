
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "store/useStore";
import CartSidebar from "../Cart/CartSidebar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Books", href: "/products?category=books" },
    { name: "Technology", href: "/products?category=technology" },
    { name: "Shop", href: "/products" },
    { name: "Stationery", href: "/products?category=stationery" },
    { name: "Art Supplies", href: "/products?category=art-supplies" },
    { name: "Find a Store", href: "/stores" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm">
        {/* Top bar */}
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>📞 +254 793 488207</span>
              <span>✉️ info@schoolmall.co.ke</span>
            </div>
            <Link href="/admin" className="hover:text-red-600">
              Admin
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-xl">
                SCHOOL
                <span className="bg-yellow-400 text-black px-1">MALL</span>
              </div>
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <select className="absolute left-0 top-0 h-full border-r border-gray-300 bg-gray-50 px-3 text-sm rounded-l-lg">
                  <option>All Collection</option>
                  <option>Books</option>
                  <option>Stationery</option>
                  <option>Technology</option>
                </select>
                <input
                  type="text"
                  placeholder="Search for product..."
                  className="w-full pl-32 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full bg-yellow-400 text-black px-6 rounded-r-lg font-medium hover:bg-yellow-500">
                  Search
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Account only after mount */}
              {mounted && (
                <Link
                  href="/account"
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <UserIcon className="h-6 w-6" />
                </Link>
              )}

              {/* Cart button only after mount */}
              {mounted && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    </span>
                  )}
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <span>
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden md:flex items-center space-x-8 h-12">
              <button className="flex items-center space-x-1 hover:bg-red-700 px-3 py-2 rounded">
                <Bars3Icon className="h-4 w-4" />
                <span>SHOP CATEGORIES</span>
              </button>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:bg-red-700 px-3 py-2 rounded transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 hover:bg-red-700 px-3 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Cart sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
