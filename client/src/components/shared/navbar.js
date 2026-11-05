"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const result = await authClient.getSession();

        if (active) {
          setSession(result.data?.user || null);
        }
      } catch (error) {
        console.error("Session error:", error);
        if (active) setSession(null);
      } finally {
        if (active) setSessionLoading(false);
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await authClient.signOut();
      setSession(null);
      setProfileOpen(false);
      setMobileMenu(false);
      toast.success("Logged out successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Could not logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/#how-it-works") return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const dashboardLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Add New Studio",
      href: "/add-studio",
      icon: PlusCircle,
    },
    {
      name: "My Studio Listings",
      href: "/my-listings",
      icon: Building2,
    },
    {
      name: "My Bookings",
      href: "/my-bookings",
      icon: CalendarDays,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-950/95">
      <nav className="mx-auto flex h-20 w-[calc(100%-2rem)] max-w-7xl items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "text-violet-600"
                  : "text-gray-600 hover:text-violet-600 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {!sessionLoading &&
            (session ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 p-1.5 pr-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  {session.image ? (
                    <img
                      src={session.image}
                      alt={session.name || "Profile"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                      <User size={20} />
                    </span>
                  )}

                  <span className="max-w-28 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {session.name || "My Account"}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-700">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                        {session.name || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {session.email}
                      </p>
                    </div>

                    <div className="py-2">
                      {dashboardLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            <Icon size={17} />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-100 pt-2 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                      >
                        <LogOut size={17} />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-violet-700"
                >
                  Register
                </Link>
              </>
            ))}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation menu"
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-950 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className={`font-semibold ${
                  isActive(link.href)
                    ? "text-violet-600"
                    : "text-gray-700 hover:text-violet-600 dark:text-gray-200"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {!sessionLoading &&
              (session ? (
                <>
                  <div className="flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                    {session.image ? (
                      <img
                        src={session.image}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                        <User size={20} />
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-bold dark:text-white">
                        {session.name || "My Account"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {session.email}
                      </p>
                    </div>
                  </div>

                  {dashboardLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center gap-3 font-semibold text-gray-700 hover:text-violet-600 dark:text-gray-200"
                      >
                        <Icon size={18} />
                        {item.name}
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 rounded-xl bg-red-50 p-3 font-bold text-red-600 disabled:opacity-50 dark:bg-red-950"
                  >
                    <LogOut size={18} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenu(false)}
                    className="font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenu(false)}
                    className="rounded-xl bg-violet-600 p-3 text-center font-bold text-white hover:bg-violet-700"
                  >
                    Register
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
