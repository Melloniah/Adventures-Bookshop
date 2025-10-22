"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicHeroBannersAPI  } from "../../lib/api";
import { getImageUrl, handleImageError, placeholderSVG } from "utils/imageUtils";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [paused, setPaused] = useState(false);
  const [imageHeight, setImageHeight] = useState(600);
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

  // Load first image to get dimensions
  useEffect(() => {
    if (slides.length > 0 && slides[0]?.image) {
      const img = document.createElement('img');
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const viewportWidth = window.innerWidth;
        const calculatedHeight = Math.min(Math.max(viewportWidth * aspectRatio, 400), 900);
        setImageHeight(calculatedHeight);
      };
      img.src = getImageUrl(slides[0].image) || placeholderSVG;
    }
  }, [slides]);

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

  // Update height on window resize
  useEffect(() => {
    const handleResize = () => {
      if (slides.length > 0 && slides[0]?.image) {
        const img = document.createElement('img');
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          const viewportWidth = window.innerWidth;
          const calculatedHeight = Math.min(Math.max(viewportWidth * aspectRatio, 400), 900);
          setImageHeight(calculatedHeight);
        };
        img.src = getImageUrl(slides[0].image) || placeholderSVG;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <section className="relative flex items-center justify-center bg-gray-200 m-0 block" style={{ height: '500px' }}>
        <p className="text-gray-600">Loading banners...</p>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden w-full block"
  style={{
    height: `${imageHeight}px`,
    maxHeight: "90vh",
  }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides wrapper */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out m-0 p-0"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
        <div key={slide.id} className="flex-shrink-0 w-full h-full relative bg-black">
  <Image
  src={getImageUrl(slide.image) || placeholderSVG}
  alt={slide.title || "Hero Banner"}
  fill
  priority
  onError={handleImageError}
  sizes="100vw"
  className="object-cover object-center md:object-center"
  style={{
    transform: "scale(1.05)", // slight zoom to avoid black bars
  }}
/>
            {/* Overlay content */}
            <div className="absolute inset-0 bg-black/40 flex items-end sm:items-center px-4 sm:px-6 md:px-12 pb-10 sm:pb-0">
              <div className="text-left max-w-xs sm:max-w-md md:max-w-lg">
                <div className="max-w-lg">
                  {slide.description && (
                    <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-medium mb-4">
                      {slide.description}
                    </div>
                  )}
                   <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-white mb-3 leading-snug drop-shadow-lg">
  {slide.title}
</h1>

                  {slide.subtitle && (
                    <p className="text-sm sm:text-base md:text-2xl text-gray-200 mb-6 drop-shadow-md">
  {slide.subtitle}
</p>

                  )}
                  <Link
                    href="/products"
                     className="inline-block bg-white text-black px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
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
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 z-10"
      >
        ❮
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % slides.length)
        }
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 z-10"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
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