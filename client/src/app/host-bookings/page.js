"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  LoaderCircle,
  Inbox,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function HostBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const sessionResult = await authClient.getSession();
        const session = sessionResult?.data;

        if (!session?.user) {
          router.replace("/login");
          return;
        }

        const tokenResult = await authClient.token();
        const token = tokenResult?.data?.token;

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${API_URL}/bookings/host-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load bookings.");
        }

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Host Bookings Error:", error);
        toast.error(error.message || "Could not load booking requests.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [router]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);

      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update booking.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking,
        ),
      );

      toast.success(
        status === "Confirmed"
          ? "Booking confirmed successfully!"
          : "Booking cancelled successfully!",
      );
    } catch (error) {
      console.error("Booking Update Error:", error);
      toast.error(error.message || "Failed to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const counts = {
    All: bookings.length,
    Pending: bookings.filter((item) => item.status === "Pending").length,
    Confirmed: bookings.filter((item) => item.status === "Confirmed").length,
    Cancelled: bookings.filter((item) => item.status === "Cancelled").length,
    Completed: bookings.filter((item) => item.status === "Completed").length,
  };

  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Completed: "bg-blue-100 text-blue-700",
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="font-semibold tracking-widest text-blue-600">
            HOST MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Booking Requests
          </h1>

          <p className="mt-3 text-gray-500">
            Manage booking requests from creators interested in your studios.
          </p>
        </div>

        {/* Booking Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} className="rounded-xl border bg-card p-5">
              <p className="text-sm text-gray-500">{status}</p>
              <p className="mt-2 text-2xl font-bold">{count}</p>
            </div>
          ))}
        </div>

        {/* Status Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {Object.keys(counts).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "border hover:border-blue-500"
              }`}
            >
              {status} ({counts[status]})
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed py-20 text-center">
            <Inbox size={45} className="mx-auto mb-4 text-gray-400" />

            <h2 className="text-2xl font-bold">No booking requests found</h2>

            <p className="mt-2 text-gray-500">
              {filter === "All"
                ? "Your studio booking requests will appear here."
                : `You don't have any ${filter.toLowerCase()} bookings.`}
            </p>

            <Link
              href="/my-listings"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              View My Studios
            </Link>
          </div>
        ) : (
          /* Booking Cards */
          <div className="grid gap-6 md:grid-cols-2">
            {filteredBookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row">
                  <img
                    src={
                      booking.studioImage ||
                      "https://placehold.co/300x200?text=Studio"
                    }
                    alt={booking.studioTitle || "Studio"}
                    className="h-40 w-full rounded-xl object-cover sm:w-36"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyle[booking.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>

                      <span className="text-sm font-bold text-blue-600">
                        ৳
                        {Number(booking.hourlyRate || 0).toLocaleString(
                          "en-BD",
                        )}
                        /hr
                      </span>
                    </div>

                    <h2 className="text-lg font-bold">
                      {booking.studioTitle || "Studio Booking"}
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={15} />
                      {booking.location || "Location not provided"}
                    </p>

                    <p className="mt-2 break-all text-sm text-gray-500">
                      Creator: {booking.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t px-5 py-4 text-sm">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {booking.date}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock size={16} />
                    {booking.startTime} – {booking.endTime}
                  </p>
                </div>

                {booking.status === "Pending" && (
                  <div className="flex flex-wrap justify-end gap-3 border-t p-5">
                    <button
                      disabled={updatingId === booking._id}
                      onClick={() =>
                        updateBookingStatus(booking._id, "Cancelled")
                      }
                      className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Cancel
                    </button>

                    <button
                      disabled={updatingId === booking._id}
                      onClick={() =>
                        updateBookingStatus(booking._id, "Confirmed")
                      }
                      className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === booking._id ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <CheckCircle size={17} />
                      )}
                      Confirm Booking
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
