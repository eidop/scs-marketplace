import MemoBot from "@/components/MemoBot";

export default function PersonalPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Memo for Individuals
          </h1>
          <p className="text-xl text-gray-400">
            Your personal assistant, always within reach.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Text */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Text Chat</h2>
            <p className="text-gray-400">
              Get instant answers, write drafts, organize thoughts — all with natural conversation.
            </p>
            <MemoBot mode="text" />
          </div>

          {/* Audio */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Voice Support</h2>
            <p className="text-gray-400">
              Talk naturally. Memo listens and responds with clear, professional voice output.
            </p>
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
              <p className="text-gray-500 text-center">
                Audio component ready — configure TTS/STT
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Visual Communication</h2>
            <p className="text-gray-400">
              Share screenshots, diagrams, or images. Memo understands and responds visually.
            </p>
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
              <p className="text-gray-500 text-center">
                Image upload and processing ready
              </p>
            </div>
          </div>

          {/* Config */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Personalized</h2>
            <p className="text-gray-400">
              Adjust memo to your needs. Set preferences, behavior, and tone.
            </p>
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/50">
              <p className="text-gray-500 text-center">
                Configuration panel ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
