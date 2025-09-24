import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const quickLinks = [
    { name: 'Lower Primary', href: '/products?category=lower-primary' },
    { name: 'Pre-school', href: '/products?category=pre-school' },
    { name: 'Stationery', href: '/products?category=stationery' },
    { name: 'Technology', href: '/products?category=technology' },
    { name: 'Upper Primary', href: '/products?category=upper-primary' },
    { name: 'Junior Secondary School', href: '/products?category=junior-secondary' },
  ];

  const information = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Find a Store', href: '/stores' },
  ];

  const popularTags = [
    'Stationery', 'Textbooks', 'Story books', 'Art supplies', 'Revision books'
  ];

  const publishers = [
    { name: 'Longhorn Publishers', logo: '/longhorn-logo.png' },
    { name: 'Storymoja', logo: '/storymoja-logo.png' },
    { name: 'Oxford University Press', logo: '/oxford-logo.png' },
    { name: 'Spotlight', logo: '/spotlight-logo.png' },
    { name: 'Phoenix Publishers', logo: '/phoenix-logo.png' },
  ];

  return (
    <>
      {/* Unified Footer */}
      <footer className="bg-yellow-400">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Store Information */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Store Information</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start space-x-2">
                  <span className="text-red-600">📞</span>
                  <div>
                    <p>Call On Order 7 Get it Delivered!</p>
                    <p className="font-semibold">+254 793 488207</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-600">📍</span>
                  <p>Greenspan | Ruai | Utawala | Embakasi | Fedha</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-600">✉️</span>
                  <p>info@schoolmall.co.ke</p>
                </div>
              </div>
            </div>

            {/* Quick View */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Quick View</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-700 hover:text-red-600 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Information</h3>
              <ul className="space-y-2">
                {information.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-700 hover:text-red-600 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Popular Tag</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?search=${tag.toLowerCase()}`}
                    className="bg-white px-3 py-1 rounded text-gray-700 hover:bg-red-600 hover:text-white transition-colors text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section - Now inside the footer */}
        <div className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Us */}
              <div>
                <h3 className="font-bold mb-4">About Us</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  School mall Bookshop is offering you the opportunity to order books and 
                  stationery at the comfort of your home or office.
                </p>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="font-bold mb-4">Follow Us</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Stay connected with Schoolmall Bookshop!
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="bg-blue-600 p-2 rounded hover:bg-blue-700">
                    <span className="text-white text-xl">f</span>
                  </a>
                  <a href="#" className="bg-blue-400 p-2 rounded hover:bg-blue-500">
                    <span className="text-white text-xl">t</span>
                  </a>
                  <a href="#" className="bg-pink-600 p-2 rounded hover:bg-pink-700">
                    <span className="text-white text-xl">📷</span>
                  </a>
                  <a href="#" className="bg-blue-800 p-2 rounded hover:bg-blue-900">
                    <span className="text-white text-xl">in</span>
                  </a>
                </div>
              </div>

              {/* Shop Online */}
              <div>
                <h3 className="font-bold mb-4">Shop Online</h3>
                <p className="text-gray-300 text-sm italic">
                  Books delivered to your door - fast, affordable, and hassle-free!
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>Copyright 2025 School Mall Bookshop. All Rights Reserved.</p>
                <p>Designed & Managed by Deloway Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <Link
        href="https://wa.me/254793488207"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40"
      >
        <span className="text-2xl">💬</span>
      </Link>
    </>
  );
};


export default Footer;