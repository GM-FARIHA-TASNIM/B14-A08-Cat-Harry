import Link from "next/link";
import {
  Camera,
  Film,
  Mic,
  Music,
  Palette,
  Search,
  CalendarCheck,
  Clapperboard,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  ArrowRight,
} from "lucide-react";

import HeroSlider from "@/components/home/hero-slider";
import FeaturedStudios from "@/components/home/featured-studios";

const categories = [
  { name: "Photo Studios", value: "Photo Studio", icon: Camera },
  { name: "Sound Stages", value: "Film Stage", icon: Film },
  { name: "Podcast Rooms", value: "Podcast Lounge", icon: Mic },
  { name: "Music Suites", value: "Music Suite", icon: Music },
  { name: "Art Workshops", value: "Workshop", icon: Palette },
];

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description: "Explore creative studios that match your project and budget.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description: "Choose your preferred date and available working hours.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Book Instantly",
    description: "Send your booking request and coordinate with the host.",
    icon: BadgeCheck,
  },
  {
    number: "04",
    title: "Create & Produce",
    description: "Arrive at your selected space and bring your ideas to life.",
    icon: Clapperboard,
  },
];

const guarantees = [
  {
    title: "Liability Protection",
    description: "Clear booking details and transparent studio information.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description: "Know who you are booking with through host account details.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    description:
      "Review available amenities and studio details before booking.",
    icon: Camera,
  },
  {
    title: "Creator Support",
    description:
      "Get help with your workspace booking and platform experience.",
    icon: Headphones,
  },
];

export default function HomePage() {
  return (
    <main>
      <HeroSlider />

      <FeaturedStudios />

      <section className="section-padding bg-muted/40">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Find your creative space
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Explore by Category
            </h2>
            <p className="mt-3 text-muted-foreground">
              Find the right environment for every kind of creative project.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.value}
                  href={`/studios?category=${encodeURIComponent(category.value)}`}
                  className="group rounded-2xl border bg-card p-6 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={27} />
                  </div>

                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    Explore <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-padding">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Simple process
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              How Booking Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four simple steps to your next creative workspace.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={30} />
                  </div>

                  <p className="mb-2 text-sm font-bold text-primary">
                    STEP {step.number}
                  </p>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/40">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Your creative journey matters
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Host Guarantee & Creator Support
            </h2>
            <p className="mt-3 text-muted-foreground">
              A better workspace experience for hosts and creators.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-card p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={25} />
                  </div>

                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">
              Have a creative space to share?
            </h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              Turn your studio into an opportunity & Connect with creators
              looking for the perfect place to work.
            </p>
            <Link
              href="/add-studio"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background px-6 py-3 font-semibold text-foreground transition hover:opacity-90"
            >
              Become a Host <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
