<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/chat.png" width="80" alt="Broadcast Chat Logo" />
</p>

<h1 align="center">Broadcast Chat</h1>

<p align="center">
  <strong>Real-time room-based chat, powered by WebSockets</strong>
</p>

<p align="center">
  <a href="#features">Features</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#tech-stack">Tech Stack</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#architecture">Architecture</a>&nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="#getting-started">Getting Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/WebSocket-Native-010101?logo=websocket&logoColor=white" alt="WebSocket" />
  <img src="https://img.shields.io/badge/Node.js-ws-339933?logo=node.js&logoColor=white" alt="Node.js" />
</p>

---

## Overview

**Broadcast Chat** is a sleek, real-time chat application where users can create or join rooms and instantly message everyone in the same room. Messages are broadcast over WebSockets with zero polling — every keystroke lands in milliseconds.

The frontend features a polished **glassmorphism** UI with frosted-glass panels, smooth hover animations, and a fully responsive layout that works beautifully on both desktop and mobile.

---

## Features

| | Feature | Description |
|---|---|---|
| 💬 | **Room-based Chat** | Create or join named rooms — only members in the same room see each other's messages |
| ⚡ | **Real-time Messaging** | Instant delivery via WebSocket broadcast, no polling or delays |
| 🎨 | **Glassmorphism UI** | Frosted-glass panels, subtle gradients, and smooth micro-interactions |
| 📱 | **Responsive Design** | Adapts gracefully from mobile to ultrawide |
| 🏥 | **Health Check Endpoint** | Built-in `/health` route for uptime monitoring and deployment checks |
| 🔒 | **Room Isolation** | Messages are scoped to their room — no cross-room leakage |
| 🧹 | **Auto Cleanup** | Users are automatically removed from the room when they disconnect |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework with latest concurrent features |
| **TypeScript 5.9** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling with the new Vite plugin |
| **Vite 7** | Lightning-fast dev server and bundler |
| **React Router 7** | Client-side routing (`/` landing → `/chat/:roomId`) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **ws** | Lightweight WebSocket server |
| **TypeScript 5.9** | End-to-end type safety |
| **HTTP Server** | Native `http.createServer` for health checks |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     FRONTEND                        │
│                                                     │
│  Landing Page ──────► Chat Page                     │
│  (name + room)        (WebSocket connection)        │
│                                                     │
│  React 19 · Tailwind CSS 4 · Vite 7                 │
└────────────────────────┬────────────────────────────┘
                         │  WebSocket (ws://)
                         ▼
┌─────────────────────────────────────────────────────┐
│                     BACKEND                         │
│                                                     │
│  ┌───────────┐    ┌───────────────────────────┐     │
│  │ HTTP      │    │ WebSocket Server          │     │
│  │ /health   │    │                           │     │
│  └───────────┘    │  join ──► register user   │     │
│                   │  chat ──► broadcast msg   │     │
│                   │  close ─► remove user     │     │
│                   └───────────────────────────┘     │
│                                                     │
│  Node.js · ws · TypeScript                          │
└─────────────────────────────────────────────────────┘
```

### Message Protocol

```jsonc
// Client → Server: Join a room
{ "type": "join", "payload": { "roomId": "general" } }

// Client → Server: Send a message
{ "type": "chat", "payload": { "name": "Alice", "message": "Hello!" } }

// Server → Client: Broadcast to room
{ "name": "Alice", "message": "Hello!" }
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or any package manager of your choice)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/broadcast-chat-app.git
cd broadcast-chat-app
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The WebSocket server starts on **port 8080** by default. Override with the `PORT` environment variable.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will launch the dev server (typically at `http://localhost:5173`).

### 4. Chat!

1. Open the app in your browser
2. Enter your **name** and a **room name**
3. Open another tab (or share the room name with a friend)
4. Start chatting in real-time!

### Environment Variables

| Variable | Location | Default | Description |
|---|---|---|---|
| `PORT` | Backend | `8080` | WebSocket server port |
| `VITE_WS_URL` | Frontend | `ws://localhost:8080` | WebSocket server URL |

---

## Project Structure

```
broadcast-chat-app/
├── backend/
│   ├── src/
│   │   └── index.ts          # WebSocket + HTTP server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx           # App entry point
│   │   ├── App.tsx            # Router setup
│   │   ├── index.css          # Glassmorphism styles
│   │   └── pages/
│   │       ├── Landing.tsx    # Room join form
│   │       └── Chat.tsx       # Chat interface
│   ├── index.html
│   ├── vite.config.ts
│   ├── vercel.json            # SPA rewrite rules
│   └── package.json
└── README.md
```

---

## Deployment

### Frontend (Vercel)

The frontend includes a [vercel.json](frontend/vercel.json) with SPA rewrites pre-configured. Deploy with:

```bash
cd frontend
npx vercel --prod
```

Set the `VITE_WS_URL` environment variable in Vercel's dashboard to point to your deployed backend.

### Backend

Deploy the backend to any Node.js host (Railway, Render, Fly.io, etc.):

```bash
cd backend
npm run build
npm start
```

Ensure `PORT` is set by your hosting provider, and that WebSocket connections are supported.

---

<p align="center">
  Built with ☕ and WebSockets
</p>
