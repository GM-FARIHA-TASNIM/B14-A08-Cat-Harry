"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }

      toast.success("Welcome to StudioSpace!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue your creative journey.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-violet-600 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-violet-600 dark:border-gray-700"
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-violet-600"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3.5 font-bold text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-violet-600">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
