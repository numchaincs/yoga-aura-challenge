/**
 * ============================================================
 *  🎯 usePoseEstimation.js  — Custom React Hook
 *
 *  Encapsulates ALL TensorFlow.js / MoveNet logic so that UI
 *  components stay clean. Returns real-time keypoint data at
 *  ~30 fps once the model is loaded.
 *
 *  Usage:
 *    const { keypoints, isModelReady } = usePoseEstimation(videoRef);
 *
 *  Keypoints returned follow the MoveNet 17-point COCO format:
 *    nose, left_eye, right_eye, left_ear, right_ear,
 *    left_shoulder, right_shoulder, left_elbow, right_elbow,
 *    left_wrist, right_wrist, left_hip, right_hip,
 *    left_knee, right_knee, left_ankle, right_ankle
 * ============================================================
 */

import { useEffect, useRef, useState, useCallback } from "react";

// ── TF.js imports (loaded via CDN in index.html) ─────────────
// These are accessed from the global window object because we
// use CDN <script> tags instead of npm to keep bundle size lean.
//   window.tf  → @tensorflow/tfjs
//   window.poseDetection → @tensorflow-models/pose-detection

/** Minimum keypoint confidence score we'll trust (0–1) */
const MIN_CONFIDENCE = 0.35;

/** How often we run inference (ms). 33ms ≈ 30 fps */
const INFERENCE_INTERVAL_MS = 33;

export function usePoseEstimation(videoRef) {
  // ── State ─────────────────────────────────────────────────
  const [keypoints, setKeypoints]       = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const [error, setError]               = useState(null);

  // ── Internal refs (don't trigger re-renders) ──────────────
  const detectorRef   = useRef(null); // MoveNet detector instance
  const rafIdRef      = useRef(null); // requestAnimationFrame id
  const intervalIdRef = useRef(null); // setInterval id for inference loop

  // ── Model loader ──────────────────────────────────────────
  const loadModel = useCallback(async () => {
    try {
      // Ensure TF.js and the pose-detection library are on window
      if (!window.tf || !window.poseDetection) {
        throw new Error("TensorFlow.js or poseDetection not loaded. Check your index.html CDN scripts.");
      }

      // Use the WebGL backend for GPU-accelerated inference
      await window.tf.setBackend("webgl");
      await window.tf.ready();
      console.log("🧠 TF backend ready:", window.tf.getBackend());

      /*
       * MoveNet.SINGLEPOSE_THUNDER  → higher accuracy, ~15 fps on CPU
       * MoveNet.SINGLEPOSE_LIGHTNING → faster, ~30 fps — ideal for games
       *
       * For a 10-second challenge, Lightning gives smoother feedback.
       */
      const model = window.poseDetection.SupportedModels.MoveNet;
      detectorRef.current = await window.poseDetection.createDetector(model, {
        modelType: window.poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,    // Temporal smoothing reduces jitter
        minPoseScore: MIN_CONFIDENCE,
      });

      console.log("✅ MoveNet detector ready");
      setIsModelReady(true);
    } catch (err) {
      console.error("Model load failed:", err);
      setError(err.message);
    }
  }, []);

  // ── Inference loop ────────────────────────────────────────
  const runInference = useCallback(async () => {
    const video = videoRef.current;
    if (
      !detectorRef.current ||
      !video ||
      video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA
    ) return; // Video not ready yet — skip this frame

    try {
      /*
       * estimatePoses() returns an array of Pose objects.
       * For SINGLEPOSE models, the array always has 0 or 1 entries.
       *
       * Each Pose has:
       *   pose.keypoints → array of { x, y, score, name }
       *   pose.score     → overall pose confidence
       */
      const poses = await detectorRef.current.estimatePoses(video, {
        maxPoses: 1,
        flipHorizontal: true,   // Mirror so it feels natural (selfie view)
      });

      if (poses.length > 0) {
        // Filter to only high-confidence keypoints before broadcasting
        const trusted = poses[0].keypoints.filter(
          (kp) => kp.score >= MIN_CONFIDENCE
        );
        setKeypoints(trusted);
      } else {
        setKeypoints([]); // No person detected
      }
    } catch (err) {
      // Silently ignore per-frame errors (e.g. GPU hiccup)
      console.warn("Inference error:", err.message);
    }
  }, [videoRef]);

  // ── Start / stop inference on model ready ─────────────────
  useEffect(() => {
    if (!isModelReady) return;

    // Poll at a fixed interval rather than rAF so inference never
    // "stacks up" when the tab is backgrounded.
    intervalIdRef.current = setInterval(runInference, INFERENCE_INTERVAL_MS);

    return () => {
      clearInterval(intervalIdRef.current);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [isModelReady, runInference]);

  // ── Bootstrap on mount ────────────────────────────────────
  useEffect(() => {
    loadModel();
    return () => {
      // Clean up detector to free GPU memory when component unmounts
      detectorRef.current?.dispose?.();
    };
  }, [loadModel]);

  return { keypoints, isModelReady, error };
}

// ── Helper: get a keypoint by name ───────────────────────────
/**
 * Quick lookup by COCO keypoint name.
 * Returns { x, y, score } or null if not found / low confidence.
 *
 * @param {Array} keypoints  - array from usePoseEstimation
 * @param {string} name      - e.g. "left_wrist"
 */
export function getKeypoint(keypoints, name) {
  return keypoints.find((kp) => kp.name === name) ?? null;
}
