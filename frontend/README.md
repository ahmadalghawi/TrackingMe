# TrackMe — Premium Logistics Tracking

A state-of-the-art, high-performance package tracking application built for a premium unboxing experience.

![TrackMe Preview](https://img.shields.io/badge/Status-Live-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-2024-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **📦 3D Unboxing Hero**: An interactive, physics-inspired 3D box reveal that showcases parcels flying out in a fan-out animation.
- **🌓 Adaptive Theming**: Full support for Light and Dark modes with smooth transitions, persisting user preferences.
- **🌍 Global Ready**: Multi-language support (English & Swedish) with RTL-ready architecture.
- **⚡ Smart Caching**: In-memory API caching to ensure data consistency between views (crucial for randomized mock APIs).
- **📱 Mobile First**: Fully responsive glassmorphic navbar and touch-friendly order management.
- **🔍 Advanced Tracking**: Search by ID, filter by status, and manual fleet refresh capabilities.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# → Open http://localhost:5173
```

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI framework with Concurrent features |
| **Vite 6** | Lightning-fast build tool and HMR |
| **Tailwind CSS 4** | Advanced utility styling & design tokens |
| **Lucide React** | Premium, consistent iconography |
| **i18next** | Enterprise-grade localization |
| **Three.js / CSS 3D** | High-performance 3D animations |

## 📁 Project Structure

```text
src/
├── components/
│   ├── ThreeBox/       # 3D interactive box component
│   ├── FlyoutCard/     # Dynamic fan-out cards for hero
│   ├── Navbar/         # Responsive glassmorphic navigation
│   └── ThemeProvider/  # Theme management logic
├── pages/
│   ├── Home.tsx        # Hero experience & unboxing
│   └── Orders.tsx      # Fleet management & search
├── services/
│   └── api.ts          # API layer with memory caching
├── data/
│   └── mockOrders.ts   # Robust local fallback (15+ orders)
└── types/
    └── order.ts        # TypeScript definitions
```

## 🧠 Smart Data Strategy

TrackMe uses a two-tier data strategy to ensure a seamless user experience:

1. **Live API**: Fetches real-time randomized data from Mockaroo.
2. **Memory Cache**: Once fetched, the data is stabilized in memory. This ensures that if you click a parcel on the Home page, it **will always be found** on the Orders page, even though the API generates random IDs.
3. **Local Fallback**: If the API is unreachable (limit hit), the app automatically switches to the `mockOrders.ts` dataset without interrupting the user.

## 🌍 Internationalization

Toggle languages instantly via the navbar. 
- **Swedish (SE)**: Full localization for the Nordic market.
- **English (EN)**: Global default.

## 🎨 Design System

TrackMe utilizes a modern **Glassmorphic** design system:
- **Colors**: Custom OKLCH color palettes for maximum vibrance.
- **Typography**: Inter Tight & Caveat (for hand-drawn annotations).
- **Effects**: Backdrop blurs, subtle gradients, and spring-based animations.

## 📄 License

TrackMe Internal Project. All rights reserved © 2026.
