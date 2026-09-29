"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const slides = [
    {
      id: 1,
      title: "Explore Europe",
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
      href: "/europe",
    },
    {
      id: 2,
      title: "Discover Switzerland",
      image:
        "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
      href: "/switzerland",
    },
    {
      id: 3,
      title: "Visit Italy",
      image:
        "https://images.unsplash.com/photo-1529260830199-42c24126f198",
      href: "/italy",
    },
  ];

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());

    onSelect();

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <main className="min-h-screen bg-gray-100 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Travel Carousel POC
        </h1>

        <div className="relative">
          {/* Carousel viewport */}
          <div
            className="overflow-hidden rounded-2xl"
            ref={emblaRef}
          >
            {/* Slides container */}
            <div className="flex">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="min-w-0 flex-[0_0_100%]"
                >
                  <Link href={slide.href}>
                    <div className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[380px] md:h-[500px]"
                      />

                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                        <div className="p-5 sm:p-6 md:p-8">
                          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/80">
                            Destination
                          </p>

                          <h2 className="text-2xl font-extrabold text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                            {slide.title}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Previous button */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-2xl text-white transition hover:bg-black/80"
            aria-label="Previous slide"
          >
            ‹
          </button>

          {/* Next button */}
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-2xl text-white transition hover:bg-black/80"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        {/* Pagination dots */}
        <div className="mt-5 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === selectedIndex
                  ? "scale-110 bg-gray-900"
                  : "bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}