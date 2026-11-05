"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      formData.password.length < 6
    ) {
      toast.error(
        "Password must contain uppercase, lowercase and at least 6 characters.",
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.image || undefined,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join StudioSpace and discover creative spaces.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-violet-600 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-violet-600 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Profile Photo URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-violet-600 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-violet-600 dark:border-gray-700"
            />
            <p className="mt-2 text-xs text-gray-500">
              At least 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3.5 font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-violet-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
