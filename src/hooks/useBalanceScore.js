/**
 * ============================================================
 *  ⚖️  useBalanceScore.js  — Custom React Hook
 *
 *  Turns raw MoveNet keypoints into a 0-100 stability score
 *  over a configurable time window (default: 10 seconds).
 *
 *  Scoring model
 *  ─────────────
 *  Each frame we measure the "sway" of a set of ANCHOR_POINTS
 *  (hips + shoulders) relative to their position at the START
 *  of the game.  Large sway → low score; micro-sway → high score.
 *
 *  score_frame = clamp(100 − swayPixels × SWAY_PENALTY, 0, 100)
 *  score_final = average of all frame scores
 *
 *  Usage:
 *    const { score, timeLeft, isRunning, startGame } =
 *        useBalanceScore(keypoints, { duration: 10 });
 * ============================================================
 */

import { useState, useRef, useCallback, useEffect } from "react";

// ── Configuration ─────────────────────────────────────────────
const GAME_DURATION_MS = 10_000;   // 10 seconds
const TICK_RATE_MS     = 100;      // Score sample every 100 ms

/**
 * Keypoints we track for stability.
 * Using the body's "core" avoids penalising natural arm movement.
 */
const ANCHOR_POINTS = [
  "left_hip",
  "right_hip",
  "left_shoulder",
  "right_shoulder",
];

/**
 * Pixels of sway that drops the frame score by 1 point.
 * Tweak this to make the challenge easier or harder.
 */
const SWAY_PENALTY = 1.5;

// ── Utility: extract centroid of anchor keypoints ─────────────
function getCentroid(keypoints) {
  const anchors = keypoints.filter((kp) => ANCHOR_POINTS.includes(kp.name));
  if (anchors.length === 0) return null;

  const sumX = anchors.reduce((s, kp) => s + kp.x, 0);
  const sumY = anchors.reduce((s, kp) => s + kp.y, 0);
  return { x: sumX / anchors.length, y: sumY / anchors.length };
}

// ── Utility: Euclidean distance between two points ────────────
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// ── Hook ──────────────────────────────────────────────────────
export function useBalanceScore(keypoints, { duration = 10 } = {}) {
  const durationMs = duration * 1_000;

  // ── State ─────────────────────────────────────────────────
  const [score,     setScore]     = useState(0);   // 0–100, live
  const [timeLeft,  setTimeLeft]  = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  // ── Refs (avoid stale closures inside intervals) ──────────
  const originRef     = useRef(null);   // Centroid at game start
  const frameScores   = useRef([]);     // Accumulate per-frame scores
  const startTimeRef  = useRef(null);
  const tickerRef     = useRef(null);
  const keypointsRef  = useRef([]);     // Latest keypoints snapshot
  const onEndRef      = useRef(null);   // Callback on game finish

  // Keep keypointsRef in sync without re-triggering effects
  useEffect(() => {
    keypointsRef.current = keypoints;
  }, [keypoints]);

  // ── Main tick ─────────────────────────────────────────────
  const tick = useCallback(() => {
    const elapsed   = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1_000));
    setTimeLeft(remaining);

    // ── Measure sway ──────────────────────────────────────
    const centroid = getCentroid(keypointsRef.current);

    if (centroid && originRef.current) {
      const sway       = distance(centroid, originRef.current);
      const frameScore = Math.max(0, 100 - sway * SWAY_PENALTY);
      frameScores.current.push(frameScore);

      // Live score = rolling average of all frames so far
      const liveAvg =
        frameScores.current.reduce((s, v) => s + v, 0) /
        frameScores.current.length;
      setScore(Math.round(liveAvg));
    }

    // ── Game over ─────────────────────────────────────────
    if (elapsed >= durationMs) {
      clearInterval(tickerRef.current);
      setIsRunning(false);

      const finalScore =
        frameScores.current.length > 0
          ? Math.round(
              frameScores.current.reduce((s, v) => s + v, 0) /
                frameScores.current.length
            )
          : 0;

      setScore(finalScore);
      onEndRef.current?.(finalScore);
    }
  }, [durationMs]);

  // ── Public: start the game ────────────────────────────────
  const startGame = useCallback((onEnd) => {
    onEndRef.current  = onEnd;
    frameScores.current = [];

    // Capture origin centroid NOW (pose must already be detected)
    originRef.current = getCentroid(keypointsRef.current) ?? { x: 320, y: 240 };

    startTimeRef.current = Date.now();
    setTimeLeft(duration);
    setScore(100); // Optimistic start
    setIsRunning(true);

    tickerRef.current = setInterval(tick, TICK_RATE_MS);
  }, [duration, tick]);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(tickerRef.current), []);

  return { score, timeLeft, isRunning, startGame };
}

// ── Score → tier mapping (used by ResultScreen & SpiritAnimal) ──
/**
 * Returns a label + spirit animal variant based on final score.
 *
 * @param {number} score  0–100
 * @returns {{ tier: string, animal: string, message: string }}
 */
export function getScoreTier(score) {
  if (score >= 90) return {
    tier:    "ENLIGHTENED",
    animal:  "crane",
    message: "You are one with the universe 🕊️",
  };
  if (score >= 70) return {
    tier:    "FOCUSED",
    animal:  "wolf",
    message: "Unwavering. The mountain bows to you 🐺",
  };
  if (score >= 50) return {
    tier:    "BALANCED",
    animal:  "fox",
    message: "Steady spirit, room to grow 🦊",
  };
  if (score >= 25) return {
    tier:    "WOBBLY",
    animal:  "panda",
    message: "A noble struggle. Bamboo helps 🐼",
  };
  return {
    tier:    "CHAOS",
    animal:  "penguin",
    message: "Beautifully disastrous. Try again 🐧",
  };
}
