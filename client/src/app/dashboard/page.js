"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Clock,
  CheckCircle2,
  PlusCircle,
  Search,
  ArrowRight,
  MapPin,
  Loader2,
  UserRound,
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
        const currentUser = sessionResult.data?.user;

        if (!currentUser) {
          toast.error("Please login to access your dashboard");
          router.replace("/login");
          return;
        }

        setUser(currentUser);

        const [studioResponse, tokenResponse] = await Promise.all([
          fetch(`${API_URL}/studios`),
          authClient.token(),
        ]);

        const studioResult = await studioResponse.json();

        if (!studioResponse.ok) {
          throw new Error(studioResult.message || "Could not load studios");
        }

        const myStudios = (studioResult.studios || []).filter(
          (studio) => studio.hostEmail === currentUser.email,
        );

        setStudios(myStudios);

        const token = tokenResponse.data?.token;

        if (token) {
          const bookingResponse = await fetch(
            `${API_URL}/bookings/my-bookings`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const bookingResult = await bookingResponse.json();

          if (bookingResponse.ok) {
            setBookings(bookingResult.bookings || []);
          } else {
            console.warn("Bookings could not be loaded:", bookingResult);
          }
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error(error.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </main>
    );
  }

  if (!user) return null;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed",
  );

  const stats = [
    {
      title: "My Studios",
      value: studios.length,
      icon: Building2,
      color: "bg-violet-100 text-violet-700",
      href: "/my-listings",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarDays,
      color: "bg-blue-100 text-blue-700",
      href: "/my-bookings",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings.length,
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
      href: "/my-bookings",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings.length,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700",
      href: "/my-bookings",
    },
  ];

  const quickActions = [
    {
      title: "Add New Studio",
      description: "List your creative workspace",
      href: "/add-studio",
      icon: PlusCircle,
    },
    {
      title: "My Studio Listings",
      description: "Manage your listed studios",
      href: "/my-listings",
      icon: Building2,
    },
    {
      title: "Explore Studios",
      description: "Discover creative spaces",
      href: "/studios",
      icon: Search,
    },
    {
      title: "My Bookings",
      description: "View your booking requests",
      href: "/my-bookings",
      icon: CalendarDays,
    },
  ];

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <section className="mb-9 overflow-hidden rounded-3xl bg-violet-700 p-7 text-white shadow-lg sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-violet-100">
                <LayoutDashboard size={17} />
                StudioSpace Dashboard
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Welcome back, {user.name?.split(" ")[0] || "Creator"}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                Manage your creative spaces, track bookings, and keep your
                workspace journey organized.
              </p>
            </div>

            {/* Add Studio Button */}
            <Link
              href="/add-studio"
              style={{
                color: "#6d28d9",
                backgroundColor: "#ede9fe",
                borderColor: "#c4b5fd",
              }}
              className="inline-flex w-fit items-center gap-2 rounded-xl border-2 px-6 py-3 font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-300"
            >
              <PlusCircle size={19} color="#6d28d9" />
              <span style={{ color: "#6d28d9" }}>Add Studio</span>
              <ArrowRight size={17} color="#6d28d9" />
            </Link>
          </div>
        </section>

        {/* User Profile */}
        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <UserRound size={30} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {user.name || "StudioSpace Member"}
            </h2>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
            <p className="mt-1 text-xs text-violet-600">
              Creative Community Member
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Back to Home
          </Link>
        </section>

        {/* Statistics */}
        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
            Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.title}
                  href={stat.href}
                  className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.title}
                      </p>
                      <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <Icon size={23} />
                    </div>
                  </div>

                  <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-600">
                    View details <ArrowRight size={14} />
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-violet-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {action.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-600">
                    Open <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Bookings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest workspace booking requests
              </p>
            </div>

            <Link
              href="/my-bookings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:underline"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 px-5 py-12 text-center dark:bg-gray-800">
              <CalendarDays className="mx-auto mb-3 text-gray-400" size={35} />

              <h3 className="font-bold text-gray-800 dark:text-white">
                No bookings yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Explore available studios and book your first creative space.
              </p>

              <Link
                href="/studios"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
              >
                Explore Studios <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-900 dark:text-white">
                      {booking.studioTitle || booking.title || "Studio Booking"}
                    </h3>

                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      {booking.location || "Workspace"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {booking.date || "Date not available"} ·{" "}
                      {booking.startTime || ""} - {booking.endTime || ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : booking.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>

                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      ৳{booking.totalPrice ?? booking.hourlyRate ?? 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
