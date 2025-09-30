
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../lib/api";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/hero-banners");
        setSlides(res.data);
      } catch (err) {
        console.error("Failed to fetch hero banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;

    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);
  }, [slides.length, paused]);

  if (slides.length === 0) {
    return (
      <section className="relative h-96 md:h-[500px] flex items-center justify-center bg-gray-200">
        <p className="text-gray-600">Loading banners...</p>
      </section>
    );
  }

  return (
    <section
      className="relative h-96 md:h-[500px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides wrapper */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="flex-shrink-0 w-full h-full relative">
            <Image
              src={
                slide.image.startsWith("http")
                  ? slide.image
                  : `/images/${slide.image}`
              }
              alt={slide.title || "Hero Banner"}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay content */}
            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-lg">
                  {slide.description && (
                    <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium mb-4">
                      {slide.description}
                    </div>
                  )}
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl text-gray-200 mb-8">
                      {slide.subtitle}
                    </p>
                  )}
                  <Link
                    href="/products"
                    className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next controls */}
      <button
        onClick={() =>
          setCurrentSlide((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
          )
        }
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        ❮
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % slides.length)
        }
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-yellow-400" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
