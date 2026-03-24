import { SubscribeForm } from "@/components/SubscribeForm";

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
        <SubscribeForm />
      </div>
    </main>
  );
}
