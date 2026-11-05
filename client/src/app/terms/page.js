import Link from "next/link";
import {
  Aperture,
  ArrowLeft,
  ShieldCheck,
  Users,
  CalendarCheck,
  CreditCard,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | StudioSpace",
  description: "Read the terms and conditions for using StudioSpace.",
};

const sections = [
  {
    icon: Users,
    title: "1. Account Responsibilities",
    text: "Users must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.",
  },
  {
    icon: ShieldCheck,
    title: "2. Studio Hosts",
    text: "Hosts must provide accurate studio descriptions, genuine photographs, correct pricing, and up-to-date availability. Hosts are responsible for ensuring that their spaces are safe and suitable for the activities they advertise.",
  },
  {
    icon: CalendarCheck,
    title: "3. Bookings and Cancellations",
    text: "Users should review studio details, booking dates, and selected times before submitting a booking request. Booking requests remain pending until the host confirms or cancels them. Users may cancel pending requests through their account.",
  },
  {
    icon: CreditCard,
    title: "4. Pricing and Payments",
    text: "StudioSpace displays hourly rates and security deposits supplied by hosts. Any payment arrangements, deposits, refunds, or additional charges must be clearly communicated between the host and the customer.",
  },
  {
    icon: AlertCircle,
    title: "5. Acceptable Use",
    text: "Users must not provide misleading information, misuse another person's account, publish inappropriate content, or use the platform for unlawful activities. StudioSpace may restrict accounts involved in misuse of the service.",
  },
  {
    icon: ShieldCheck,
    title: "6. Safety and Liability",
    text: "Hosts and customers should communicate clearly about equipment, access, safety requirements, and studio rules. Users are responsible for treating shared spaces and equipment with care.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-violet-700 dark:text-gray-400 dark:hover:text-violet-400"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
            <Aperture size={30} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400">
            StudioSpace Guidelines
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-gray-600 dark:text-gray-400">
            Welcome to StudioSpace. These terms explain the basic rules and
            responsibilities for using our creative workspace sharing platform.
            By accessing the platform, you agree to follow these guidelines.
          </p>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            Last updated: November 2026
          </p>
        </div>

        <div className="space-y-5">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                    <Icon size={20} />
                  </span>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {section.text}
                </p>
              </section>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-gray-900 p-7 text-white sm:p-9">
          <h2 className="text-xl font-bold">Questions about these terms?</h2>

          <p className="mt-3 text-sm leading-7 text-gray-300">
            If you need clarification about using StudioSpace, please contact
            the platform team through the available support channels.
          </p>

          <Link
            href="/studios"
            className="mt-6 inline-flex items-center rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
          >
            Explore Studios
          </Link>
        </div>
      </div>
    </main>
  );
}
