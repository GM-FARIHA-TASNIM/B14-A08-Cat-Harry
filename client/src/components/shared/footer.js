"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Aperture,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Globe,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  { name: "Photo Studios", value: "Photo Studio" },
  { name: "Sound Stages", value: "Film Stage" },
  { name: "Podcast Rooms", value: "Podcast Lounge" },
  { name: "Music Suites", value: "Music Suite" },
  { name: "Art Workshops", value: "Workshop" },
];

const footerLinkClass =
  "text-sm text-gray-400 transition-colors hover:text-violet-700";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed.");
      }

      toast.success(data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-gray-300 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2 text-2xl font-bold text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-700">
                <Aperture size={24} />
              </span>
              Studio<span className="text-violet-400">Space</span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-400">
              A creative home for creators. Discover inspiring studios, share
              your workspace, and bring your next big idea to life.
            </p>

            <div className="mt-6 flex gap-3">
              {[
                {
                  href: "https://www.instagram.com/",
                  label: "Instagram",
                  Icon: Camera,
                },
                {
                  href: "https://x.com/",
                  label: "X",
                  Icon: Globe,
                },
                {
                  href: "https://www.facebook.com/",
                  label: "Facebook",
                  Icon: Globe,
                },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="rounded-full border border-gray-700 p-2.5 transition hover:border-violet-700 hover:bg-violet-700 hover:text-white"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              <li>
                <Link href="/" className={footerLinkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/studios" className={footerLinkClass}>
                  Explore Studios
                </Link>
              </li>
              <li>
                <Link href="/about" className={footerLinkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/add-studio" className={footerLinkClass}>
                  Host Your Space
                </Link>
              </li>
              <li>
                <Link href="/login" className={footerLinkClass}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/terms" className={footerLinkClass}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Explore Categories
            </h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category.value)}`}
                    className={footerLinkClass}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Stay Inspired
            </h3>

            <p className="mb-5 text-sm leading-7 text-gray-400">
              Get creative space updates, fresh ideas, and exclusive news
              straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-3 py-1">
                <Mail size={18} className="shrink-0 text-gray-400" />
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-3 text-xs text-gray-500">
              No spam. Just creative inspiration.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-14 grid gap-4 border-t border-gray-800 pt-8 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 text-gray-400">
            <Mail size={17} className="text-violet-400" />
            <span>Get in touch through our platform</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <MapPin size={17} className="text-violet-400" />
            <span>Connecting creative spaces everywhere</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <Phone size={17} className="text-violet-400" />
            <span>Creator support and assistance</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-gray-800 pt-7 text-sm text-gray-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <Link href="/about" className={footerLinkClass}>
              About
            </Link>
            <Link href="/studios" className={footerLinkClass}>
              Explore
            </Link>
            <Link href="/terms" className={footerLinkClass}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
