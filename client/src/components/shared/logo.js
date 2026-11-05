import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="StudioSpace Home"
      className="flex shrink-0 items-center gap-2"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
        <Aperture size={25} />
      </span>

      <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Studio<span className="text-violet-600">Space</span>
      </span>
    </Link>
  );
}
