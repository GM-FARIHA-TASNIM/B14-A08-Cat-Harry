import Link from "next/link";
import { Aperture, ArrowLeft, Home, Search, Camera } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute left-10 top-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-2xl text-center">
        <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full border-2 border-dashed border-blue-500/40 bg-blue-500/5">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl">
            <Aperture size={55} strokeWidth={1.5} />
          </div>

          <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white">
            <Camera size={23} />
          </div>
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
          StudioSpace
        </p>

        <h1 className="mt-5 text-7xl font-extrabold tracking-tight md:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold md:text-3xl">
          Looks Like This Space Is Empty!
        </h2>

        <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
          The page you are looking for may have moved, been removed, or never
          existed. Let's get you back to discovering creative spaces.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Home size={18} />
            Return Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition hover:border-blue-500 hover:text-blue-600"
          >
            <Search size={18} />
            Explore Studios
          </Link>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-blue-600"
        >
          <ArrowLeft size={15} />
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
