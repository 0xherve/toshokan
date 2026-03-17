import { Link } from "@tanstack/react-router";

export function AboutPage() {
  return (
    <main>
      <div className="max-w-4xl mx-auto px-5 md:px-10 pt-24 md:pt-36 pb-24 animate-[fadeIn_0.3s_ease]">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-5">
            About Toshokan
          </h1>
          <p className="font-display text-lg text-foreground-muted tracking-[0.04em]">
            図書館 — a tasteful light novel reader
          </p>
        </div>
  
        <div className="max-w-3xl mx-auto font-reading text-[1.0625rem] leading-[1.8] text-foreground-soft">
          <p className="mb-6">
            Toshokan is for reading light novels. 
            You get a growing library of novels, and some additional features to enhance your reading like bookmarking, reading progress, and easy navigation.
          </p>
          <p className="mb-6">
          The purpose is to have a cool place to read, and everything else is extra.
          The UI gets out of the way of the reading experience, and doesn't feel like 20th century design.
          </p>
          <p className="mb-6">
            Toshokan is a Progressive Web App so you can install it on your phone, tablet, or laptop.
            Chapters cache locally for offline reading. There are no ads, no
            algorithms, no feeds. Just books.
          </p>
          <p className="text-foreground-muted">
            Toshokan is free, and open-source. If you want other features, you can either open an issue on GitHub and I'll look at it, 
            or fork it and maintain your own version.
          </p>
        </div>
      </div>

      <section className="pb-6 max-w-5xl mx-auto mb-24">
        <div className="flex flex-col items-center justify-center bg-surface rounded-2xl border border-border shadow-md px-6 py-8 md:px-12 md:py-14 text-center">
          <h2 className="font-display text-[2rem] font-bold tracking-tight mb-3">
            Join the club
          </h2>
          <p className="font-reading text-base text-foreground-muted mx-auto mb-7">
            Create an account and start reading the right way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth/signup"
              className="cta-primary font-ui text-[0.9375rem] font-semibold px-8 py-3.5 rounded-lg border-none bg-accent text-white tracking-wide"
            >
              Create Account
            </Link>
            <Link
              to="/library"
              className="cta-secondary font-ui text-[0.9375rem] font-medium px-8 py-3.5 rounded-lg bg-transparent text-foreground border-[1.5px] border-border tracking-wide"
            >
              Browse Library
            </Link>
          </div>
        </div>
      </section>
          
    </main>
  );
}
