"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const [currentPromo, setCurrentPromo] = useState(0);

  const heroContent = {
    title: "Fuel your future",
    subtitle: "Think. Learn. Achieve",
    cta: "Shop Now",
    description: "BRIGHT MINDS",
    image: "/hero1.jpg",
  };

  const promos = [
    { title: "Hurry! While stock lasts", subtitle: "Limited quantities available" },
    { title: "New Arrivals", subtitle: "Check out the latest books" },
    { title: "Special Discount", subtitle: "Up to 20% off" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center bg-gray-50 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
      
      {/* Left: Main Hero Content */}
      <div className="flex-1 max-w-lg flex flex-col justify-center">
        <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium mb-4">
          {heroContent.description}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          {heroContent.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-6">{heroContent.subtitle}</p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          {heroContent.cta}
        </Link>
      </div>

      {/* Middle: Promo Slider */}
      <div className="flex-1 max-w-xs hidden md:flex flex-col justify-center items-center">
        <div className="bg-yellow-300 p-6 rounded-lg shadow-lg transform transition-transform duration-700 ease-in-out animate-bounce-y">
          <div className="text-xs font-semibold">BIG DEAL</div>
          <h4 className="text-lg font-bold mt-2">{promos[currentPromo].title}</h4>
          <p className="mt-2 font-semibold">{promos[currentPromo].subtitle}</p>
        </div>
      </div>

      {/* Right: Hero Image */}
      <div className="flex-1 hidden md:block relative h-80 md:h-[500px]">
        <Image
          src={heroContent.image}
          alt={heroContent.title}
          fill
          className="object-contain"
        />
      </div>

      {/* Custom animation for bouncing promo */}
      <style jsx>{`
        @keyframes bounce-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-y {
          animation: bounce-y 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
