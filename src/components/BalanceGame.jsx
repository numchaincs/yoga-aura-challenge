import React from "react";
/**
 * ============================================================
 *  🎮  BalanceGame.jsx  — The Heart of the Challenge
 *
 *  Orchestrates:
 *    • Camera stream (via CameraView)
 *    • Pose estimation (via usePoseEstimation)
 *    • 10-second timer + live scoring (via useBalanceScore)
 *    • Pre-game countdown (3… 2… 1… GO!)
 *    • Live score bar + stability indicator
 *
 *  Game flow:
 *    DETECT_POSE → COUNTDOWN (3s) → PLAYING (10s) → done
 *
 *  Props:
 *    onGameEnd(score: number) — called when the 10 s are up
 * ============================================================
 */

import { useRef, useState, useEffect, useCallback } from "react";
import CameraView              from "./CameraView";
import { usePoseEstimation }   from "../hooks/usePoseEstimation";
import { useBalanceScore }     from "../hooks/useBalanceScore";

// ── Game sub-states ───────────────────────────────────────────
const GAME_STATE = {
  LOADING:      "loading",      // Model still loading
  DETECT_POSE:  "detect_pose",  // Waiting for a person to appear in frame
  COUNTDOWN:    "countdown",    // 3-2-1-GO
  PLAYING:      "playing",      // Active challenge
};

// Countdown ticks (displayed in huge text)
const COUNTDOWN_STEPS = ["3", "2", "1", "GO!"];

export default function BalanceGame({ onGameEnd }) {
  // ── Refs ─────────────────────────────────────────────────
  const videoRef = useRef(null);

  // ── Pose estimation ───────────────────────────────────────
  const { keypoints, isModelReady } = usePoseEstimation(videoRef);

  // ── Scoring ───────────────────────────────────────────────
  const { score, timeLeft, isRunning, startGame } = useBalanceScore(keypoints);

  // ── Local state ───────────────────────────────────────────
  const [gameState,      setGameState]      = useState(GAME_STATE.LOADING);
  const [countdownIndex, setCountdownIndex] = useState(0);

  // ── Derived: is a person detected? ───────────────────────
  // We require at least 5 keypoints (torso visible) before allowing start
  const isPersonDetected = keypoints.length >= 5;

  // ── Transition: LOADING → DETECT_POSE ────────────────────
  useEffect(() => {
    if (isModelReady && gameState === GAME_STATE.LOADING) {
      setGameState(GAME_STATE.DETECT_POSE);
    }
  }, [isModelReady, gameState]);

  // ── Trigger countdown once pose is detected ───────────────
  useEffect(() => {
    if (gameState !== GAME_STATE.DETECT_POSE || !isPersonDetected) return;

    // Small delay so user can see "pose detected!" feedback
    const delay = setTimeout(() => {
      setGameState(GAME_STATE.COUNTDOWN);
      setCountdownIndex(0);
    }, 800);

    return () => clearTimeout(delay);
  }, [gameState, isPersonDetected]);

  // ── Run the 3-2-1-GO countdown ────────────────────────────
  useEffect(() => {
    if (gameState !== GAME_STATE.COUNTDOWN) return;

    if (countdownIndex >= COUNTDOWN_STEPS.length) {
      // Countdown finished — start the real game
      setGameState(GAME_STATE.PLAYING);
      startGame(onGameEnd);  // Kicks off the 10-second timer
      return;
    }

    const timer = setTimeout(() => {
      setCountdownIndex((i) => i + 1);
    }, 900); // Each countdown step lasts 900 ms

    return () => clearTimeout(timer);
  }, [gameState, countdownIndex, startGame, onGameEnd]);

  // ── Stability colour: green → yellow → red as score drops ─
  function getStabilityColor(score) {
    if (score >= 70) return "#4ADE80";  // jade green
    if (score >= 40) return "#FACC15";  // amber
    return "#F87171";                   // coral red
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="game-screen">

      {/* ── Camera + Skeleton overlay ── */}
      <CameraView
        videoRef={videoRef}
        keypoints={keypoints}
        isActive={true}
      />

      {/* ── HUD overlaid on top of camera ── */}
      <div className="game-hud">

        {/* Loading indicator */}
        {gameState === GAME_STATE.LOADING && (
          <div className="hud-overlay">
            <div className="loading-spinner" />
            <p className="hud-label">Loading AI model…</p>
          </div>
        )}

        {/* "Step into frame" prompt */}
        {gameState === GAME_STATE.DETECT_POSE && (
          <div className="hud-overlay">
            <div className={`pose-ring ${isPersonDetected ? "pose-ring--detected" : ""}`}>
              <span className="pose-ring-icon">🧘</span>
            </div>
            <p className="hud-label">
              {isPersonDetected
                ? "✅ Pose detected! Preparing…"
                : "Step into frame & strike a pose"}
            </p>
          </div>
        )}

        {/* Countdown: 3 – 2 – 1 – GO! */}
        {gameState === GAME_STATE.COUNTDOWN && (
          <div className="countdown-overlay">
            <span
              key={countdownIndex}  // key change triggers re-mount → CSS animation restarts
              className="countdown-number"
            >
              {COUNTDOWN_STEPS[countdownIndex]}
            </span>
            <p className="hud-sublabel">HOLD STILL!</p>
          </div>
        )}

        {/* Active game HUD */}
        {gameState === GAME_STATE.PLAYING && (
          <>
            {/* ── Timer ring ── */}
            <div className="timer-badge">
              <span className="timer-number">{timeLeft}</span>
              <span className="timer-unit">sec</span>
            </div>

            {/* ── Live score ── */}
            <div className="live-score-panel">
              <span className="live-score-label">STABILITY</span>
              <span
                className="live-score-value"
                style={{ color: getStabilityColor(score) }}
              >
                {score}
              </span>

              {/* Score bar */}
              <div className="score-bar-track">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${score}%`,
                    background: getStabilityColor(score),
                    boxShadow: `0 0 12px ${getStabilityColor(score)}`,
                    transition: "width 0.15s ease, background 0.3s ease",
                  }}
                />
              </div>

              {/* Motivational micro-copy */}
              <span className="live-score-hint">
                {score >= 80
                  ? "🔥 You're a statue!"
                  : score >= 50
                  ? "💪 Stay focused…"
                  : "😅 Don't wobble!"}
              </span>
            </div>
          </>
        )}

      </div>{/* /game-hud */}

    </div> /* /game-screen */
  );
}
