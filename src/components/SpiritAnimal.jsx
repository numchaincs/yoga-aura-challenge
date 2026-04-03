import React from "react";
/**
 * ============================================================
 *  🦊  SpiritAnimal.jsx
 *
 *  Renders a dynamic 2D "Yoga Spirit Animal" illustration as
 *  pure inline SVG. No image files needed — everything is
 *  drawn in code, making it trivially animatable via CSS.
 *
 *  The animal morphs based on the `animal` prop:
 *    "crane"   → score ≥ 90  (Enlightened)
 *    "wolf"    → score ≥ 70  (Focused)
 *    "fox"     → score ≥ 50  (Balanced)  ← default
 *    "panda"   → score ≥ 25  (Wobbly)
 *    "penguin" → score < 25  (Chaos)
 *
 *  Each animal holds a different yoga pose and glows in a
 *  tier-specific accent colour.
 *
 *  Props:
 *    animal  {string}  — one of the keys above
 *    animate {boolean} — enable idle breathing animation
 * ============================================================
 */

// ── Tier colour palette (matches game aesthetics) ─────────────
const TIER_COLORS = {
  crane:   { body: "#A5F3FC", glow: "#22D3EE", aura: "#0E7490" }, // cyan
  wolf:    { body: "#C4B5FD", glow: "#A855F7", aura: "#6B21A8" }, // violet
  fox:     { body: "#FCA5A5", glow: "#F97316", aura: "#B45309" }, // coral/amber
  panda:   { body: "#D1FAE5", glow: "#4ADE80", aura: "#166534" }, // jade
  penguin: { body: "#FDE68A", glow: "#FACC15", aura: "#B45309" }, // amber
};

// ── Individual animal SVG bodies ──────────────────────────────

