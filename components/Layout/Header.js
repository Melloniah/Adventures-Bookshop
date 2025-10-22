"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "store/useCartStore";
import CartSidebar from "../Cart/CartSidebar";
import Image from "next/image";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const headerLinks = [
    { name: "Home", href: "/" },
    { name: "Books", href: "/products?category=books" },
    { name: "Stationery", href: "/products?category=stationery" },
    { name: "Technology", href: "/products?category=technology" },
    { name: "Art Supplies", href: "/products?category=arts" },
    { name: "Toys", href: "/products?category=toys" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="bg-white shadow-sm mb-0 overflow-hidden">
        {/* Top bar */}
        <div className="bg-gray-50 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="hidden sm:block"></div>
            <a
              href="mailto:adventuresbookshop@gmail.com"
              className="flex items-center space-x-1 hover:text-teal-600 truncate max-w-full"
            >
              <span>✉️</span>
              <span className="truncate">adventuresbooks@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/Adventures-logo.jpeg"
                alt="Adventures Bookshop Logo"
                width={300}
                height={300}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-teal-700 font-bold text-base sm:text-lg">
                  Adventures
                </span>
                <span className="text-black font-semibold text-xs sm:text-sm">
                  Bookshop
                </span>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="tel:+254724047489"
                className="flex items-center gap-1 hover:text-teal-600"
              >
                <PhoneIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">+254 724047489</span>
              </a>

              {mounted && (
                <Link
                  href="/account"
                  className="p-2 hover:bg-teal-500 rounded-lg transition"
                >
                  <UserIcon className="h-6 w-6" />
                </Link>
              )}

              {mounted && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-teal-500 rounded-lg transition"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-teal-600 text-white w-full overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4 h-12">
              {headerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded transition-colors ${
                    isActive(link.href)
                      ? "bg-teal-700"
                      : "hover:bg-teal-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center">
              <Link
                href="/track-order"
                className="px-3 py-2 rounded hover:bg-teal-500 transition-colors font-medium"
              >
                Track Your Order
                <span className="ml-1 text-white inline-block animate-arrow-bounce">
                  ➡️
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden flex flex-col gap-1 px-4 py-3 bg-teal-700 text-sm animate-slide-down">
              {headerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 px-3 rounded ${
                    isActive(link.href) ? "bg-teal-800" : "hover:bg-teal-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/track-order"
                className="block py-2 px-3 rounded hover:bg-teal-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Your Order
                <span className="ml-1 inline-block animate-arrow-bounce">➡️</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Running Banner */}
        <div className="bg-red-600 text-black text-xs sm:text-sm py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="inline-block px-3 sm:px-4">
              Free Delivery on Orders Over KSh 3,000
            </span>
            <span className="inline-block px-3 sm:px-4">
              📞 Call Us: +254 724047489
            </span>
            <span className="inline-block px-3 sm:px-4">
              Free Delivery on Orders Over KSh 3,000
            </span>
            <span className="inline-block px-3 sm:px-4">
              📞 Call Us: +254 724047489
            </span>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Animations */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        @keyframes arrow-bounce {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        .animate-arrow-bounce {
          animation: arrow-bounce 1s ease-in-out infinite;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Header;
