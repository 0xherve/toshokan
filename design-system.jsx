import { useState } from "react";

// ─── CSS VARIABLES APPROACH ─────────────────────────────────────────────────
// All colors are semantic. Components use var(--background), var(--foreground), etc.
// The theme class on :root swaps the actual values. No color logic in components.

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root, .light {
  --background:       #F7F4F0;
  --surface:          #EFEBE5;
  --elevated:         #E6E1D9;
  --reading:          #FAF8F5;
  --foreground:       #1A1614;
  --foreground-soft:  #4A4540;
  --foreground-muted: #8A8580;
  --accent:           #C45D3E;
  --accent-soft:      #D4856E;
  --border:           #DDD8D0;
  --success:          #4A7A5B;
  --warning:          #B8860B;
  --shadow-sm: 0 1px 3px rgba(26,22,20,0.06), 0 1px 2px rgba(26,22,20,0.04);
  --shadow-md: 0 4px 12px rgba(26,22,20,0.08), 0 2px 4px rgba(26,22,20,0.04);
  --shadow-lg: 0 12px 32px rgba(26,22,20,0.10), 0 4px 8px rgba(26,22,20,0.04);
}

.dark {
  --background:       #141210;
  --surface:          #1E1B18;
  --elevated:         #282420;
  --reading:          #1A1816;
  --foreground:       #E8E4DF;
  --foreground-soft:  #B0AAA2;
  --foreground-muted: #706B65;
  --accent:           #E07050;
  --accent-soft:      #C45D3E;
  --border:           #2E2A26;
  --success:          #5C9A6E;
  --warning:          #D4A030;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.16);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.16);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.36), 0 4px 8px rgba(0,0,0,0.16);
}

