'use client';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const quickLinks = [
    { name: 'Pre-school', href: '/products?category=pre-school' },
    { name: 'Lower Primary', href: '/products?category=grade3' },
    { name: 'Secondary School', href: '/products?category=grade9' },
    { name: 'Stationery', href: '/products?category=stationery' },
    { name: 'Technology', href: '/products?category=technology' },
    { name: 'Toys', href: '/products?category=toys' },
  ];

  const popularTags = [
    'Stationery', 'Textbooks', 'Books', 'Art Supplies', 'Technology'
  ];

  return (
    <>
      {/* --- FOOTER --- */}
      <footer className="bg-gradient-to-b from-teal-700 to-teal-900 text-white">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Store Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/Adventures-logo.jpeg"
                  alt="Adventures Bookshop"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-lg">Adventures</h3>
                  <p className="text-xs text-teal-200">Bookshop</p>
                </div>
              </div>
              <p className="text-sm text-teal-100 mb-4">
                Your one-stop shop for educational materials and stationery with fast delivery.
              </p>
              <div className="flex space-x-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <span className="text-lg">📘</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <span className="text-lg">🐦</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <span className="text-lg">📷</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                   className="bg-white/10 hover:bg-white/20 w-9 h-9 rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <span className="text-lg">💼</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-300">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-teal-100 hover:text-yellow-300 transition-colors inline-block hover:translate-x-1 duration-200"
                    >
                      → {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-300">Contact Us</h3>
              <div className="space-y-3 text-sm text-teal-100">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-300 text-lg">📍</span>
                  <p>Information House, Mfangano St, Opp. Quickmart Afya Center</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-lg">📞</span>
                  <a href="tel:+254724047489" className="hover:text-yellow-300 transition-colors">
                    +254 724 047489
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-lg">✉️</span>
                  <a href="mailto:adventuresbookshop@gmail.com" className="hover:text-yellow-300 transition-colors break-all">
                    adventuresbooks@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-yellow-300">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?search=${tag.toLowerCase()}`}
                    className="bg-white/10 hover:bg-yellow-400 hover:text-teal-900 px-3 py-1.5 rounded-full text-xs font-medium transition-all transform hover:scale-105"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-xs font-semibold text-yellow-300 mb-1">🎉 Free Delivery</p>
                <p className="text-xs text-teal-100">On orders over KSh 3,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 bg-teal-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-teal-200">
              <p>© 2025 Adventures Bookshop. All Rights Reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/" className="hover:text-yellow-300 transition-colors">Home</Link>
                <span>•</span>
                <Link href="/products" className="hover:text-yellow-300 transition-colors">Shop</Link>
                <span>•</span>
                <Link href="/track-order" className="hover:text-yellow-300 transition-colors">Track Order</Link>
              </div>
              <p>Designed by <span className="text-yellow-300 font-semibold">Melloniah</span></p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <Link
        href="https://wa.me/254724047489"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transform transition-all duration-300 z-50 animate-bounce-subtle"
      >
        <span className="text-3xl">💬</span>
      </Link>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Footer;