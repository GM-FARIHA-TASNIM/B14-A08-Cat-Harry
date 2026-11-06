"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85",
    title: "Find Your Perfect Creative Space",
    description:
      "Discover inspiring studios and professional workspaces designed to bring your creative ideas to life.",
    label: "CREATE WITHOUT LIMITS",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=2000&q=85",
    title: "Make Every Production Extraordinary",
    description:
      "From photography studios to professional production spaces, find everything you need in one place.",
    label: "YOUR SPACE, YOUR STORY",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=85",
    title: "Turn Your Ideas Into Reality",
    description:
      "Book inspiring creative spaces and connect with a community that helps your ideas grow.",
    label: "INSPIRE. CREATE. SHARE.",
  },
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const slide = slides[activeSlide];

  return (
    <section
      aria-label="Featured creative spaces"
      className="relative overflow-hidden bg-gray-950"
    >
      <div
        className="relative flex min-h-screen items-center bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(10,10,20,0.88), rgba(10,10,20,0.25)), url('${slide.image}')`,
        }}
      >
        <div className="mx-auto w-[calc(100%-2rem)] max-w-7xl py-24">
          <div className="max-w-2xl text-white">
            <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.2em]">
              {slide.label}
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-200 md:text-lg">
              {slide.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/studios"
                className="rounded-lg bg-[#7357f5] px-7 py-3.5 font-semibold text-white transition hover:bg-[#6042e8]"
              >
                Explore Studios
              </Link>

              <Link
                href="/add-studio"
                className="rounded-lg border border-white/60 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-gray-950"
              >
                Host Your Space
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-black/60 sm:left-8"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-black/60 sm:right-8"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? "w-10 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
