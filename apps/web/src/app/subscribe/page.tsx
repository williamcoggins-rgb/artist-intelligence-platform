export default function SubscribePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Get Exclusive Content
        </h1>
        <p className="text-gray-400 text-center">
          Join the community for early access to new music, behind-the-scenes
          content, and exclusive drops.
        </p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            required
          />
          <input
            type="tel"
            placeholder="Phone number (optional)"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>
    </main>
  );
}
