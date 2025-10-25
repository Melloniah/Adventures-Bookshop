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
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "store/useCartStore";
import CartSidebar from "../Cart/CartSidebar";
import Image from "next/image";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalItems } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        {/* Top bar */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm text-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a
                href="mailto:adventuresbookshop@gmail.com"
                className="flex items-center gap-2 hover:text-teal-100 transition-colors group"
              >
                <span className="text-base">✉️</span>
                <span className="hidden sm:inline group-hover:underline">adventuresbooks@gmail.com</span>
              </a>
            </div>
            <a
              href="tel:+254724047489"
              className="flex items-center gap-2 hover:text-teal-100 transition-colors group"
            >
              <PhoneIcon className="h-4 w-4" />
              <span className="font-medium group-hover:underline">+254 724047489</span>
            </a>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/Adventures-logo.jpeg"
                  alt="Adventures Bookshop Logo"
                  width={300}
                  height={300}
                  className="w-14 h-14 object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-teal-700 font-bold text-xl tracking-tight">
                  Adventures
                </span>
                <span className="text-gray-700 font-semibold text-sm tracking-wide">
                  Bookshop
                </span>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search icon for mobile */}
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
              </button>

              {/* Cart */}
              {mounted && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-teal-50 rounded-lg transition-colors group"
                >
                  <ShoppingCartIcon className="h-6 w-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}

              {/* User icon */}
              <button className="hidden md:block p-2 hover:bg-teal-50 rounded-lg transition-colors group">
                <UserIcon className="h-6 w-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-gradient-to-r from-teal-600 to-teal-700 border-t border-teal-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {headerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 text-sm font-medium rounded-t transition-all ${
                      isActive(link.href)
                        ? "bg-white text-teal-700 shadow-sm"
                        : "text-white hover:bg-teal-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/track-order"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-md"
              >
                <span>Track Your Order</span>
                <span className="animate-arrow-bounce">➡️</span>
              </Link>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-3 space-y-1 animate-slide-down">
                {headerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href) 
                        ? "bg-white text-teal-700" 
                        : "text-white hover:bg-teal-500"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/track-order"
                  className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Track Your Order</span>
                  <span className="animate-arrow-bounce">➡️</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Running Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm py-2.5 overflow-hidden border-t border-red-500">
          <div className="animate-marquee whitespace-nowrap">
            <span className="inline-block px-8 font-medium">
              🎉 Free Delivery on Orders Exceeding KSh 3,000
            </span>
            <span className="inline-block px-8 font-medium">
              📞 Call Us: +254 724047489
            </span>
            <span className="inline-block px-8 font-medium">
              🎉 Free Delivery on Orders Exceeding KSh 3,000
            </span>
            <span className="inline-block px-8 font-medium">
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
          animation: marquee 25s linear infinite;
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
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
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