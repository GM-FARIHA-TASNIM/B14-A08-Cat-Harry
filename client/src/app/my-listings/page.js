"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Plus, MapPin, Users, Pencil, Trash2, Home } from "lucide-react";

export default function MyListingsPage() {
  const router = useRouter();

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load logged-in user's studios
  useEffect(() => {
    const loadStudios = async () => {
      try {
        const session = await authClient.getSession();
        const email = session.data?.user?.email;

        if (!email) {
          toast.error("Please login first");
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/studios");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load studios");
        }

        const myStudios = (result.studios || []).filter(
          (studio) => studio.hostEmail === email,
        );

        setStudios(myStudios);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Could not load your studios");
      } finally {
        setLoading(false);
      }
    };

    loadStudios();
  }, [router]);

  // Delete studio
  const handleDelete = async () => {
    if (!deleting) return;

    setDeleteLoading(true);

    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token unavailable");
      }

      const response = await fetch(
        `http://localhost:5000/api/studios/${deleting._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setStudios((prev) =>
        prev.filter((studio) => studio._id !== deleting._id),
      );

      setDeleting(null);
      toast.success("Studio deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Could not delete studio");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="animate-pulse font-medium text-violet-600">
          Loading your studios...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-violet-600">HOST DASHBOARD</p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              My Studio Listings
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage the creative spaces you have published.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Back to Home */}
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:border-violet-600 hover:bg-violet-50 hover:text-violet-700 dark:border-gray-700 dark:text-white dark:hover:bg-violet-950"
            >
              <Home size={18} />
              Back to Home
            </Link>

            {/* Add New Studio */}
            <Link
              href="/add-studio"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
            >
              <Plus size={18} />
              Add New Studio
            </Link>
          </div>
        </div>

        {/* Studio List */}
        {studios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No studios listed yet
            </h2>

            <p className="mt-2 text-gray-500">
              Publish your first creative workspace.
            </p>

            <Link
              href="/add-studio"
              className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 text-white transition hover:bg-violet-700"
            >
              Add Your Studio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <img
                  src={
                    studio.image || "https://placehold.co/600x400?text=Studio"
                  }
                  alt={studio.title}
                  className="h-52 w-full object-cover"
                />

                <div className="p-5">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                    {studio.category}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                    {studio.title}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    {studio.location}
                  </p>

                  <p className="mt-3 font-semibold text-violet-600">
                    ৳{studio.hourlyRate} / hour
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} />
                    Capacity: {studio.capacity}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="flex-1 rounded-lg border border-violet-600 py-2 text-center text-sm font-semibold text-violet-600 transition hover:bg-violet-50 dark:hover:bg-violet-950"
                    >
                      View Details
                    </Link>

                    <Link
                      href={`/studios/edit/${studio._id}`}
                      title="Edit Studio"
                      aria-label="Edit Studio"
                      className="rounded-lg bg-violet-100 p-2 text-violet-700 transition hover:bg-violet-200 dark:bg-violet-950 dark:text-violet-300"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleting(studio)}
                      title="Delete Studio"
                      aria-label="Delete Studio"
                      className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200 dark:bg-red-950 dark:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950">
              <Trash2 size={24} />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Delete Studio?
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete <strong>{deleting.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
