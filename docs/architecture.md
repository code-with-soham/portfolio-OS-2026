# 🏗️ Architecture Overview — Portfolio OS 2026

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Desktop  │  │ Taskbar  │  │ Window Manager   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Zustand  │  │ Axios    │  │ Framer Motion    │  │
│  │ (State)  │  │ (HTTP)   │  │ (Animations)     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└───────────────────────┬─────────────────────────────┘
                        │ REST API (JSON)
                        │ Port 5173 → Proxy → 5000
┌───────────────────────┴─────────────────────────────┐
│                   SERVER (Express)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Routes   │→ │Controller│→ │ Services         │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Validators│  │ Middleware│  │ Utils            │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                        │                            │
│              ┌─────────┴─────────┐                  │
│              │  JSON Data Files  │                  │
│              │  (Flat-File DB)   │                  │
│              └───────────────────┘                  │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer         | Technology                          | Purpose                        |
| ------------- | ----------------------------------- | ------------------------------ |
| Frontend      | React 19 (Vite)                     | UI rendering                   |
| Styling       | Tailwind CSS v4                     | Utility-first CSS              |
| Animations    | Framer Motion                       | Window transitions, micro-UX   |
| State         | Zustand                             | Global state management        |
| HTTP Client   | Axios                               | API communication              |
| Routing       | React Router DOM v7                 | Client-side navigation         |
| Backend       | Express.js                          | REST API server                |
| Data          | JSON flat-file storage              | No database needed             |
| Architecture  | MVC (Model-View-Controller)         | Clean separation of concerns   |

---

## Backend MVC Flow

```
HTTP Request
    │
    ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Route   │ ──▶ │Validator │ ──▶ │Controller│ ──▶ │ Service  │
│          │     │(Middleware)│    │(Handler) │     │(Business │
│          │     │          │     │          │     │  Logic)  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        ▼
                                                   ┌──────────┐
                                                   │  Utils   │
                                                   │(fileReader)
                                                   └──────────┘
                                                        │
                                                        ▼
                                                   ┌──────────┐
                                                   │  JSON    │
                                                   │  Data    │
                                                   └──────────┘
```

### Layer Responsibilities

| Layer       | File Example            | Responsibility                                        |
| ----------- | ----------------------- | ----------------------------------------------------- |
| Route       | `profileRoutes.js`      | Maps HTTP methods + paths to handlers                 |
| Validator   | `profileValidator.js`   | Validates request params/body before controller       |
| Controller  | `profileController.js`  | Parses request, calls service, formats response       |
| Service     | `profileService.js`     | Business logic, calls data utilities                  |
| Utility     | `fileReader.js`         | Generic JSON file reading with error handling         |
| Data        | `profile.json`          | Raw data storage (replaceable with a DB later)        |
| Middleware  | `errorHandler.js`       | Global error catching and response formatting         |

---

## Frontend Structure

```
client/src/
├── assets/          # Images, fonts, static files
├── components/      # Reusable UI components
│   ├── Desktop/     # Desktop grid, wallpaper
│   ├── Taskbar/     # Bottom taskbar, system tray
│   ├── Window/      # Window chrome, title bar
│   ├── StartMenu/   # Start menu panel
│   └── Apps/        # Individual application windows
├── constants/       # App-wide constants
├── hooks/           # Custom React hooks
├── pages/           # Route-level page components
├── services/        # API service modules (Axios)
├── store/           # Zustand state stores
├── utils/           # Helper functions
├── App.jsx          # Root component with routing
├── main.jsx         # Entry point
└── index.css        # Global styles + Tailwind
```

---

## API Design

All API endpoints follow this response format:

### Success Response
```json
{
  "success": true,
  "message": "Description of result",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development
}
```

### Endpoints (Phase 1)

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/api/health`    | Server health check      |
| GET    | `/api/profile`   | Retrieve profile data    |

---

## Design Decisions

### Why JSON flat-files instead of MongoDB?
- Zero setup cost for a portfolio project
- Data is relatively static (profile info, projects)
- Easy to version control alongside code
- Can swap to MongoDB later — services layer abstracts data access

### Why Zustand instead of Redux or Context?
- Minimal boilerplate (no providers, no reducers)
- Built-in persistence middleware
- Subscribable outside React components
- Perfect for OS-level state (windows, theme, taskbar)

### Why separate `app.js` and `server.js`?
- `app.js` configures Express (middleware, routes, error handling)
- `server.js` starts the HTTP server
- This separation allows importing the app for testing without starting a server
