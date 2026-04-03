# 🧘 10-Second Balance Challenge

> Stand still. Hold your breath. Discover your Yoga Spirit Animal.

A viral-ready web game that uses **TensorFlow.js MoveNet** for real-time pose estimation to score how still you can stand for 10 seconds — then reveals your personalised 2D spirit animal.

---

## 🗂 Project Structure

```
balance-challenge/
├── index.html                    # CDN scripts for TF.js + entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # React 18 bootstrap
    ├── App.jsx                   # Top-level phase manager (IDLE→PLAYING→RESULT)
    ├── index.css                 # Global styles + CSS variables + animations
    │
    ├── components/
    │   ├── LandingScreen.jsx     # Viral hook / how-to / CTA
    │   ├── BalanceGame.jsx       # Camera + HUD + countdown orchestrator
    │   ├── CameraView.jsx        # WebRTC stream + MoveNet skeleton overlay
    │   ├── ResultScreen.jsx      # Score reveal + spirit animal + share button
    │   └── SpiritAnimal.jsx      # 5 inline SVG yoga animals (no image files)
    │
    └── hooks/
        ├── usePoseEstimation.js  # TF.js MoveNet loader + 30fps inference loop
        └── useBalanceScore.js    # Stability scoring + tier classification
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser (camera requires HTTPS or localhost)
open http://localhost:5173
```

> **Mobile testing**: Run `npm run dev -- --host` then open your LAN IP
> on your phone. Camera APIs require HTTPS in production — use Vercel/Netlify
> which provide free TLS.

---

## 🧠 How Pose Estimation Works

```
Camera stream (WebRTC)
       ↓
  <video> element (mirrored)
       ↓
TF.js MoveNet LIGHTNING (~30fps inference)
       ↓
17 keypoints: { name, x, y, score }
       ↓
usePoseEstimation hook → keypoints[]
       ↓
useBalanceScore hook → measures centroid drift
       ↓
score = 100 − (sway_pixels × SWAY_PENALTY)
```

---

## 🦊 Spirit Animal Tiers

| Score | Tier        | Animal  |
|-------|-------------|---------|
| 90–100 | ENLIGHTENED | Crane  |
| 70–89  | FOCUSED     | Wolf   |
| 50–69  | BALANCED    | Fox    |
| 25–49  | WOBBLY      | Panda  |
| 0–24   | CHAOS       | Penguin|

---

## 🎨 Design System

| Token          | Value     | Usage                    |
|----------------|-----------|--------------------------|
| `--bg-base`    | `#0D0F1A` | App background            |
| `--jade`       | `#4ADE80` | Primary glow + skeleton   |
| `--coral`      | `#F97316` | CTA buttons               |
| `--violet`     | `#A855F7` | Wolf tier accent          |
| Font display   | Syne 800  | Headings + countdown      |
| Font body      | DM Sans   | Body copy + labels        |

---

## 🔑 Key Integration Points

### Adding a new spirit animal
1. Create a new SVG component in `SpiritAnimal.jsx`
2. Add a colour entry to `TIER_COLORS`
3. Register it in `ANIMAL_COMPONENTS`
4. Update the score threshold in `getScoreTier()` in `useBalanceScore.js`

### Changing difficulty
Edit `SWAY_PENALTY` in `useBalanceScore.js` (higher = harder)
Edit `MIN_CONFIDENCE` in `usePoseEstimation.js` (lower = more forgiving)

### Switching to MoveNet Thunder (more accurate, slower)
In `usePoseEstimation.js`, change:
```js
modelType: window.poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
```

---

## 📦 Production Deployment

```bash
npm run build
# Upload /dist to Vercel, Netlify, or any static host
# ⚠️  Camera access requires HTTPS in production!
```

---

## 🔒 Privacy

No video or pose data ever leaves the user's device.
All inference runs locally in the browser via WebGL.
