'use client';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const quickLinks = [
    { name: 'Lower Primary', href: '/products?category=grade3' },
    { name: 'Pre-school', href: '/products?category=pre-school' },
    { name: 'Stationery', href: '/products?category=stationery' },
    { name: 'Technology', href: '/products?category=technology' },
    { name: 'Toys', href: '/products?category=toys' },
    { name: 'Secondary School', href: '/products?category=grade9' },
  ];

  const information = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },

  ];

  const popularTags = [
    'Stationery', 'Textbooks', 'Books', 'Art Supplies', 'Technology'
  ];

  return (
    <>
      {/* --- FOOTER --- */}
      <footer className="bg-amber-200">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

            {/* Store Info */}
            <div>
              <h3 className="font-bold text-teal-800 mb-3 text-lg">Store Information</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-teal-600">📞</span>
                  <div>
                    <p>Order via WhatsApp for immediate delivery</p>
                    <p className="font-semibold text-teal-700">+254 724 047489</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-teal-600">📍</span>
                  <p>Information House, Mfangano Street, Opp. Quickmart Afya Center</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-teal-600">✉️</span>
                  <p>adventuresbookshop@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Quick View */}
            <div>
              <h3 className="font-bold text-teal-800 mb-3 text-lg">Quick View</h3>
              <ul className="space-y-1.5">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-700 hover:text-teal-600 text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="font-bold text-teal-800 mb-3 text-lg">Information</h3>
              <ul className="space-y-1.5">
                {information.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-700 hover:text-teal-600 text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="font-bold text-teal-800 mb-3 text-lg">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?search=${tag.toLowerCase()}`}
                    className="bg-white px-3 py-1 rounded-full text-gray-700 border border-teal-200 text-xs hover:bg-teal-600 hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

              {/* About Us */}
              <div>
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">About Us</h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Adventures Bookshop offers convenient online ordering and fast delivery for all your educational and stationery needs.
                </p>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">Follow Us</h3>
                <p className="text-gray-300 text-xs mb-3">Stay connected with Adventures Bookshop!</p>
                <div className="flex space-x-3">
                  <a href="#" className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                    <span className="text-white text-sm font-bold">f</span>
                  </a>
                  <a href="#" className="bg-blue-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500 transition">
                    <span className="text-white text-sm font-bold">t</span>
                  </a>
                  <a href="#" className="bg-pink-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-pink-700 transition">
                    <span className="text-white text-sm">📷</span>
                  </a>
                  <a href="#" className="bg-blue-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-900 transition">
                    <span className="text-white text-xs font-bold">in</span>
                  </a>
                </div>
              </div>

              {/* Shop Online */}
              <div>
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wide">Shop Online</h3>
                <p className="text-gray-300 text-xs italic">
                  Books delivered to your door — fast, affordable, and secure!
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-teal-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 text-center sm:text-left space-y-2 sm:space-y-0">
                <p>© 2025 Adventures Bookshop. All Rights Reserved.</p>
                <p>Designed & Managed by <span className="text-blue-400 font-medium">Melloniah</span></p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <Link
        href="https://wa.me/254724047489"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transform transition duration-200 z-50"
      >
        <span className="text-2xl sm:text-3xl">💬</span>
      </Link>
    </>
  );
};

export default Footer;
