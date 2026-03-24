export default function SubscribePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 bg-black relative noise-bg">
      <div className="relative z-10 max-w-md w-full text-center">
        <h1 className="headline text-section text-brand-400 mb-4">
          Get Exclusive Content
        </h1>
        <p className="font-body text-sm tracking-[0.15em] uppercase text-white/40 mb-12">
          Join the community for early access to new music, behind-the-scenes
          content, and exclusive drops.
        </p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL ADDRESS"
            className="w-full px-6 py-4 bg-transparent border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.15em] uppercase transition-colors"
            required
          />
          <input
            type="tel"
            placeholder="PHONE (OPTIONAL)"
            className="w-full px-6 py-4 bg-transparent border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.15em] uppercase transition-colors"
          />
          <button
            type="submit"
            className="w-full px-8 py-4 bg-accent text-white font-body text-sm tracking-[0.2em] uppercase font-bold hover:bg-accent-light transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </main>
  );
}
