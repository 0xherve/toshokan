import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

const SPINE_LINES = Array.from({ length: 16 }, (_, i) => ({
  left: `${6 + i * 5.8}%`,
  duration: `${8 + (i % 5) * 1.4}s`,
  delay: `${(i * 1.3) % 7}s`,
}));

export function LandingPage() {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-background text-foreground font-ui overflow-x-hidden">
      <section className="relative mt-14 h-[calc(100dvh-3.5rem)] px-5 md:px-10 max-w-[1120px] mx-auto flex items-center justify-center text-center overflow-hidden">
        {/* Tategaki ruled lines */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {SPINE_LINES.map((line, i) => (
            <div
              key={i}
              className="absolute top-[8%] h-[84%] w-px bg-border rounded-sm opacity-0"
              style={{
                left: line.left,
                animation: `spineFade ${line.duration} ease-in-out ${line.delay} infinite`,
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="flex flex-col items-center justify-center z-10">
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.1s",
            }}
          >
            <div className="font-ui text-xs font-semibold text-accent tracking-[0.12em] uppercase mb-5">
              Just for reading
            </div>
            <h1 className="font-display text-[2rem] sm:text-[2.75rem] md:text-[3.75rem] font-bold leading-[1.1] tracking-tight mb-6">
              A Quite Room <br /> with a Good book
            </h1>
          </div>

          <div
            className="transition-all duration-600 ease-out"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "0.3s",
            }}
          >
            <p className="font-reading text-md leading-relaxed text-foreground-soft max-w-[320px] sm:max-w-[520px] mb-10">
              Toshokan is an opinionated light novel reader that is intentionally minimal to get out of the way of the reader. 
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-3 items-center justify-center transition-all duration-600 ease-out"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0)" : "translateY(12px)",
              transitionDelay: "0.5s",
            }}
          >
            <Link
              to="/library"
              className="cta-primary font-ui text-[0.9375rem] font-semibold px-8 py-3.5 rounded-lg border-none bg-accent text-white tracking-wide"
            >
              Start Reading
            </Link>
            <Link
              to="/about"
              className="cta-secondary font-ui text-[0.9375rem] font-medium px-8 py-3.5 rounded-lg bg-transparent text-foreground border-[1.5px] border-border tracking-wide"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
