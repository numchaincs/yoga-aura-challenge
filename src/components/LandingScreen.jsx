import React from "react";
/**
 * ============================================================
 *  🌿  LandingScreen.jsx
 *
 *  The first screen users see. Viral hook in 3 elements:
 *    1. Bold challenge name + animated tagline
 *    2. How-to-play (3 steps, emoji-led, scannable)
 *    3. Pulsing CTA button
 *
 *  Design: Midnight indigo bg, jade glow accents, coral CTA.
 *  Font: "Space Grotesk" display + body weights.
 * ============================================================
 */

import SpiritAnimal from "./SpiritAnimal";

export default function LandingScreen({ onStart }) {
  return (
    <div className="landing-screen">

      {/* ── Animated background particles (CSS-only) ── */}
      <div className="particle-field" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="particle" style={{
            "--delay": `${(i * 0.37).toFixed(2)}s`,
            "--x":     `${(i * 37 + 10) % 95}%`,
            "--size":  `${4 + (i % 6)}px`,
          }} />
        ))}
      </div>

      {/* ── Hero section ── */}
      <header className="landing-hero">
        {/* Floating spirit animal teaser */}
        <div className="landing-animal-wrap">
          <SpiritAnimal animal="fox" animate={true} size={160} />
          {/* Tooltip hinting at the reveal mechanic */}
          <span className="animal-tease">Your spirit animal awaits…</span>
        </div>

        <h1 className="landing-title">
          <span className="title-line1">10-SECOND</span>
          <span className="title-line2">BALANCE<br />CHALLENGE</span>
        </h1>

        <p className="landing-tagline">
          Stand still. Hold your breath. Discover your inner zen.
        </p>
      </header>

      {/* ── How to play ── */}
      <section className="how-to-play">
        <h2 className="how-to-title">HOW IT WORKS</h2>
        <ol className="steps-list">
          {[
            { icon: "📷", text: "Allow camera access" },
            { icon: "🧘", text: "Strike a pose & hold for 10 seconds" },
            { icon: "🦊", text: "Reveal your Yoga Spirit Animal!" },
          ].map(({ icon, text }, i) => (
            <li key={i} className="step-item">
              <span className="step-icon">{icon}</span>
              <span className="step-text">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── CTA ── */}
      <button
        onClick={onStart}
        className="cta-button"
        aria-label="Start the balance challenge"
      >
        <span className="cta-text">BEGIN CHALLENGE</span>
        <span className="cta-arrow">→</span>
      </button>

      <p className="landing-legal">
        No video is stored. Pose data is processed locally in your browser.
      </p>
    </div>
  );
}
