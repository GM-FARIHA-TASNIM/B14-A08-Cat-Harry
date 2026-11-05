import Link from "next/link";
import {
  Aperture,
  Target,
  Eye,
  Heart,
  Users,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  Camera,
  Music,
  Mic,
  Palette,
  Film,
} from "lucide-react";

const values = [
  {
    title: "Creativity First",
    description:
      "We believe every great idea deserves the right environment to grow.",
    icon: Lightbulb,
  },
  {
    title: "Trust & Safety",
    description:
      "We aim to make discovering and booking creative spaces transparent and reliable.",
    icon: ShieldCheck,
  },
  {
    title: "Community Driven",
    description:
      "We connect independent studio owners with creators who need inspiring spaces.",
    icon: Users,
  },
  {
    title: "Passion for Art",
    description:
      "We support photographers, filmmakers, musicians, podcasters and artists.",
    icon: Heart,
  },
];

const creativeSpaces = [
  { name: "Photography Studios", icon: Camera },
  { name: "Film Stages", icon: Film },
  { name: "Podcast Rooms", icon: Mic },
  { name: "Music Suites", icon: Music },
  { name: "Art Workshops", icon: Palette },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-950 px-4 py-24 text-white md:py-32">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <Aperture size={36} />
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            About StudioSpace
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Where Creative Ideas
            <span className="block text-blue-400">Find Their Space.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            StudioSpace connects creative people with inspiring workspaces.
            Discover, share and book spaces designed to bring your next creative
            project to life.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Studios
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/add-studio"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-8 md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Target size={28} />
            </div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Our Mission
            </p>

            <h2 className="text-2xl font-bold">
              Making Creative Spaces Accessible
            </h2>

            <p className="mt-4 leading-8 text-gray-500">
              Our mission is to make it easier for creators to discover and book
              suitable workspaces while helping studio owners connect with
              people who value their spaces.
            </p>
          </article>

          <article className="rounded-2xl border bg-card p-8 md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <Eye size={28} />
            </div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-600">
              Our Vision
            </p>

            <h2 className="text-2xl font-bold">
              A Connected Creative Community
            </h2>

            <p className="mt-4 leading-8 text-gray-500">
              We envision a creative community where talent, collaboration and
              opportunity come together through accessible and inspiring
              production spaces.
            </p>
          </article>
        </div>
      </section>

      {/* Creative Spaces */}
      <section className="bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              What You Can Discover
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Spaces for Every Creative Vision
            </h2>

            <p className="mt-4 leading-7 text-gray-500">
              From photography sessions to music production, discover workspaces
              that fit your creative needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {creativeSpaces.map((space) => {
              const Icon = space.icon;

              return (
                <div
                  key={space.name}
                  className="rounded-2xl border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon size={27} />
                  </div>

                  <h3 className="font-semibold">{space.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              What Drives Us
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">Our Core Values</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border bg-card p-6 transition hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon size={25} />
                  </div>

                  <h3 className="text-lg font-bold">{value.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white md:px-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Your Next Creative Project Starts Here
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Find the space, connect with the community and turn your creative
            vision into reality.
          </p>

          <Link
            href="/studios"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Find Your Studio
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