body { background: var(--background); }
::selection { background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); }
`;

// ─── TOKEN DEFINITIONS (for docs / showcase only) ───────────────────────────
const semanticTokens = [
  { token: "--background",       light: "#F7F4F0", dark: "#141210", desc: "Page background" },
  { token: "--surface",          light: "#EFEBE5", dark: "#1E1B18", desc: "Cards, panels, sidebars" },
  { token: "--elevated",         light: "#E6E1D9", dark: "#282420", desc: "Raised elements, input fills" },
  { token: "--reading",          light: "#FAF8F5", dark: "#1A1816", desc: "Reading surface — optimized for long sessions" },
  { token: "--foreground",       light: "#1A1614", dark: "#E8E4DF", desc: "Primary text" },
  { token: "--foreground-soft",  light: "#4A4540", dark: "#B0AAA2", desc: "Secondary text, descriptions" },
  { token: "--foreground-muted", light: "#8A8580", dark: "#706B65", desc: "Tertiary text, placeholders" },
  { token: "--accent",           light: "#C45D3E", dark: "#E07050", desc: "Primary accent — CTAs, progress, bookmarks" },
  { token: "--accent-soft",      light: "#D4856E", dark: "#C45D3E", desc: "Hover states, soft highlights" },
  { token: "--border",           light: "#DDD8D0", dark: "#2E2A26", desc: "Dividers, outlines" },
  { token: "--success",          light: "#4A7A5B", dark: "#5C9A6E", desc: "Completed, progress fills" },
  { token: "--warning",          light: "#B8860B", dark: "#D4A030", desc: "Alerts, attention" },
];

const typography = {
  display: { family: "'Shippori Mincho', serif",  desc: "Titles, chapter headings, branding. Japanese-inflected serif — the literary voice." },
  body:    { family: "'Public Sans', sans-serif",  desc: "Reading body text. Neutral, highly legible, recedes behind content." },
  ui:      { family: "'DM Sans', sans-serif",      desc: "Interface chrome — buttons, labels, nav, metadata. Tighter than Public Sans." },
};

const typeScale = [
  { step: "3xs",  rem: "0.625rem",  use: "Micro labels, badges" },
  { step: "2xs",  rem: "0.6875rem", use: "Captions, timestamps" },
  { step: "xs",   rem: "0.75rem",   use: "Small UI text, metadata" },
  { step: "sm",   rem: "0.875rem",  use: "Secondary body, nav items" },
  { step: "base", rem: "1rem",      use: "Default UI text" },
  { step: "lg",   rem: "1.125rem",  use: "Reading body (default)" },
  { step: "xl",   rem: "1.25rem",   use: "Reading body (large)" },
  { step: "2xl",  rem: "1.5rem",    use: "Section headings" },
  { step: "3xl",  rem: "1.875rem",  use: "Chapter titles" },
  { step: "4xl",  rem: "2.25rem",   use: "Book titles" },
  { step: "5xl",  rem: "3rem",      use: "Hero display" },
];

const radii = [
  { name: "none", value: "0px" },
  { name: "sm",   value: "4px" },
  { name: "md",   value: "8px" },
  { name: "lg",   value: "12px" },
  { name: "xl",   value: "16px" },
  { name: "full", value: "9999px" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const v = (name) => `var(--${name})`;

function Swatch({ token, light, dark, desc }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{
        width: 48, height: 48, borderRadius: 8, backgroundColor: v(token.replace("--", "")),
        border: `1px solid ${v("border")}`, flexShrink: 0,
      }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: typography.ui.family, fontSize: "0.8125rem", fontWeight: 600, color: v("foreground") }}>
          {token} <span style={{ fontWeight: 400, color: v("foreground-muted"), fontFamily: "monospace", fontSize: "0.6875rem" }}>{light} → {dark}</span>
        </div>
        <div style={{ fontFamily: typography.ui.family, fontSize: "0.75rem", color: v("foreground-muted") }}>{desc}</div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{
        fontFamily: typography.ui.family, fontSize: "0.6875rem", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.12em", color: v("accent"),
        marginBottom: 8,
      }}>{title}</div>
      <div style={{ width: 32, height: 2, backgroundColor: v("accent"), marginBottom: 24, borderRadius: 1, opacity: 0.5 }} />
      {children}
    </section>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function ToshokanDesignSystem() {
  const [theme, setTheme] = useState("light");

  return (
    <>
      <style>{STYLES}</style>

      <div className={theme} style={{
        minHeight: "100vh", backgroundColor: v("background"), color: v("foreground"),
        transition: "background-color 0.4s ease, color 0.4s ease",
        fontFamily: typography.ui.family,
      }}>
        {/* ─── HEADER ──────────────────────────────────────── */}
        <header style={{
          padding: "48px 32px 40px", maxWidth: 960, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontFamily: typography.display.family, fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Toshokan
            </div>
            <div style={{ fontFamily: typography.display.family, fontSize: "0.9375rem", fontWeight: 400, color: v("foreground-muted"), marginTop: 6, letterSpacing: "0.04em" }}>
              図書館 — Design System v1.0
            </div>
          </div>
          <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")} style={{
            fontFamily: typography.ui.family, fontSize: "0.75rem", fontWeight: 500,
            padding: "8px 16px", borderRadius: 8,
            backgroundColor: v("elevated"), color: v("foreground-soft"),
            border: `1px solid ${v("border")}`, cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
            {theme === "light" ? "● Dark" : "○ Light"}
          </button>
        </header>

        <main style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px 80px" }}>

          {/* ─── BRAND CONCEPT ─────────────────────────────── */}
          <Section title="Brand Concept">
            <div style={{
              backgroundColor: v("reading"), borderRadius: 12, padding: "32px 36px",
              border: `1px solid ${v("border")}`, boxShadow: v("shadow-sm"),
              fontFamily: typography.body.family, fontSize: "1.0625rem",
              lineHeight: 1.75, color: v("foreground-soft"),
            }}>
              <p style={{ marginBottom: "1.25em" }}>
                <strong style={{ color: v("foreground") }}>Toshokan is a quiet room with good light.</strong> The design
                draws from Japanese paper culture — warm textures, ink tones, and deliberate
                negative space. Every decision serves one principle:
                <span style={{ color: v("accent"), fontWeight: 500 }}> the words come first.</span>
              </p>
              <p style={{ marginBottom: "1.25em" }}>
                All colors are defined as CSS custom properties with semantic names — <code style={{ fontSize: "0.9em", color: v("accent") }}>--background</code>,
                <code style={{ fontSize: "0.9em", color: v("accent") }}> --foreground</code>,
                <code style={{ fontSize: "0.9em", color: v("accent") }}> --accent</code> — so components never reference a theme directly.
                Swap the class on the root element and the entire app adapts. The palette stays warm in both modes to reduce eye fatigue.
              </p>
              <p>
                Three type families divide cleanly: <em>Shippori Mincho</em> for literary display,
                <em> Public Sans</em> for reading, and <em>DM Sans</em> for UI chrome.
                The reader never competes with the text.
              </p>
            </div>
          </Section>

          {/* ─── COLORS ───────────────────────────────────── */}
          <Section title="Color Tokens — Semantic CSS Variables">
            <div style={{
              fontFamily: typography.ui.family, fontSize: "0.8125rem", color: v("foreground-soft"),
              marginBottom: 20, lineHeight: 1.6, maxWidth: 620,
            }}>
              Components use <code style={{ color: v("accent"), fontSize: "0.85em" }}>var(--foreground)</code>, <code style={{ color: v("accent"), fontSize: "0.85em" }}>var(--accent)</code>, etc.
              The theme class on the root swaps values. No conditionals in component code.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("foreground-muted"), marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Surfaces</div>
                {semanticTokens.filter(t => ["--background","--surface","--elevated","--reading"].includes(t.token)).map(t => (
                  <Swatch key={t.token} {...t} />
                ))}
              </div>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("foreground-muted"), marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Text & Accent</div>
                {semanticTokens.filter(t => ["--foreground","--foreground-soft","--foreground-muted","--accent","--accent-soft"].includes(t.token)).map(t => (
                  <Swatch key={t.token} {...t} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("foreground-muted"), marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Semantic</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 40px" }}>
                {semanticTokens.filter(t => ["--border","--success","--warning"].includes(t.token)).map(t => (
                  <Swatch key={t.token} {...t} />
                ))}
              </div>
            </div>
          </Section>

          {/* ─── TYPOGRAPHY ────────────────────────────────── */}
          <Section title="Typography">
            {[
              { key: "display", label: "Display — Shippori Mincho", sample: "The Irregular at Magic High School", weight: 700, size: "2rem" },
              { key: "body",    label: "Reading — Public Sans",      sample: "She looked out at the endless sky beyond the city walls, wondering if the world she'd left behind still remembered her name. The wind carried no answer — only the faint scent of something forgotten.", weight: 400, size: "1.125rem" },
              { key: "ui",      label: "Interface — DM Sans",        sample: "Chapter 14 · 2,847 words · 12 min read", weight: 500, size: "0.875rem" },
            ].map(t => (
              <div key={t.key} style={{
                marginBottom: 32, padding: "24px 28px", borderRadius: 10,
                backgroundColor: t.key === "body" ? v("reading") : v("surface"),
                border: `1px solid ${v("border")}`,
              }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("accent"), marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: typography.ui.family }}>
                  {t.label}
                </div>
                <div style={{
                  fontFamily: typography[t.key].family, fontSize: t.size, fontWeight: t.weight,
                  lineHeight: t.key === "body" ? 1.8 : 1.3, color: v("foreground"),
                  letterSpacing: t.key === "body" ? "0.01em" : t.key === "display" ? "-0.01em" : "0",
                }}>
                  {t.sample}
                </div>
                <div style={{ fontFamily: typography.ui.family, fontSize: "0.75rem", color: v("foreground-muted"), marginTop: 10 }}>
                  {typography[t.key].desc}
                </div>
              </div>
            ))}
          </Section>

          {/* ─── TYPE SCALE ────────────────────────────────── */}
          <Section title="Type Scale">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {typeScale.map(s => (
                <div key={s.step} style={{ display: "flex", alignItems: "baseline", gap: 16, padding: "6px 0", borderBottom: `1px solid color-mix(in srgb, ${v("border")} 40%, transparent)` }}>
                  <code style={{ fontFamily: "monospace", fontSize: "0.6875rem", color: v("accent"), width: 36, flexShrink: 0 }}>{s.step}</code>
                  <span style={{ fontFamily: typography.body.family, fontSize: s.rem, color: v("foreground"), flex: 1, lineHeight: 1.4 }}>Toshokan</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.6875rem", color: v("foreground-muted"), width: 90, textAlign: "right" }}>{s.rem}</span>
                  <span style={{ fontFamily: typography.ui.family, fontSize: "0.6875rem", color: v("foreground-muted"), width: 160, textAlign: "right" }}>{s.use}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── SPACING & RADIUS ──────────────────────────── */}
          <Section title="Spacing & Radius">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("foreground-muted"), marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  4px base unit · spacing-{`{n}`} = n × 4px
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
                  {[1,2,3,4,6,8,12,16,24].map(n => (
                    <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: n*4, height: n*4, backgroundColor: v("accent"), borderRadius: 3, opacity: 0.7, minWidth: 4, minHeight: 4 }} />
                      <code style={{ fontFamily: "monospace", fontSize: "0.625rem", color: v("foreground-muted") }}>{n}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("foreground-muted"), marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>Border Radius</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {radii.map(r => (
                    <div key={r.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 44, height: 44, backgroundColor: v("accent"), borderRadius: r.value, opacity: 0.6 }} />
                      <code style={{ fontFamily: "monospace", fontSize: "0.625rem", color: v("foreground-muted") }}>{r.name}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ─── SHADOWS ───────────────────────────────────── */}
          <Section title="Elevation / Shadows">
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["sm", "md", "lg"].map(size => (
                <div key={size} style={{
                  width: 140, height: 100, backgroundColor: v("surface"),
                  borderRadius: 12, boxShadow: `var(--shadow-${size})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${v("border")}`,
                }}>
                  <code style={{ fontFamily: "monospace", fontSize: "0.75rem", color: v("foreground-muted") }}>--shadow-{size}</code>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── READING SURFACE ───────────────────────────── */}
          <Section title="Reading Surface">
            <div style={{
              backgroundColor: v("reading"), borderRadius: 12,
              padding: "48px 0", border: `1px solid ${v("border")}`,
              boxShadow: "var(--shadow-md)",
            }}>
              <div style={{
                maxWidth: "42rem", margin: "0 auto", padding: "0 32px",
                fontFamily: typography.body.family, fontSize: "1.125rem",
                lineHeight: 1.8, color: v("foreground"), letterSpacing: "0.01em",
              }}>
                <div style={{
                  fontFamily: typography.display.family, fontSize: "1.75rem", fontWeight: 600,
                  marginBottom: 6, letterSpacing: "-0.01em",
                }}>
                  Chapter 3: The Tower of Falling Stars
                </div>
                <div style={{
                  fontFamily: typography.ui.family, fontSize: "0.8125rem", color: v("foreground-muted"),
                  marginBottom: 32, paddingBottom: 24,
                  borderBottom: `1px solid ${v("border")}`,
                }}>
                  Vol. 2 · 3,142 words · ~13 min
                </div>
                <p style={{ marginBottom: "1.5em", textIndent: "1.5em" }}>
                  The observation deck was empty at this hour. Miyuki pressed her fingertips against the cold glass and watched the city lights blur in the rain — ten thousand small fires scattered across the dark. Somewhere below, the automated transit hummed its midnight routes, carrying the last passengers home.
                </p>
                <p style={{ marginBottom: "1.5em", textIndent: "1.5em" }}>
                  "You shouldn't be up here alone," said a voice from the doorway. She didn't turn. She already knew who it was — the only other person in this building who couldn't sleep, who understood that some silences were not empty but full, brimming with the weight of things left unsaid.
                </p>
                <p style={{ textIndent: "1.5em", color: v("foreground-soft") }}>
                  He crossed the room slowly, his reflection assembling itself in the glass beside hers. For a long moment neither of them spoke. The rain drew lines across the window like handwriting in a language they were still learning to read.
                </p>
                <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 3, backgroundColor: v("elevated"), borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: "34%", height: "100%", backgroundColor: v("accent"), borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: typography.ui.family, fontSize: "0.6875rem", color: v("foreground-muted") }}>34%</span>
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 16, fontFamily: typography.ui.family, fontSize: "0.75rem", color: v("foreground-muted"),
              display: "flex", gap: 24,
            }}>
              <span>max-width: 42rem</span>
              <span>line-height: 1.8</span>
              <span>paragraph gap: 1.5em</span>
            </div>
          </Section>

          {/* ─── COMPONENT PATTERNS ────────────────────────── */}
          <Section title="Component Patterns">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Book Card */}
              <div style={{
                backgroundColor: v("surface"), borderRadius: 12, overflow: "hidden",
                border: `1px solid ${v("border")}`, boxShadow: "var(--shadow-sm)",
              }}>
                <div style={{ padding: "16px 20px 8px", fontSize: "0.6875rem", fontWeight: 600, color: v("accent"), textTransform: "uppercase", letterSpacing: "0.1em" }}>Book Card</div>
                <div style={{ padding: "8px 20px 20px", display: "flex", gap: 16 }}>
                  <div style={{
                    width: 72, height: 104, borderRadius: 6, flexShrink: 0,
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 5%, transparent))`,
                    border: `1px solid ${v("border")}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: typography.display.family, fontSize: "1.5rem", color: v("accent"), opacity: 0.5,
                  }}>書</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: typography.display.family, fontSize: "1rem", fontWeight: 600, color: v("foreground"), marginBottom: 4, lineHeight: 1.3 }}>
                      Sword Art Online
                    </div>
                    <div style={{ fontFamily: typography.ui.family, fontSize: "0.75rem", color: v("foreground-muted"), marginBottom: 10 }}>
                      Reki Kawahara · Vol. 1–25
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 3, backgroundColor: v("elevated"), borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: "68%", height: "100%", backgroundColor: v("success"), borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: typography.ui.family, fontSize: "0.6875rem", color: v("foreground-muted") }}>68%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{
                backgroundColor: v("surface"), borderRadius: 12,
                border: `1px solid ${v("border")}`, boxShadow: "var(--shadow-sm)", padding: 20,
              }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("accent"), textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Buttons</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button style={{
                    fontFamily: typography.ui.family, fontSize: "0.8125rem", fontWeight: 600,
                    padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                    backgroundColor: v("accent"), color: "#fff", letterSpacing: "0.02em",
                  }}>Continue Reading</button>
                  <button style={{
                    fontFamily: typography.ui.family, fontSize: "0.8125rem", fontWeight: 500,
                    padding: "10px 20px", borderRadius: 8, cursor: "pointer",
                    backgroundColor: "transparent", color: v("foreground"),
                    border: `1.5px solid ${v("border")}`, letterSpacing: "0.02em",
                  }}>Add to Library</button>
                  <button style={{
                    fontFamily: typography.ui.family, fontSize: "0.75rem", fontWeight: 500,
                    padding: "8px 16px", borderRadius: 6, cursor: "pointer",
                    backgroundColor: "transparent", color: v("foreground-muted"),
                    border: "none", letterSpacing: "0.02em",
                  }}>Mark as Read ✓</button>
                </div>
              </div>

              {/* Tags */}
              <div style={{
                backgroundColor: v("surface"), borderRadius: 12,
                border: `1px solid ${v("border")}`, boxShadow: "var(--shadow-sm)", padding: 20,
              }}>
                <div style={{ ftSize: "0.6875rem", fontWeight: 600, color: v("accent"), textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Tags & Chips</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Fantasy", "Romance", "Isekai", "Completed", "★ 4.7"].map(tag => (
                    <span key={tag} style={{
                      fontFamily: typography.ui.family, fontSize: "0.6875rem", fontWeight: 500,
                      padding: "5px 12px", borderRadius: 9,
                      backgroundColor: tag.startsWith("★")
                        ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                        : v("elevated"),
                      color: tag.startsWith("★") ? v("accent") : v("foreground-soft"),
                      border: `1px solid ${tag.startsWith("★")
                        ? "color-mix(in srgb, var(--accent) 25%, transparent)"
                        : v("border")}`,
                    }}>{tag}</span>
                  )             </div>
              </div>

              {/* Navigation */}
              <div style={{
                backgroundColor: v("surface"), borderRadius: 12,
                border: `1px solid ${v("border")}`, boxShadow: "var(--shadow-sm)", padding: 20,
              }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: v("accent"), textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Navigation</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { icon: "📚", label: "Library", active: true },
                    { icon: "🔍", label: "Browse", active: false },
                    { icon: "📖", label: "Reading", active: false },
                    { icon: "⚙", label: "Settings", active: false },
                  ].map(n => (
                    <div key={n.label} style={{
                      flex: 1, padding: "10px 8px", borderRadius: 8, textAlign: "center",
                      backgroundCactive ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                      cursor: "pointer",
                    }}>
                      <div style={{ fontSize: "1.1rem", marginBottom: 2 }}>{n.icon}</div>
                      <div style={{
                        fontFamily: typography.ui.family, fontSize: "0.625rem", fontWeight: n.active ? 600 : 400,
                        color: n.active ? v("accent") : v("foreground-muted"),
                      }}>{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ─── USAGE EXAMPLE ─────────────────────────────── */}
          <Section title="Usage in Components">
            <div style={{
              backgroundColor: theme === "light" ? "#1A1614" : "#0E0D0B", borderRadius: 12,
              padding: "24px 28px", overflow: "auto",
              border: `1px sol{theme === "light" ? "#2E2A26" : "#1E1B18"}`,
            }}>
              <pre style={{
                fontFamily: "'DM Mono', 'SF Mono', 'Fira Code', monospace", fontSize: "0.75rem",
                lineHeight: 1.7, color: "#E8E4DF", whiteSpace: "pre", overflowX: "auto",
              }}>{`<!-- Components are theme-agnostic. Just use the semantic classes. -->