/** 🦢 Crane — one-legged balance pose (Vrikshasana) */
function CraneSVG({ color }) {
  return (
    <g>
      {/* Body */}
      <ellipse cx="100" cy="95" rx="22" ry="30" fill={color.body} />
      {/* Long neck */}
      <path d="M100 65 Q108 45 105 30" stroke={color.body} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Head */}
      <circle cx="105" cy="26" r="12" fill={color.body} />
      {/* Beak */}
      <path d="M115 24 L128 22 L115 28 Z" fill="#FCD34D" />
      {/* Eye */}
      <circle cx="109" cy="23" r="3" fill="#1E293B" />
      <circle cx="110" cy="22" r="1" fill="white" />
      {/* Crown plume */}
      <path d="M105 14 Q108 5 104 0 Q102 5 98 6 Q102 8 105 14" fill="#EF4444" />
      {/* Wings spread — tree pose arms */}
      <path d="M80 88 Q55 70 40 60" stroke={color.body} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M120 88 Q145 70 160 60" stroke={color.body} strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Standing leg */}
      <line x1="95" y1="125" x2="90" y2="165" stroke={color.body} strokeWidth="6" strokeLinecap="round" />
      <line x1="90" y1="165" x2="82" y2="175" stroke={color.body} strokeWidth="5" strokeLinecap="round" />
      <line x1="90" y1="165" x2="90" y2="178" stroke={color.body} strokeWidth="5" strokeLinecap="round" />
      {/* Raised leg — yoga tree pose */}
      <path d="M105 125 Q130 130 125 150" stroke={color.body} strokeWidth="6" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** 🐺 Wolf — warrior pose arms raised (Virabhadrasana) */
function WolfSVG({ color }) {
  return (
    <g>
      {/* Body */}
      <ellipse cx="100" cy="105" rx="26" ry="32" fill={color.body} />
      {/* Head */}
      <circle cx="100" cy="68" r="22" fill={color.body} />
      {/* Snout */}
      <ellipse cx="100" cy="80" rx="10" ry="7" fill={color.aura} opacity="0.5" />
      <ellipse cx="100" cy="76" rx="5" ry="3" fill="#1E293B" />
      {/* Ears */}
      <polygon points="80,52 70,28 92,45" fill={color.body} />
      <polygon points="120,52 130,28 108,45" fill={color.body} />
      <polygon points="82,50 75,34 90,46" fill={color.glow} opacity="0.5" />
      <polygon points="118,50 125,34 110,46" fill={color.glow} opacity="0.5" />
      {/* Eyes */}
      <circle cx="90" cy="63" r="5" fill="#1E293B" />
      <circle cx="110" cy="63" r="5" fill="#1E293B" />
      <circle cx="91" cy="62" r="2" fill="white" />
      <circle cx="111" cy="62" r="2" fill="white" />
      {/* Arms raised — warrior pose */}
      <path d="M78 98 Q55 78 48 55" stroke={color.body} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M122 98 Q145 78 152 55" stroke={color.body} strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Hands */}
      <circle cx="48" cy="55" r="7" fill={color.body} />
      <circle cx="152" cy="55" r="7" fill={color.body} />
      {/* Legs — wide stance */}
      <path d="M85 135 Q75 155 65 170" stroke={color.body} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M115 135 Q125 155 135 170" stroke={color.body} strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Tail */}
      <path d="M124 110 Q155 100 160 80 Q158 100 145 115" stroke={color.body} strokeWidth="7" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** 🦊 Fox — lotus meditation pose */
function FoxSVG({ color }) {
  return (
    <g>
      {/* Crossed legs — lotus */}
      <ellipse cx="100" cy="152" rx="40" ry="16" fill={color.body} />
      {/* Body */}
      <ellipse cx="100" cy="110" rx="24" ry="30" fill={color.body} />
      {/* Belly patch */}
      <ellipse cx="100" cy="115" rx="14" ry="18" fill="white" opacity="0.4" />
      {/* Head */}
      <circle cx="100" cy="72" r="22" fill={color.body} />
      {/* Pointed snout */}
      <polygon points="100,88 90,82 110,82" fill={color.aura} opacity="0.6" />
      <ellipse cx="100" cy="83" rx="4" ry="2.5" fill="#1E293B" />
      {/* Ears */}
      <polygon points="82,55 72,30 94,50" fill={color.body} />
      <polygon points="118,55 128,30 106,50" fill={color.body} />
      <polygon points="84,54 77,36 93,50" fill={color.glow} opacity="0.6" />
      <polygon points="116,54 123,36 107,50" fill={color.glow} opacity="0.6" />
      {/* Eyes — serene closed */}
      <path d="M87 67 Q90 63 93 67" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M107 67 Q110 63 113 67" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Meditation hands — mudra gesture */}
      <ellipse cx="100" cy="138" rx="12" ry="7" fill={color.body} />
      <circle cx="93" cy="136" r="5" fill={color.body} />
      <circle cx="107" cy="136" r="5" fill={color.body} />
      {/* Tail curled around */}
      <path d="M124 118 Q158 130 152 155 Q145 170 125 160" stroke={color.body} strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Tail tip */}
      <circle cx="126" cy="159" r="10" fill="white" opacity="0.5" />
    </g>
  );
}

/** 🐼 Panda — attempting tree pose, slightly wobbly */
function PandaSVG({ color }) {
  return (
    <g>
      {/* Body — round & chonky */}
      <ellipse cx="100" cy="112" rx="33" ry="38" fill={color.body} />
      {/* Belly */}
      <ellipse cx="100" cy="118" rx="20" ry="24" fill="white" opacity="0.5" />
      {/* Head */}
      <circle cx="100" cy="65" r="28" fill={color.body} />
      {/* Panda eye patches */}
      <ellipse cx="86" cy="60" rx="11" ry="9" fill="#1E293B" />
      <ellipse cx="114" cy="60" rx="11" ry="9" fill="#1E293B" />
      {/* Eyes */}
      <circle cx="86" cy="60" r="5" fill="white" />
      <circle cx="114" cy="60" r="5" fill="white" />
      <circle cx="87" cy="59" r="2.5" fill="#1E293B" />
      <circle cx="115" cy="59" r="2.5" fill="#1E293B" />
      {/* Blush */}
      <circle cx="78" cy="70" r="6" fill="#FDA4AF" opacity="0.5" />
      <circle cx="122" cy="70" r="6" fill="#FDA4AF" opacity="0.5" />
      {/* Nose */}
      <ellipse cx="100" cy="76" rx="5" ry="3" fill="#1E293B" />
      {/* Ears */}
      <circle cx="77" cy="40" r="14" fill="#1E293B" />
      <circle cx="123" cy="40" r="14" fill="#1E293B" />
      {/* Wobbly arms — trying to balance */}
      <path d="M70 105 Q45 88 35 72" stroke="#1E293B" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M130 105 Q155 88 162 70" stroke="#1E293B" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Legs — one up, one planted, looking unstable */}
      <path d="M85 148 Q78 165 75 178" stroke="#1E293B" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M115 148 Q128 158 130 165" stroke="#1E293B" strokeWidth="10" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** 🐧 Penguin — dramatic "falling" pose */
function PenguinSVG({ color }) {
  return (
    <g transform="rotate(-15, 100, 100)">  {/* Tilted = chaotic */}
      {/* Body */}
      <ellipse cx="100" cy="115" rx="28" ry="38" fill="#1E3A5F" />
      {/* White belly */}
      <ellipse cx="100" cy="120" rx="18" ry="28" fill={color.body} />
      {/* Head */}
      <circle cx="100" cy="68" r="24" fill="#1E3A5F" />
      {/* Face white patch */}
      <ellipse cx="100" cy="72" rx="14" ry="16" fill={color.body} />
      {/* Eyes — shocked expression */}
      <circle cx="91" cy="63" r="7" fill="white" />
      <circle cx="109" cy="63" r="7" fill="white" />
      <circle cx="92" cy="64" r="3.5" fill="#1E293B" />
      <circle cx="110" cy="64" r="3.5" fill="#1E293B" />
      <circle cx="91" cy="63" r="1.5" fill="white" />
      <circle cx="109" cy="63" r="1.5" fill="white" />
      {/* Beak */}
      <polygon points="100,76 93,82 107,82" fill={color.glow} />
      {/* Flippers flailing */}
      <path d="M73 110 Q45 92 38 80" stroke="#1E3A5F" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M127 110 Q155 92 162 80" stroke="#1E3A5F" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="85" cy="152" rx="14" ry="7" fill={color.glow} />
      <ellipse cx="115" cy="152" rx="14" ry="7" fill={color.glow} />
      {/* Motion lines — chaotic energy */}
      <line x1="20" y1="85" x2="35" y2="85" stroke={color.glow} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="15" y1="95" x2="32" y2="95" stroke={color.glow} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <line x1="165" y1="85" x2="180" y2="85" stroke={color.glow} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

// ── Animal registry ───────────────────────────────────────────
const ANIMAL_COMPONENTS = {
  crane:   CraneSVG,
  wolf:    WolfSVG,
  fox:     FoxSVG,
  panda:   PandaSVG,
  penguin: PenguinSVG,
};

// ── Main exported component ───────────────────────────────────
export default function SpiritAnimal({ animal = "fox", animate = true, size = 200 }) {
  const color    = TIER_COLORS[animal] ?? TIER_COLORS.fox;
  const AnimalFn = ANIMAL_COMPONENTS[animal] ?? FoxSVG;

  return (
    <div
      className={`spirit-animal-wrapper ${animate ? "spirit-breathing" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/*
          * SVG filter definitions — glow effect applied to the animal.
          * feGaussianBlur + feComposite creates a neon halo.
          */}
        <defs>
          <filter id={`glow-${animal}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Radial aura behind the animal */}
          <radialGradient id={`aura-${animal}`} cx="50%" cy="60%" r="50%">
            <stop offset="0%"   stopColor={color.glow}  stopOpacity="0.25" />
            <stop offset="100%" stopColor={color.aura}  stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Background aura circle */}
        <ellipse cx="100" cy="105" rx="85" ry="80"
          fill={`url(#aura-${animal})`} />

        {/* The animal, wrapped in the glow filter */}
        <g filter={`url(#glow-${animal})`}>
          <AnimalFn color={color} />
        </g>

        {/* Decorative lotus petals at the base for enlightened tier */}
        {animal === "crane" && (
          <g opacity="0.6">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <ellipse
                key={i}
                cx={100 + Math.cos((deg * Math.PI) / 180) * 22}
                cy={175 + Math.sin((deg * Math.PI) / 180) * 10}
                rx="8" ry="4"
                fill={color.glow}
                transform={`rotate(${deg}, ${100 + Math.cos((deg * Math.PI) / 180) * 22}, ${175 + Math.sin((deg * Math.PI) / 180) * 10})`}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
