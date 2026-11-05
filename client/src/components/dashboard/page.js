"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Building2,
  CalendarDays,
  Clock,
  CheckCircle,
  Plus,
  List,
  LayoutDashboard,
  ArrowRight,
  LoaderCircle,
  Inbox,
  ClipboardList,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [studios, setStudios] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const sessionResult = await authClient.getSession();
        const session = sessionResult?.data;

        if (!session?.user) {
          router.replace("/login");
          return;
        }

        setUser(session.user);

        const tokenResult = await authClient.token();
        const token = tokenResult?.data?.token;

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [studioResponse, bookingResponse] = await Promise.all([
          fetch(`${API_URL}/studios`),
          fetch(`${API_URL}/bookings/host-bookings`, {
            headers,
          }),
        ]);

        const studioData = await studioResponse.json();
        const bookingData = await bookingResponse.json();

        if (!studioResponse.ok) {
          throw new Error("Failed to load studios.");
        }

        if (!bookingResponse.ok || !bookingData.success) {
          throw new Error(
            bookingData.message || "Failed to load booking requests.",
          );
        }

        const myStudios = (studioData.studios || []).filter(
          (studio) => studio.hostEmail === session.user.email,
        );

        setStudios(myStudios);
        setBookings(bookingData.bookings || []);
      } catch (error) {
        console.error("Dashboard Error:", error);
        toast.error(error.message || "Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed",
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  );

  const stats = [
    {
      title: "My Studios",
      value: studios.length,
      icon: Building2,
      description: "Your listed creative spaces",
      color: "text-blue-600",
      background: "bg-blue-100",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarDays,
      description: "All booking requests",
      color: "text-purple-600",
      background: "bg-purple-100",
    },
    {
      title: "Pending Requests",
      value: pendingBookings.length,
      icon: Clock,
      description: "Waiting for your response",
      color: "text-yellow-600",
      background: "bg-yellow-100",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings.length,
      icon: CheckCircle,
      description: "Successfully confirmed",
      color: "text-green-600",
      background: "bg-green-100",
    },
  ];

  const quickLinks = [
    {
      title: "Add New Studio",
      description: "List a new creative workspace.",
      href: "/add-studio",
      icon: Plus,
    },
    {
      title: "My Studio Listings",
      description: "Manage your existing studios.",
      href: "/my-listings",
      icon: List,
    },
    {
      title: "Manage Booking Requests",
      description: "Confirm or cancel creator requests.",
      href: "/host-bookings",
      icon: ClipboardList,
    },
    {
      title: "My Bookings",
      description: "View your workspace bookings.",
      href: "/my-bookings",
      icon: CalendarDays,
    },
  ];

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Completed: "bg-blue-100 text-blue-700",
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-blue-600"
            size={40}
          />
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="font-semibold tracking-widest text-blue-600">
              YOUR WORKSPACE
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Welcome back, {user?.name || "Creator"}!
            </h1>

            <p className="mt-3 text-gray-500">
              Manage your studios, bookings and creative workspace activities.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={19} />
            Add New Studio
          </Link>
        </div>

        {/* Statistics */}
        <section className="mb-12">
          <h2 className="mb-5 text-xl font-bold">Overview</h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>

                      <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.background} ${stat.color}`}
                    >
                      <Icon size={24} />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Everything you need to manage your workspace.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <h3 className="font-bold">{item.title}</h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {item.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                    Open <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Booking Requests */}
        <section className="mb-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Recent Booking Requests</h2>
              <p className="mt-1 text-sm text-gray-500">
                Latest requests received for your studios.
              </p>
            </div>

            <Link
              href="/host-bookings"
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-14 text-center">
              <Inbox size={40} className="mx-auto mb-4 text-gray-400" />

              <h3 className="text-lg font-bold">No booking requests yet</h3>

              <p className="mt-2 text-sm text-gray-500">
                Your studio booking requests will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border bg-card">
              <div className="divide-y">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold">
                        {booking.studioTitle || "Studio Booking"}
                      </h3>

                      <p className="mt-1 break-all text-sm text-gray-500">
                        {booking.customerEmail}
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays size={14} />
                        {booking.date} · {booking.startTime} - {booking.endTime}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[booking.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>

                      <span className="font-bold">
                        ৳
                        {Number(booking.hourlyRate || 0).toLocaleString(
                          "en-BD",
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* My Studios */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">My Studios</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your currently listed creative spaces.
              </p>
            </div>

            <Link
              href="/my-listings"
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {studios.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-14 text-center">
              <Building2 size={40} className="mx-auto mb-4 text-gray-400" />

              <h3 className="text-lg font-bold">
                You haven't listed a studio yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Share your creative workspace with other creators.
              </p>

              <Link
                href="/add-studio"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
              >
                <Plus size={18} />
                Add Your First Studio
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {studios.slice(0, 3).map((studio) => (
                <article
                  key={studio._id}
                  className="overflow-hidden rounded-2xl border bg-card"
                >
                  <img
                    src={
                      studio.image || "https://placehold.co/600x400?text=Studio"
                    }
                    alt={studio.title || "Studio"}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5">
                    <p className="text-xs font-semibold text-blue-600">
                      {studio.category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold">{studio.title}</h3>

                    <p className="mt-2 text-sm text-gray-500">
                      ৳{Number(studio.hourlyRate || 0).toLocaleString("en-BD")}{" "}
                      / hour
                    </p>

                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Manage Studio <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
