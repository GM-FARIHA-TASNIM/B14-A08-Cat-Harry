"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { CalendarDays, Clock3, MapPin, X, Camera } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const session = await authClient.getSession();

        if (!session.data?.user) {
          window.location.href = "/login";
          return;
        }

        const tokenResponse = await authClient.token();
        const token = tokenResponse.data?.token;

        if (!token) throw new Error("Authentication token not found");

        const response = await fetch(
          "http://localhost:5000/api/bookings/my-bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        setBookings(result.bookings || []);
      } catch (error) {
        toast.error(error.message || "Could not load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const cancelBooking = async () => {
    if (!selectedBooking) return;

    const id = selectedBooking._id;
    setCancelling(id);

    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setBookings((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, status: "Cancelled" } : item,
        ),
      );

      setSelectedBooking(null);
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error(error.message || "Cancellation failed");
    } finally {
      setCancelling(null);
    }
  };

  const statusStyle = {
    Pending: "bg-amber-100 text-amber-700",
    Confirmed: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-6xl animate-pulse space-y-5">
          <div className="h-9 w-56 rounded bg-gray-200" />
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="h-64 rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Creator Dashboard
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">My Bookings</h1>
            <p className="mt-2 text-gray-500">
              Track and manage your workspace reservations.
            </p>
          </div>

          <Link
            href="/studios"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Studios
          </Link>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total", value: bookings.length },
            {
              label: "Pending",
              value: bookings.filter((b) => b.status === "Pending").length,
            },
            {
              label: "Confirmed",
              value: bookings.filter((b) => b.status === "Confirmed").length,
            },
            {
              label: "Cancelled",
              value: bookings.filter((b) => b.status === "Cancelled").length,
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border p-5">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border px-5 py-20 text-center">
            <Camera className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h2 className="text-xl font-bold">No bookings yet</h2>
            <p className="mt-2 text-gray-500">
              Your creative journey starts with finding the right studio.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Find a Studio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border transition hover:shadow-lg"
              >
                {item.studioImage ? (
                  <img
                    src={item.studioImage}
                    alt={item.studioTitle || "Studio"}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-100">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">
                      {item.studioTitle || "Studio"}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyle[item.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {item.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {item.startTime} – {item.endTime}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-xs text-gray-500">Hourly Rate</p>
                      <p className="text-lg font-bold">
                        ৳{item.hourlyRate} / hour
                      </p>
                    </div>

                    {item.status === "Pending" && (
                      <button
                        onClick={() => setSelectedBooking(item)}
                        className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Cancel Booking?</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={cancelling !== null}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600">
              Are you sure you want to cancel your booking for{" "}
              <strong>{selectedBooking.studioTitle}</strong>? This action cannot
              be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={cancelling !== null}
                className="rounded-lg border px-4 py-2 font-medium"
              >
                Keep Booking
              </button>
              <button
                onClick={cancelBooking}
                disabled={cancelling !== null}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
