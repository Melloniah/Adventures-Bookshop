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
      <section className="relative flex items-center justify-center bg-gray-200 h-48 sm:h-64 md:h-80">
        <p className="text-gray-600 text-sm">Loading banners...</p>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 w-full relative bg-black"
          >
            {/* Responsive aspect ratio container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
              <Image
                src={getImageUrl(slide.image) || placeholderSVG}
                alt={slide.title || "Hero Banner"}
                fill
                className="object-cover object-center"
                priority
                onError={handleImageError}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              />

              {/* Overlay content */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 sm:px-8 md:px-12">
                <div className="text-center w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
                  {slide.description && (
                    <div className="inline-block bg-yellow-400 text-black px-3 py-1 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium mb-2 sm:mb-4 md:mb-6">
                      {slide.description}
                    </div>
                  )}

                  <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="text-xs sm:text-base md:text-xl lg:text-2xl text-gray-200 mb-3 sm:mb-6 drop-shadow-md line-clamp-2 sm:line-clamp-none">
                      {slide.subtitle}
                    </p>
                  )}

                  <Link
                    href="/products"
                    className="inline-block bg-white text-black px-5 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base md:text-lg shadow-lg"
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
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-black/40 text-white p-1.5 sm:p-3 rounded-full hover:bg-black/60 z-10 transition-all text-sm sm:text-base"
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % slides.length)
        }
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-black/40 text-white p-1.5 sm:p-3 rounded-full hover:bg-black/60 z-10 transition-all text-sm sm:text-base"
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-yellow-400 w-5 sm:w-8"
                : "bg-white/50 w-2 sm:w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;