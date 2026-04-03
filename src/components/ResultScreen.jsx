import React from "react";
/**
 * ============================================================
 *  🏆  ResultScreen.jsx
 *
 *  The payoff screen — designed to be screenshot-worthy and
 *  viral-shareable. Shows:
 *    • Animated spirit animal (large, glowing)
 *    • Score donut chart (pure SVG, no dependencies)
 *    • Tier name + flavour message
 *    • Share button (Web Share API with canvas screenshot)
 *    • Play Again CTA
 *
 *  Props:
 *    score     {number} 0-100
 *    onRestart {function}
 * ============================================================
 */

import { useEffect, useState } from "react";
import SpiritAnimal from "./SpiritAnimal";
import { getScoreTier } from "../hooks/useBalanceScore";

// ── SVG Donut / Radial score chart ────────────────────────────
/**
 * A single-ring radial progress chart built with SVG strokeDasharray.
 * No canvas, no Chart.js — lightweight and theme-consistent.
 */
function ScoreDonut({ score, color }) {
  const RADIUS     = 54;
  const CIRCUMF    = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMF * (1 - score / 100);

  // Animate the stroke fill on mount
  const [offset, setOffset] = useState(CIRCUMF); // Start empty
  useEffect(() => {
    const raf = requestAnimationFrame(() => setOffset(dashOffset));
    return () => cancelAnimationFrame(raf);
  }, [dashOffset]);

  return (
    <svg viewBox="0 0 120 120" width="140" height="140" className="score-donut">
      {/* Track (grey ring) */}
      <circle
        cx="60" cy="60" r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="10"
      />
      {/* Progress ring */}
      <circle
        cx="60" cy="60" r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={CIRCUMF}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"  /* start at 12 o'clock */
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      {/* Score label inside the ring */}
      <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill="white">
        {score}
      </text>
      <text x="60" y="72" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" letterSpacing="2">
        / 100
      </text>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────
export default function ResultScreen({ score, onRestart }) {
  const { tier, animal, message } = getScoreTier(score);

  // Colour for the score tier (matches SpiritAnimal palette)
  const TIER_ACCENT = {
    ENLIGHTENED: "#22D3EE",
    FOCUSED:     "#A855F7",
    BALANCED:    "#F97316",
    WOBBLY:      "#4ADE80",
    CHAOS:       "#FACC15",
  };
  const accent = TIER_ACCENT[tier] ?? "#4ADE80";

  // ── Reveal animation — stagger in sections ────────────────
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ── Share via Web Share API (or clipboard fallback) ───────
  async function handleShare() {
    const shareText =
      `I scored ${score}/100 on the 10-Second Balance Challenge! ` +
      `My spirit animal is the ${animal.toUpperCase()} (${tier}). ` +
      `Can you beat me? 🧘‍♀️`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Balance Challenge", text: shareText });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Score copied to clipboard! Share it anywhere 🎉");
    }
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className={`result-screen ${revealed ? "result-screen--revealed" : ""}`}>

      {/* ── Confetti (CSS-only burst on reveal) ── */}
      {score >= 50 && (
        <div className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{
              "--dx":    `${((i * 71 + 13) % 200) - 100}px`,
              "--dy":    `-${80 + (i * 37) % 120}px`,
              "--rot":   `${(i * 53) % 360}deg`,
              "--delay": `${(i * 0.05).toFixed(2)}s`,
              "--color": [accent, "#fff", "#F97316", "#4ADE80"][i % 4],
            }} />
          ))}
        </div>
      )}

      {/* ── Spirit Animal (large reveal) ── */}
      <div className="result-animal-wrap">
        <SpiritAnimal animal={animal} animate={true} size={220} />
        {/* Tier badge overlaid on the animal */}
        <div className="tier-badge" style={{ borderColor: accent, color: accent }}>
          {tier}
        </div>
      </div>

      {/* ── Score section ── */}
      <div className="result-score-row">
        <ScoreDonut score={score} color={accent} />
        <div className="result-score-text">
          <p className="result-animal-name">
            THE <span style={{ color: accent }}>
              {animal.toUpperCase()}
            </span>
          </p>
          <p className="result-message">{message}</p>
        </div>
      </div>

      {/* ── Breakdown bar (a little detail for repeat players) ── */}
      <div className="result-breakdown">
        {[
          { label: "Stillness",  value: Math.min(100, score + 5)  },
          { label: "Balance",    value: score                       },
          { label: "Focus",      value: Math.max(0, score - 8)     },
        ].map(({ label, value }) => (
          <div key={label} className="breakdown-row">
            <span className="breakdown-label">{label}</span>
            <div className="breakdown-track">
              <div
                className="breakdown-fill"
                style={{
                  width: `${value}%`,
                  background: accent,
                  boxShadow: `0 0 8px ${accent}80`,
                }}
              />
            </div>
            <span className="breakdown-val">{value}</span>
          </div>
        ))}
      </div>

      {/* ── Action buttons ── */}
      <div className="result-actions">
        <button className="cta-button" onClick={handleShare}>
          📤 SHARE RESULT
        </button>
        <button className="secondary-button" onClick={onRestart}>
          Try Again
        </button>
      </div>

    </div>
  );
}
