# 📦 Logistics Experience Lab

Welcome to the **Logistics Experience Lab**, a dual-project monorepo dedicated to pushing the boundaries of package-tracking UI/UX. This repository houses two distinct implementations of the "TrackMe" concept, each exploring a unique design philosophy and technical stack.

---

## 🎨 Dual Design Philosophies

This monorepo showcases how the same functional requirement—tracking a package—can be transformed by divergent aesthetic and technical choices.

### 1. TrackMe: The Glassmorphic Vanguard
**Location:** `/frontend`

A premium, state-of-the-art logistics dashboard designed for a **high-end, luxury unboxing experience**.

*   **Design Aesthetic**: **Glassmorphism**. High-vibrance OKLCH color palettes, backdrop blurs, and floating cards.
*   **Hero Experience**: An interactive 3D unboxing powered by **Three.js**, featuring physics-inspired "fan-out" parcel reveals.
*   **Technical Edge**: Uses **Tailwind CSS v4** for advanced design tokens and **i18next** for seamless localization (EN/SE).
*   **Vibe**: Sleek, futuristic, and premium.

### 2. TrackingMe: The Mechanical Precision
**Location:** `/TrackingMe`

A tactile, industrial-focused tracking application that prioritizes **mechanical realism and deterministic feedback**.

*   **Design Aesthetic**: **Industrial Realism**. Focuses on the "cardboard" texture and structural integrity of the shipping process.
*   **Hero Experience**: A **Pure CSS 3D** cardboard box with a multi-phase opening sequence (shaking → ripping → opening → revealed).
*   **Technical Edge**: Features a **Live Tweaks Panel** for real-time design tuning and uses deterministic hashing for stable parcel timelines.
*   **Vibe**: Gritty, reliable, and tactile.

---

## 🛠 Project Comparison

| Feature | TrackMe (Premium) | TrackingMe (Mechanical) |
| :--- | :--- | :--- |
| **3D Engine** | Three.js / WebGL | Pure CSS 3D Transforms |
| **Styling** | Tailwind CSS v4 | Tailwind CSS (Standard) |
| **Animation Style** | Smooth, Fluid, Organic | Snappy, Mechanical, Tactile |
| **Key UX Feature** | Glassmorphic Cards | Live Design Tweaks Panel |
| **Data Strategy** | Memory-stabilized Caching | Hash-deterministic Timelines |

---

## 🚀 Getting Started

Both projects are independent Vite-powered React applications. To explore either:

```bash
# Navigate to the project
cd frontend  # or cd TrackingMe

# Install dependencies
npm install

# Start the lab
npm run dev
```

---

## 📁 Repository Structure

```text
tracking/
├── frontend/           # The Glassmorphic implementation
├── TrackingMe/         # The Mechanical implementation
├── .agents/            # AI Agent configurations (Ignored)
└── skills-lock.json    # Development skill definitions (Ignored)
```

---

Developed with ❤️ as a study in modern web aesthetics and interactive storytelling.
