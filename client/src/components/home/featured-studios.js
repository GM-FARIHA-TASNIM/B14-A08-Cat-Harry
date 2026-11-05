"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await fetch(`${API_URL}/studios`);
        const data = await response.json();

        if (data.success) {
          const sortedStudios = [...data.studios].sort(
            (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
          );

          setStudios(sortedStudios.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to load featured studios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  return (
    <section className="section-padding">
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Curated spaces
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Featured Studios</h2>
            <p className="mt-3 text-muted-foreground">
              Discover creative spaces for your next big idea.
            </p>
          </div>

          <Link
            href="/studios"
            className="flex items-center gap-2 font-semibold text-primary hover:gap-3"
          >
            Explore All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : studios.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <h3 className="text-xl font-semibold">No studios available yet</h3>
            <p className="mt-2 text-muted-foreground">
              Be the first to share a creative workspace.
            </p>
            <Link
              href="/add-studio"
              className="mt-5 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              List Your Studio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 bg-muted">
                  {studio.image ? (
                    <Image
                      src={studio.image}
                      alt={studio.title || "Creative studio"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-semibold">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-lg font-bold">
                      {studio.title}
                    </h3>

                    <span className="flex shrink-0 items-center gap-1 text-sm">
                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      {studio.rating || "New"}
                    </span>
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={15} />
                    <span className="line-clamp-1">{studio.location}</span>
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <p className="font-bold">
                      ৳{Number(studio.hourlyRate).toLocaleString("en-BD")}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / hour
                      </span>
                    </p>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
