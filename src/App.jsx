import React from "react";
/**
 * ============================================================
 *  🌿 10-SECOND BALANCE CHALLENGE — App.jsx
 *  Root component. Manages top-level game phase transitions:
 *    IDLE → COUNTDOWN → PLAYING → RESULT
 *
 *  Stack: React 18 · Tailwind CSS · TensorFlow.js MoveNet
 * ============================================================
 */

import { useState, useCallback } from "react";
import BalanceGame from "./components/BalanceGame";
import ResultScreen from "./components/ResultScreen";
import LandingScreen from "./components/LandingScreen";

// ── Game phases ──────────────────────────────────────────────
export const PHASE = {
  IDLE:      "idle",       // Pre-game landing screen
  PLAYING:   "playing",    // Active 10-second challenge
  RESULT:    "result",     // Post-game result + spirit animal reveal
};

export default function App() {
  // Current phase drives which screen is rendered
  const [phase, setPhase]       = useState(PHASE.IDLE);
  // finalScore is set when the PLAYING phase ends
  const [finalScore, setFinalScore] = useState(0);

  /** Called by BalanceGame when the 10 seconds expire */
  const handleGameEnd = useCallback((score) => {
    setFinalScore(score);
    setPhase(PHASE.RESULT);
  }, []);

  /** Reset everything back to the landing page */
  const handleRestart = useCallback(() => {
    setFinalScore(0);
    setPhase(PHASE.IDLE);
  }, []);

  return (
    /*
     * Full-viewport wrapper with our signature aesthetic:
     * - Midnight indigo base (#0D0F1A)
     * - Jade-green + coral accent glows
     * - Custom CSS vars defined in index.css
     */
    <div className="app-root">
      {phase === PHASE.IDLE && (
        <LandingScreen onStart={() => setPhase(PHASE.PLAYING)} />
      )}

      {phase === PHASE.PLAYING && (
        <BalanceGame onGameEnd={handleGameEnd} />
      )}

      {phase === PHASE.RESULT && (
        <ResultScreen score={finalScore} onRestart={handleRestart} />
      )}
    </div>
  );
}
