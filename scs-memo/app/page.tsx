import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Memo Bot
          </h1>
          <p className="text-xl text-gray-400">
            Your intelligent helper, right where you need it.
          </p>
        </div>

        <div className="border-t border-gray-800 pt-8 space-y-4">
          <h2 className="text-2xl font-semibold">
            Choose Your Path
          </h2>
          <nav className="space-y-3">
            <Link
              href="/personal"
              className="block px-6 py-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
            >
              <div className="font-medium">Personal Offer</div>
              <div className="text-sm text-gray-500">
                See how memo helps individuals
              </div>
            </Link>

            <Link
              href="/business"
              className="block px-6 py-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
            >
              <div className="font-medium">Business Offer</div>
              <div className="text-sm text-gray-500">
                Transform your organization with memo
              </div>
            </Link>

            <Link
              href="/support"
              className="block px-6 py-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
            >
              <div className="font-medium">Support & Chatbot</div>
              <div className="text-sm text-gray-500">
                Get help from memo, anytime
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
