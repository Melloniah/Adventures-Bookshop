"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "store/useCartStore";
import CartSidebar from "../Cart/CartSidebar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Hardcoded header links
  const headerLinks = [
    { name: "Home", href: "/" },
    { name: "Books", href: "/products?category=books" },
    { name: "Technology", href: "/products?category=technology" },
    { name: "Art Supplies", href: "/products?category=arts" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        {/* Top bar */}
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>📞 +254 724047489</span>
              <span>✉️ adventuresbookshop@gmail.com</span>
            </div>
            
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
               <div className="bg-teal-600 text-white px-4 py-2 rounded font-bold text-xl inline-block">
            ADVENTURES
            <span className="bg-black-400 text-black px-1">BOOKSHOP</span>
          </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {mounted && (
                <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg">
                  <UserIcon className="h-6 w-6" />
                </Link>
              )}
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
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
              <Link href="/admin" className="hover:text-red-600">Admin</Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden md:flex items-center space-x-4 h-12">
              {headerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded transition-colors ${
                    isActive(link.href) ? "bg-teal-700" : "hover:bg-red-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 flex flex-col gap-2">
                {headerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2 px-3 rounded ${
                      isActive(link.href) ? "bg-teal-700" : "hover:bg-red-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