<div class="bg-background text-foreground">
  <h1 class="font-display text-4xl">Book Title</h1>
  <p class="font-reading text-lg text-foreground-soft">Description...</p>
  <span class="font-ui text-xs text-foreground-muted">12 chapters</span>
  <button class="bg-accent text-white rounded-lg">Read Now</button>
  <div class="bg-surface border border-border rounded-xl shadow-sm">
    Card content...
  </div>
</div>

<!-- Theme is controlled at the root. Components never know. -->
<html class="dark"> <!-- or "light", or omit for default light -->
  ...
</html>`}</pre>
            </div>
          </Section>

          {/* ─── TAILWIND CONFIG ─â────────────────── */}
          <Section title="Tailwind Config">
            <div style={{
              backgroundColor: theme === "light" ? "#1A1614" : "#0E0D0B", borderRadius: 12,
              padding: "24px 28px", overflow: "auto",
              border: `1px solid ${theme === "light" ? "#2E2A26" : "#1E1B18"}`,
            }}>
              <pre style={{
                fontFamily: "'DM Mono', 'SF Mono', 'Fira Code', monospace", fontSize: "0.75rem",
             eHeight: 1.7, color: "#E8E4DF", whiteSpace: "pre", overflowX: "auto",
              }}>{`/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Shippori Mincho", "serif"],
        reading: ["Public Sans", "system-ui", "sans-serif"],
        ui:      ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        background:       "var(--background)",
        surface:          "var(--surface)",
        elevated:         "var(--elevated)",
        reading:          "var(--reading)",
        foreground: {
          DEFAULT:        "var(--foreground)",
          soft:           "var(--foreground-soft)",
          muted:          "var(--foreground-muted)",
        },
        accent: {
          DEFAULT:        "var(--accent)",
          soft:           "var(--accent-soft)",
        },
        border:           "var(--border)",
        success:          "var(--success)",
        warning:          "var(--warning)",
      },
      fontSize: {
        "3xs":  ["0.625rem",  { lineHeight: "1rem"     }],
        "2xs":  ["0.6875rem", { lineHeight: "1rem"     }],
        "xs":   ["0.75rem",   { lineHeight: "1.125rem" }],
        "sm":   ["0.875rem",  { lineHeight: "1.375rem" }],
        "base": ["1rem",      { lineHeight: "1.5rem"   }],
        "lg":   ["1.125rem",  { lineHeight: "1.75rem"  }],
        "xl":   ["1.25rem",   { lineHeight: "1.875rem" }],
        "2xl":  ["1.5rem",    { lineHeight: "2rem"     }],
        "3xl":  ["1.875rem",  { lineHeight: "2.375rem" }],
        "4xl":  ["2.25rem",   { lineHeight: "2.75rem"  }],
        "5xl":  ["3rem",      { lineHeight: "1.15"     }],
      },
      maxWidth: {
        reading: "42rem",
      },
      lineHeight: {
        reading: "1.8",
      },
      letterSpacing: {
        reading: "0.01em",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
}`}</pre>
            </div>
          </Section>

          {/* ─── CSS VARIABLES ──────────────────────────────── */}
          <Section title="CSS Variables (copy to global stylesheet)">
            <div style={{
              backgroundColor: theme === "light" ? "#1A1614" : "#0E0D0B", borderRadius: 12,
              padding: "24px 28px", overflow: "auto",
           der: `1px solid ${theme === "light" ? "#2E2A26" : "#1E1B18"}`,
            }}>
              <pre style={{
                fontFamily: "'DM Mono', 'SF Mono', 'Fira Code', monospace", fontSize: "0.75rem",
                lineHeight: 1.7, color: "#E8E4DF", whiteSpace: "pre", overflowX: "auto",
              }}>{`:root, .light {
  --background:       #F7F4F0;
  --surface:          #EFEBE5;
  --elevated:         #E6E1D9;
  --reading:          #FAF8F5;
  --foreground:       #1A1614;
  --foreground-soft:  #4A4540;
  --foreground-muted: #8A8580;
  --accent:           #C45D3E;
  --accent-soft:      #D4856E;
  --border:           #DDD8D0;
  --success:          #4A7A5B;
  --warning:          #B8860B;
  --shadow-sm: 0 1px 3px rgba(26,22,20,0.06), 0 1px 2px rgba(26,22,20,0.04);
  --shadow-md: 0 4px 12px rgba(26,22,20,0.08), 0 2px 4px rgba(26,22,20,0.04);
  --shadow-lg: 0 12px 32px rgba(26,22,20,0.10), 0 4px 8px rgba(26,22,20,0.04);
}

