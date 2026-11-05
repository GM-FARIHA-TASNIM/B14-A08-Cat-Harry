import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
        <h1 className="text-2xl font-bold">Forgot Password?</h1>

        <p className="mt-4 text-sm leading-7 text-gray-500">
          Password recovery is currently unavailable. Please contact the
          StudioSpace support team for assistance.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-bold text-white"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}
