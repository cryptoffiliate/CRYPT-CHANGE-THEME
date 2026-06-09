import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed — Cryptoffiliate",
  robots: { index: false },
};

export default function UnsubscribedPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const success = searchParams.status !== "error";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="text-4xl mb-4">{success ? "👋" : "⚠️"}</div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          {success ? "You've been unsubscribed" : "Something went wrong"}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          {success
            ? "You won't receive any more bonus alerts from us. No hard feelings — you can re-subscribe any time on the alerts page."
            : "We couldn't process your unsubscribe request. Please try again or contact us."}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-outline text-sm px-4 py-2">
            Back to home
          </Link>
          {success && (
            <Link href="/alerts" className="btn-primary text-sm px-4 py-2">
              Re-subscribe
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
