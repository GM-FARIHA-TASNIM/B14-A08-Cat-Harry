"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Star } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const categories = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

function StudiosContent() {
  const searchParams = useSearchParams();

  const [studios, setStudios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // URL থেকে category নেওয়া
  useEffect(() => {
    const selectedCategory = searchParams.get("category");

    if (selectedCategory && categories.includes(selectedCategory)) {
      setCategory(selectedCategory);
    } else {
      setCategory("All");
    }
  }, [searchParams]);

  // MongoDB থেকে studios load করা
  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/studios`);

        if (!response.ok) {
          throw new Error("Failed to load studios.");
        }

        const data = await response.json();

        if (data.success) {
          setStudios(data.studios || []);
        } else {
          setStudios([]);
          setError("Unable to load studios.");
        }
      } catch (err) {
        console.error("Studio Fetch Error:", err);
        setStudios([]);
        setError("Could not connect to the server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  // Category এবং Search অনুযায়ী filter করা
  useEffect(() => {
    let result = [...studios];

    if (category !== "All") {
      result = result.filter((studio) => studio.category === category);
    }

    if (search.trim()) {
      const searchValue = search.trim().toLowerCase();

      result = result.filter(
        (studio) =>
          studio.title?.toLowerCase().includes(searchValue) ||
          studio.location?.toLowerCase().includes(searchValue) ||
          studio.category?.toLowerCase().includes(searchValue),
      );
    }

    setFiltered(result);
  }, [category, search, studios]);

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-10 text-center">
          <p className="font-semibold tracking-widest text-blue-600">
            FIND YOUR CREATIVE SPACE
          </p>

          <h1 className="mt-3 text-4xl font-bold">Explore Studios</h1>

          <p className="mt-3 text-gray-500">
            Discover the perfect workspace for your next creative project.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 flex max-w-xl items-center gap-3 rounded-xl border px-4 py-3">
          <Search size={20} className="shrink-0 text-gray-500" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by studio name, location or category..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "border hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && !error && (
          <p className="mb-5 text-sm text-gray-500">
            Showing {filtered.length} of {studios.length} studios
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((number) => (
              <div
                key={number}
                className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold">Something went wrong</h2>

            <p className="mt-2 text-gray-500">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed py-20 text-center">
            <Search size={40} className="mx-auto mb-4 text-gray-400" />

            <h2 className="text-2xl font-bold">No studios found</h2>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Studio Cards */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Studio Image */}
                <div className="h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={
                      studio.image || "https://placehold.co/600x400?text=Studio"
                    }
                    alt={studio.title || "Creative studio"}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  {/* Category and Rating */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {studio.category}
                    </span>

                    <span className="flex items-center gap-1 text-sm">
                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      {studio.rating || "New"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="line-clamp-1 text-xl font-bold">
                    {studio.title}
                  </h2>

                  {/* Location */}
                  <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={15} className="shrink-0" />
                    <span className="line-clamp-1">{studio.location}</span>
                  </p>

                  {/* Price and Details */}
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <p className="font-bold text-blue-600">
                      ৳{Number(studio.hourlyRate).toLocaleString("en-BD")}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        / hour
                      </span>
                    </p>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
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
    </main>
  );
}

// Suspense boundary fixes the Next.js useSearchParams build error
export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 animate-pulse text-center">
              <div className="mx-auto h-5 w-48 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mx-auto mt-4 h-10 w-64 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mx-auto mt-4 h-5 w-80 max-w-full rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <div
                  key={number}
                  className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <StudiosContent />
    </Suspense>
  );
}
