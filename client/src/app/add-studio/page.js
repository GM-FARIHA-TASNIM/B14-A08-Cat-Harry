"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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

export default function AddStudioPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await authClient.getSession();

      if (!session.data?.session) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        toast.error("Could not generate authentication token");
        return;
      }

      const response = await fetch("http://localhost:5000/api/studios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          amenities,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add studio");
      }

      toast.success("Studio added successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-2 font-semibold text-violet-600">
            HOST YOUR CREATIVE SPACE
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Add a New Studio
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Share your workspace with creators and start earning.
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
              placeholder="e.g. Modern Photography Studio"
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
                placeholder="1500"
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
                placeholder="500"
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
                placeholder="10"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Location *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              placeholder="Full studio address"
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
              placeholder="https://example.com/studio-image.jpg"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              Upload your image to imgbb and paste its direct image URL here.
            </p>
            {form.image && (
              <img
                src={form.image}
                alt="Studio preview"
                className="mt-4 h-48 w-full rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div>
            <label className="mb-3 block font-medium">Amenities</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              placeholder="Describe your studio, equipment, facilities and what makes it special..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding Studio..." : "Publish Studio"}
          </button>
        </form>
      </div>
    </main>
  );
}