.dark {
  --background:       #141210;
  --surface:          #1E1B18;
  --elevated:         #282420;
  --reading:          #1A1816;
  --foreground:       #E8E4DF;
  --foreground-soft:  #B0AAA2;
  --foreground-muted: #706B65;
  --accent:           #E07050;
  --accent-soft:      #C45D3E;
  --border:           #2E2A26;
  --success:          #5C9A6E;
  --warning:          #D4A030;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.16);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.16);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.36), 0 4px 8px rgba(0,0,0,0.16);
}`}</pre>
            </div>
          </Section>

          {/* ─── DESIGN PRINCIPLES ──────────────────────────── */}
          <Section title="Design Principles">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { num: "01", title: "Content Supremacy", desc: "The reading surface owns the viewport. UI chrome fades on scroll, reappears on intent. No element competes with the tex         { num: "02", title: "Warm Restraint", desc: "Every color stays warm. Pure white and pure black are banned. Eye fatigue is a design failure." },
                { num: "03", title: "Meaningful Color", desc: "Accent is reserved for user-significant moments: current position, bookmarks, unread counts. Decorative color is noise." },
                { num: "04", title: "Quiet Motion", desc: "Transitions are 150–300ms ease. Page turns feel physical. Loading states are subtle pulses, never spinners. Notng jumps." },
              ].map(p => (
                <div key={p.num} style={{
                  padding: "20px 24px", borderRadius: 10,
                  backgroundColor: v("surface"), border: `1px solid ${v("border")}`,
                }}>
                  <div style={{ fontFamily: typography.display.family, fontSize: "1.75rem", fontWeight: 300, color: v("accent"), opacity: 0.4, marginBottom: 8 }}>{p.num}</div>
                  <div style={{ fontFamily: typography.ui.family, fontSize: "0.875rem", fontWeight: 600, color: v("foreground"), marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontFamily: typography.ui.family, fontSize: "0.8125rem", color: v("foreground-muted"), lineHeight: 1.6 }}>{p.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* ─── FOOTER ────────────────────────────────────── */}
          <div style={{
            textAlign: "cente, paddingTop: 40, borderTop: `1px solid ${v("border")}`,
            fontFamily: typography.display.family, fontSize: "0.875rem", color: v("foreground-muted"),
          }}>
            図書館 · Toshokan Design System · v1.0
          </div>

        </main>
      </div>
    </>
  );
} 
