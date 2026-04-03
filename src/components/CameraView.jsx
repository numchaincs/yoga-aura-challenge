import React, { useEffect, useRef } from "react";

const SKELETON_CONNECTIONS = [
  ["nose","left_eye"],["nose","right_eye"],
  ["left_eye","left_ear"],["right_eye","right_ear"],
  ["left_shoulder","right_shoulder"],
  ["left_shoulder","left_hip"],["right_shoulder","right_hip"],
  ["left_hip","right_hip"],
  ["left_shoulder","left_elbow"],["left_elbow","left_wrist"],
  ["right_shoulder","right_elbow"],["right_elbow","right_wrist"],
  ["left_hip","left_knee"],["left_knee","left_ankle"],
  ["right_hip","right_knee"],["right_knee","right_ankle"],
];

function drawSkeleton(ctx, keypoints, canvasW, canvasH, videoW, videoH) {
  const videoAspect  = videoW / videoH;
  const canvasAspect = canvasW / canvasH;
  let drawW, drawH, offsetX, offsetY;

  if (videoAspect > canvasAspect) {
    drawH = canvasH; drawW = canvasH * videoAspect;
    offsetX = (canvasW - drawW) / 2; offsetY = 0;
  } else {
    drawW = canvasW; drawH = canvasW / videoAspect;
    offsetX = 0; offsetY = (canvasH - drawH) / 2;
  }

  const scaleX = drawW / videoW;
  const scaleY = drawH / videoH;
  const kpMap  = Object.fromEntries(keypoints.map((kp) => [kp.name, kp]));

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(74,222,128,0.9)";
  ctx.shadowBlur  = 12;
  ctx.shadowColor = "#4ADE80";

  for (const [a, b] of SKELETON_CONNECTIONS) {
    const pa = kpMap[a]; const pb = kpMap[b];
    if (!pa || !pb) continue;
    ctx.beginPath();
    ctx.moveTo(offsetX + pa.x * scaleX, offsetY + pa.y * scaleY);
    ctx.lineTo(offsetX + pb.x * scaleX, offsetY + pb.y * scaleY);
    ctx.stroke();
  }

  for (const kp of keypoints) {
    ctx.beginPath();
    ctx.arc(offsetX + kp.x * scaleX, offsetY + kp.y * scaleY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#F0FFF4";
    ctx.shadowBlur = 16; ctx.shadowColor = "#4ADE80";
    ctx.fill();
  }
}

export default function CameraView({ videoRef, keypoints, isActive }) {
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isActive) { streamRef.current?.getTracks().forEach((t) => t.stop()); return; }
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      } catch (err) { console.error("Camera error:", err); }
    }
    startCamera();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [isActive, videoRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (keypoints.length > 0) {
      drawSkeleton(ctx, keypoints, canvas.width, canvas.height, video.videoWidth || 640, video.videoHeight || 480);
    }
  }, [keypoints, videoRef]);

  return (
    <div className="camera-container">
      <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="skeleton-canvas" aria-hidden="true" />
      <div className="corner corner-tl" /><div className="corner corner-tr" />
      <div className="corner corner-bl" /><div className="corner corner-br" />
    </div>
  );
}