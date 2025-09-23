"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand / About */}
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="School Mall Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="font-semibold text-lg">School Mall</span>
          </Link>
          <p className="text-sm text-gray-600 mt-3">
            School Mall Bookshop — your trusted source for CBC books,
            stationery, and learning essentials.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/about" className="hover:text-orange-600">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-600">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-orange-600">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-orange-600">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/products/books" className="hover:text-orange-600">
                Books
              </Link>
            </li>
            <li>
              <Link href="/products/stationery" className="hover:text-orange-600">
                Stationery
              </Link>
            </li>
            <li>
              <Link href="/products/laptops" className="hover:text-orange-600">
                Laptops & Accessories
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-orange-600">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="font-semibold mb-4">Get in Touch</h4>
          <p className="text-sm text-gray-600">📞 +254 793 488207</p>
          <p className="text-sm text-gray-600">📧 info@schoolmall.co.ke</p>

          <div className="flex space-x-4 mt-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="text-gray-600 hover:text-orange-600"
            >
              <Facebook size={20} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="text-gray-600 hover:text-orange-600"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="text-gray-600 hover:text-orange-600"
            >
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} School Mall — Built with ❤️
      </div>
    </footer>
  );
}
