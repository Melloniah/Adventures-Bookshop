"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicHeroBannersAPI } from "../../lib/api";
import { getImageUrl, handleImageError, placeholderSVG } from "utils/imageUtils";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getPublicHeroBannersAPI.getPublicHeroBanners();
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
      }, 3000);
    }

    return () => clearInterval(intervalRef.current);
  }, [slides.length, paused]);

  if (slides.length === 0) {
    return (
      <section className="relative flex items-center justify-center bg-gray-200 h-[600px]">
        <p className="text-gray-600">Loading banners...</p>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden w-full h-[50vh] sm:h-[70vh] lg:h-[90vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides wrapper */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-full h-full relative bg-black"
          >
            <Image
              src={getImageUrl(slide.image) || placeholderSVG}
              alt={slide.title || "Hero Banner"}
              fill
              className="object-contain sm:object-cover object-center"
              priority
              onError={handleImageError}
              sizes="100vw"
            />

            {/* Overlay content */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 sm:px-6">
              <div className="text-center max-w-4xl">
                {slide.description && (
                  <div className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full text-sm sm:text-base font-medium mb-6">
                    {slide.description}
                  </div>
                )}

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>

                {slide.subtitle && (
                  <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-6 sm:mb-8 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                )}

                <Link
                  href="/products"
                  className="inline-block bg-white text-black px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base sm:text-lg shadow-lg"
                >
                  Shop Now
                </Link>
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
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 z-10 transition-all"
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % slides.length)
        }
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 z-10 transition-all"
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-yellow-400 w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
