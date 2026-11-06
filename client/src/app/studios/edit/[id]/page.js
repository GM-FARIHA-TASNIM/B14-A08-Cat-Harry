"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const initialForm = {
  title: "",
  category: "Photo Studio",
  hourlyRate: "",
  securityDeposit: "0",
  capacity: "",
  location: "",
  image: "",
  description: "",
};

const amenityOptions = [
  "High-Speed Wi-Fi",
  "Air Conditioning",
  "Lighting Equipment",
  "Soundproof Room",
  "Parking",
  "Green Screen",
  "Camera Equipment",
  "Editing Setup",
];

export default function EditStudioPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [amenities, setAmenities] = useState([]);
  const [hostEmail, setHostEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStudio = async () => {
      try {
        const sessionResult = await authClient.getSession();
        const user = sessionResult.data?.user;

        if (!user) {
          toast.error("Please login first");
          router.replace("/login");
          return;
        }

        const response = await fetch(`${API_URL}/studios/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load studio");
        }

        const studio = result.studio;

        if (studio.hostEmail !== user.email) {
          toast.error("You are not allowed to edit this studio");
          router.replace("/my-listings");
          return;
        }

        if (!active) return;

        setHostEmail(user.email);
        setForm({
          title: studio.title || "",
          category: studio.category || "Photo Studio",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? 0),
          capacity: String(studio.capacity ?? ""),
          location: studio.location || "",
          image: studio.image || "",
          description: studio.description || "",
        });
        setAmenities(studio.amenities || []);
      } catch (error) {
        console.error("Load studio error:", error);
        toast.error(error.message || "Could not load studio");
        router.replace("/my-listings");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) loadStudio();

    return () => {
      active = false;
    };
  }, [id, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAmenity = (amenity) => {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const sessionResult = await authClient.getSession();

      if (!sessionResult.data?.user) {
        toast.error("Please login first");
        router.replace("/login");
        return;
      }

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Authentication token unavailable");
      }

      const response = await fetch(`${API_URL}/studios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          hourlyRate: Number(form.hourlyRate),
          securityDeposit: Number(form.securityDeposit),
          capacity: Number(form.capacity),
          amenities,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio");
      }

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Update studio error:", error);
      toast.error(error.message || "Could not update studio");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/my-listings"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-violet-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to My Listings
        </Link>

        <div className="mb-8">
          <p className="mb-2 font-semibold text-violet-600">
            MANAGE YOUR CREATIVE SPACE
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Edit Studio
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Update your studio information and workspace facilities.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8"
        >
          <div>
            <label className="mb-2 block font-medium">Studio Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Photo Studio</option>
                <option>Film Stage</option>
                <option>Podcast Lounge</option>
                <option>Music Suite</option>
                <option>Workshop</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Hourly Rate (৳) *
              </label>
              <input
                type="number"
                min="1"
                name="hourlyRate"
                value={form.hourlyRate}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Security Deposit (৳)
              </label>
              <input
                type="number"
                min="0"
                name="securityDeposit"
                value={form.securityDeposit}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Maximum Capacity *
              </label>
              <input
                type="number"
                min="1"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Your Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Studio Image URL *</label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              className={inputClass}
              required
            />

            {form.image && (
              <img
                src={form.image}
                alt="Studio preview"
                className="mt-4 h-48 w-full rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div>
            <label className="mb-3 block font-medium">Amenities</label>
            <div className="grid gap-3 sm:grid-cols-2">
              {amenityOptions.map((amenity) => (
                <label
                  key={amenity}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenity(amenity)}
                    className="h-4 w-4 accent-violet-600"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Studio Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              rows={5}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Host Email</label>
            <input
              value={hostEmail}
              readOnly
              className={`${inputClass} cursor-not-allowed opacity-70`}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Saving Changes....
              </>
            ) : (
              <>
                <Save size={19} />
                Update Studio
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
