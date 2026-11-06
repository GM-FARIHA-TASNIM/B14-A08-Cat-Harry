"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  ShieldCheck,
  CalendarDays,
  Clock,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function StudioDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const response = await fetch(`${API_URL}/studios/${params.id}`);

        const result = await response.json();

        if (!response.ok || !result.studio) {
          throw new Error(result.message || "Studio not found");
        }

        setStudio(result.studio);
      } catch (error) {
        console.error("Studio details error:", error);
        toast.error(error.message || "Could not load studio details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchStudio();
  }, [params.id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime) {
      toast.error("Please select date and booking time");
      return;
    }

    if (endTime <= startTime) {
      toast.error("End time must be after start time");
      return;
    }

    setBooking(true);

    try {
      const session = await authClient.getSession();
      const user = session.data?.user;

      if (!user) {
        toast.error("Please login to book this studio");
        router.push("/login");
        return;
      }

      if (user.email === studio.hostEmail) {
        toast.error("You cannot book your own studio");
        return;
      }

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          endTime,
          hourlyRate: studio.hourlyRate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Booking request submitted successfully!");
      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Could not submit booking");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Studio Not Found</h1>
        <p className="mt-3 text-gray-500">
          This studio may have been removed or the link is incorrect.
        </p>
        <Link
          href="/studios"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-white"
        >
          Explore Studios
        </Link>
      </main>
    );
  }

  const amenities = Array.isArray(studio.amenities) ? studio.amenities : [];

  return (
    <main className="container mx-auto min-h-screen px-4 py-10">
      <Link
        href="/studios"
        className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-violet-600"
      >
        <ArrowLeft size={18} />
        Back to Studios
      </Link>

      <div className="grid gap-10 lg:grid-cols-3">
        <section className="space-y-7 lg:col-span-2">
          <div className="overflow-hidden rounded-3xl bg-gray-100">
            <img
              src={
                studio.image ||
                studio.imageUrl ||
                "https://placehold.co/1200x700?text=StudioSpace"
              }
              alt={studio.title}
              className="h-72 w-full object-cover sm:h-96"
            />
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
                {studio.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-amber-500">
                <Star size={16} fill="currentColor" />
                {studio.rating || "New"}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {studio.title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-gray-500">
              <MapPin size={18} />
              {studio.location}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border p-4">
                <Users className="mb-2 text-violet-600" />
                <p className="text-sm text-gray-500">Maximum Capacity</p>
                <p className="mt-1 font-bold">
                  {studio.capacity || "N/A"} People
                </p>
              </div>

              <div className="rounded-2xl border p-4">
                <ShieldCheck className="mb-2 text-violet-600" />
                <p className="text-sm text-gray-500">Security Deposit</p>
                <p className="mt-1 font-bold">৳{studio.securityDeposit || 0}</p>
              </div>

              <div className="rounded-2xl border p-4">
                <Clock className="mb-2 text-violet-600" />
                <p className="text-sm text-gray-500">Hourly Rate</p>
                <p className="mt-1 font-bold">৳{studio.hourlyRate} / hour</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">About This Studio</h2>
            <p className="whitespace-pre-line leading-7 text-gray-600">
              {studio.description || "No description available."}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold">Amenities & Facilities</h2>

            {amenities.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {amenities.map((item, index) => (
                  <span
                    key={index}
                    className="rounded-full border px-4 py-2 text-sm text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No amenities listed.</p>
            )}
          </div>

          <div className="rounded-2xl border p-5">
            <h2 className="text-lg font-bold">Hosted By</h2>
            <p className="mt-2 text-gray-600">
              {studio.hostName || "Studio Host"}
            </p>
            <p className="text-sm text-gray-500">{studio.hostEmail}</p>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border p-6 shadow-sm">
          <p className="text-sm text-gray-500">Starting from</p>
          <p className="mt-1 text-3xl font-bold">
            ৳{studio.hourlyRate}
            <span className="text-base font-normal text-gray-500"> / hour</span>
          </p>

          <div className="my-6 border-t" />

          <h2 className="mb-5 text-xl font-bold">Book This Workspace</h2>

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                <CalendarDays className="mr-1 inline" size={16} />
                Booking Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <button
              type="submit"
              disabled={booking}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {booking ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing....
                </>
              ) : (
                "Book Workspace Now"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Your booking request will be submitted as Pending.
          </p>
        </aside>
      </div>
    </main>
  );
}
