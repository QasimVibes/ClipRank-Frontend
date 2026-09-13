<div align="center">

# 🎬 ClipRank — AI-Powered Short-Form Video Clipping Platform

**Transform long-form content into viral, high-retention vertical clips using AI.**

[![React Version](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite Version](https://img.shields.io/badge/Vite-8.1.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express SSR](https://img.shields.io/badge/Express-SSR_Supported-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.43-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Linter](https://img.shields.io/badge/Linter-oxlint-FF6B6B?style=flat-square)](https://oxc-project.github.io/)

[Features](#-key-features) • [Architecture](#-architecture--tech-stack) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [Scripts](#-available-scripts) • [SSR Setup](#-server-side-rendering-ssr--seo)

</div>

---

## 🌟 Overview

**ClipRank** is a modern, high-performance web application designed for creators, podcast hosts, and social media managers. It automatically extracts, analyzes, and ranks the most engaging, viral-ready moments from long-form YouTube videos, TikToks, and Instagram content—turning hours of video into platform-optimized vertical short clips (9:16) with automatic captioning and virality scoring.

Built with **React 19**, **Vite 8**, **Tailwind CSS**, and **Express SSR**, ClipRank delivers a sleek glassmorphic user interface with smooth **Framer Motion** animations, full dark/light theme support, real-time WebSocket job processing updates, and server-side rendering for optimal SEO performance.

---

## ✨ Key Features

- 🤖 **AI-Powered Virality Analysis & Scoring**  
  Automatically transcribes video audio, identifies emotional peaks, high-retention hooks, and ranks every segment with a calculated Virality Score.
- ✂️ **Interactive Video Cutter (`/cutter`)**  
  Fine-tune clip start/end timestamps, adjust aspect ratios, preview trimmed clips in real-time, and customize captions before exporting.
- 📡 **Real-Time Job Processing (`/processing/:jobId`)**  
  Live WebSocket connection (`useWebSocket`) tracks real-time progress steps—transcription, virality scoring, thumbnail generation, and final clip rendering.
- 🏆 **Interactive Gallery (`/gallery/:jobId`)**  
  Explore processed clips sorted by rank, filter by Virality Score, preview video clips, and download high-resolution output files.
- 🔗 **Multi-Platform OAuth Integration**  
  Connect social media accounts seamlessly across YouTube, Facebook, and Instagram for instant video imports and automated posting.
- 📜 **Historical Job Tracking (`/history`)**  
  Search, filter, and review all previous clipping jobs with instant access to past results and clip downloads.
- 🚀 **Hybrid SSR & SPA Architecture**  
  Public pages (`/` landing page, `/privacy-policy`) are pre-rendered on the server via Express & Vite SSR for optimal SEO crawlability, while user workspaces run as a snappy Client-Side Application (SPA).
- 🌓 **Dynamic Dark / Light Theme**  
  Built-in theme toggle (`ThemeContext`) supporting dark mode aesthetic defaults and clean light mode themes.
- 🛡️ **Protected Routing & Auth Flow**  
  JWT-based authentication flow with dedicated `ProtectedRoute` and `GuestRoute` components.

---

## 🏗️ Architecture & Tech Stack

### Frontend & Rendering
- **Framework**: [React 19](https://react.dev/) + [React Router DOM v7](https://reactrouter.com/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with SSR entrypoints (`entry-client.jsx`, `entry-server.jsx`)
- **Server Environment**: [Express.js](https://expressjs.com/) (`server.js`) with compression & Sirv static asset serving
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) + PostCSS + Custom CSS variables
- **Animations**: [Framer Motion v12](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: [oxlint](https://oxc-project.github.io/)

### Codebase Directory Structure

```
ClipRank-Frontend/
├── public/                  # Static assets & public icons
├── src/
│   ├── assets/              # Design graphics & images
│   ├── components/          # Reusable UI components
│   │   ├── ClipCard.jsx     # Ranked clip card display & controls
│   │   ├── FullPageLoader.jsx # Global loading state overlay
│   │   ├── GuestRoute.jsx   # Route guard for unauthenticated users
│   │   ├── Layout.jsx       # Global application navigation layout
│   │   ├── PlatformIcon.jsx # Platform brand badges (YouTube, Meta, etc.)
│   │   ├── ProtectedRoute.jsx # Route guard for logged-in users
│   │   ├── RankBadge.jsx    # Virality rank indicator badge
│   │   ├── StepTracker.jsx  # Multi-step job progress indicator
│   │   └── ThemeToggle.jsx  # Dark/Light mode theme switch
│   ├── context/             # Global Context Providers
│   │   ├── AuthContext.jsx  # User authentication state
│   │   └── ThemeContext.jsx # Light/Dark mode state manager
│   ├── hooks/               # Custom React Hooks
│   │   └── useWebSocket.js  # Live WebSocket subscription hook for job status
│   ├── pages/               # Views & Route Components
│   │   ├── ConnectFacebook.jsx   # Facebook OAuth & connection status
│   │   ├── ConnectInstagram.jsx  # Instagram connection page
│   │   ├── ConnectYouTube.jsx    # YouTube channel integration page
│   │   ├── Gallery.jsx           # Clip collection & download hub
│   │   ├── History.jsx           # Past job history & filtering
│   │   ├── Home.jsx              # Landing page (SSR enabled)
│   │   ├── Login.jsx             # User login view
│   │   ├── PrivacyPolicy.jsx     # Privacy Policy (SSR enabled)
│   │   ├── Processing.jsx        # Real-time job execution screen
│   │   ├── Signup.jsx            # User registration view
│   │   ├── Submit.jsx            # Video URL submission dashboard
│   │   └── VideoCutter.jsx       # Interactive video trimming workbench
│   ├── api.js               # Centralized REST API service layer
│   ├── App.jsx              # Application router & layout structure
│   ├── entry-client.jsx     # Client hydration entrypoint
│   ├── entry-server.jsx     # Server-side rendering (SSR) entrypoint
│   ├── index.css            # Tailwind & custom glassmorphism styles
│   └── main.jsx             # Vite main entry file
├── .env.example             # Template for environment configuration
├── index.html               # Base HTML template with SSR target markup
├── package.json             # NPM dependencies and scripts
├── server.js                # Express SSR server handler
├── tailwind.config.js       # Custom Tailwind theme setup
└── vite.config.js           # Vite SSR & build setup
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ClipRank-Frontend.git
   cd ClipRank-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Modify `.env.local` to point to your backend REST API and WebSocket server URLs.*

---

## ⚙️ Environment Variables

The application relies on the following environment variables (prefixed with `VITE_` for browser exposure):

| Variable | Type | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `VITE_WS_URL` | String | Backend WebSocket server URL for real-time job progress | `ws://localhost:8000` |
| `VITE_API_URL` | String | Backend REST API base URL | `http://localhost:8000` |
| `VITE_APP_ENV` | String | App deployment environment (`development`, `staging`, `production`) | `development` |
| `VITE_FEATURE_SOCIAL_POSTING` | Boolean | Enable direct social media posting button | `false` |
| `VITE_FEATURE_CAPTION_STYLES` | Boolean | Enable AI caption style selector on submission | `false` |

*Note: If `VITE_API_URL` is left empty, the client gracefully falls back to mock demo data for testing.*

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the Express SSR development server at `http://localhost:5173`. |
| `npm run dev:spa` | Launches Vite dev server in Client-Side SPA mode. |
| `npm run build` | Builds both production bundles: `dist/client` (client assets) & `dist/server` (SSR entry). |
| `npm run build:client` | Builds client-side assets bundle. |
| `npm run build:server` | Builds server-side SSR bundle. |
| `npm run start` | Runs the Express SSR server in production mode. |
| `npm run preview` | Previews the production SSR build locally. |
| `npm run lint` | Runs `oxlint` for high-speed code linting. |

---

## 🌐 Server-Side Rendering (SSR) & SEO

ClipRank features a hybrid SSR setup configured via Express (`server.js`) and Vite's SSR module graph (`src/entry-server.jsx`):

- **SSR-Enabled Routes**: Public landing routes (`/` and `/privacy-policy`) are pre-rendered into static HTML on the server.
- **Dynamic Meta & Head Tags**: Page titles, meta descriptions, Open Graph, and Twitter card tags are dynamically injected per route for maximum SEO search engine indexing.
- **SPA Fallback**: Authenticated dashboard routes (such as `/dashboard`, `/processing`, `/gallery`, `/cutter`) render the lightweight React SPA shell, handing off routing dynamically to client-side hydration.

---

## 🤝 Contributing

Contributions are always welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

