# Portfolio OS 2026 — Project Status & Architecture Documentation

*Last updated: 2026-06-20*

## 1. Project Overview
Portfolio OS 2026 is an advanced, highly interactive personal portfolio disguised as a fully functional operating system. 
- **Design Goal**: To provide a unique, "WOW"-factor experience for recruiters and developers by demonstrating complex frontend architecture (React, Zustand, Framer Motion) wrapped in a familiar desktop (Windows 11 inspired) and mobile (Android OS inspired) interface.
- **Desktop + Mobile Experience**: Features a seamless transition. Desktop users experience a rich windowed environment, while mobile users are presented with a tailored installable PWA experience mimicking a modern smartphone OS, complete with a dedicated Recruiter Dashboard.
- **Why it is Unique**: Features a built-in Local AI Brain, automated presentation modes (F9 Guided Tour, F10 Auto Demo), and extensive system-level telemetry tracking recruiter interactions.

---

## 2. Current Completion Status

- **Windows 11 Desktop OS**: Complete (Needs Production Validation). Features dragging, resizing, maximizing, minimizing, z-index management, contextual menus, and dynamic wallpapers.
- **Taskbar / Start Menu**: Complete (Needs Production Validation). Includes pinned apps, system tray, quick settings, and notifications.
- **VS Code App**: Complete (Needs Production Validation). Monaco editor integration, file tree, interactive terminal, and markdown rendering.
- **Browser App**: Complete (Needs Production Validation). Tab management, URL routing, history, developer tools, bookmarks, and downloads UI.
- **Music App**: Complete (Needs Production Validation). Playback controls, playlist management, and volume OSD integration.
- **Core Utility Apps (Mail, Photos, Calculator, Notepad, Paint, Task Manager, Recycle Bin, Settings, Calendar, File Explorer)**: Complete functional implementations.
- **AI Assistant / AI Brain**: Complete (Needs Production Validation). Local NLP intent parsing, knowledge graph querying, system control commands, and floating chat overlay.
- **Analytics / Recruiter Mode**: Complete (Needs Production Validation). Tracks candidate engagement (resume views, clicks).
- **F9 Guided Presentation / F10 Auto Demo**: Complete (Needs Production Validation). Orchestrated window controls with animated overlays and automatic interactions.
- **Android Mobile OS**: Complete (Needs Production Validation). PWA compatible, gesture navigation, app drawer, widgets, and dedicated Mobile Recruiter interface.
- **Widgets / Personalization / Themes**: Complete (Needs Production Validation). Light/Dark/OLED/Hacker themes, desktop widgets panel.

---

## 3. Folder Structure

```text
portfolio-os/
├── client/
│   ├── public/             # Static assets, PWA manifest, favicon
│   ├── src/
│   │   ├── ai/             # AI Brain engine, intents, actions, knowledge graph JSONs
│   │   ├── apps/           # Desktop applications (VSCode, Browser, Paint, etc.)
│   │   ├── assets/         # Icons, images, wallpapers
│   │   ├── components/     # Reusable UI (Window manager, Taskbar, Start Menu, Overlays)
│   │   ├── config/         # App registry, configurations
│   │   ├── constants/      # Global constants, OS states
│   │   ├── data/           # Mock data, file system state
│   │   ├── hooks/          # Custom React hooks (Shortcuts, Presentation Controller)
│   │   ├── mobile/         # Mobile OS specific components, apps, and stores
│   │   ├── pages/          # Top-level views (Desktop, BootScreen)
│   │   ├── services/       # External API integrations
│   │   ├── store/          # Zustand global state stores
│   │   ├── styles/         # Global CSS variables, fonts
│   │   ├── utils/          # Helper functions
│   │   ├── widgets/        # Desktop and mobile widget components
│   │   ├── App.jsx         # Root router / layout
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/         # Server configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── data/           # Server-side mock data
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Backend services
│   │   ├── utils/          # Backend utilities
│   │   └── validators/     # Request validation
│   ├── server.js           # Server entry point
│   └── package.json
└── docs/
    └── PROJECT_STATUS.md   # You are here
```

---

## 4. Dependencies

### Client (Frontend)
- **React / UI**: `react`, `react-dom`, `react-router-dom`, `@fluentui/react-icons`, `@iconify/react`
- **Motion / Animations**: `framer-motion`, `react-type-animation`
- **State Management**: `zustand`
- **Editor & Specialized UI**: `@monaco-editor/react`, `react-markdown`, `react-syntax-highlighter`, `rehype-raw`
- **Search**: `fuse.js`
- **Utilities**: `axios`, `html2canvas`
- **Build Tool**: `vite`, `tailwindcss`

### Server (Backend)
- **Framework**: `express`, `cors`, `morgan`
- **Utilities**: `dotenv`, `express-rate-limit`, `nodemailer`, `html2canvas`

---

## 5. Architecture Summary

- **OS Separation**: The `App.jsx` handles initial routing and the boot screen. Depending on the viewport (`window.innerWidth`), it conditionally renders either the Desktop OS (`Desktop.jsx`) or the Mobile OS (`MobileOS.jsx`).
- **App Registry**: Desktop applications are registered globally, usually driven by configurations in `src/config/apps.jsx` mapping IDs to components.
- **State Management**: Zustand manages highly modular, independent domains (e.g., `useWindowStore`, `useFileSystemStore`, `useThemeStore`). Many stores utilize `zustand/persist` to sync state with `localStorage`.
- **AI Brain (`src/ai/`)**: A localized logic engine that parses text inputs, detects intents via regex/fuzzy matching (`fuse.js`), cross-references a local JSON knowledge graph (`src/ai/knowledge`), and dispatches UI actions.
- **System Integrations**: Components are loosely coupled via Zustand. For example, the F9/F10 Presentation hooks manipulate the global Window Store to orchestrate automated demonstrations without hardcoding app logic.
- **Backend Connectivity**: Client communicates with the Node.js/Express backend for features like live weather or emails, though it heavily prioritizes client-side mock execution for speed and stability.

---

## 6. App Inventory

| App Name | Type | Purpose | Status |
|---|---|---|---|
| **VSCodeApp** | Desktop | Monaco-powered code editor showcasing project architecture | Complete (Needs Production Validation) |
| **BrowserApp** | Desktop | Functional web browser with tabs, history, DevTools | Complete (Needs Production Validation) |
| **MusicApp** | Desktop | Media player integrated with global OS volume | Complete (Needs Production Validation) |
| **TerminalApp** | Desktop | Command-line interface for system interactions | Complete (Needs Production Validation) |
| **ProjectsApp** | Desktop | Portfolio projects showcase grid | Complete (Needs Production Validation) |
| **SkillsApp** | Desktop | Interactive skill tree / radar | Complete (Needs Production Validation) |
| **RecruiterApp** | Desktop | Executive summary dashboard for recruiters | Complete (Needs Production Validation) |
| **AnalyticsCenterApp**| System | Telemetry dashboard showing UI interaction stats | Complete (Needs Production Validation) |
| **AIDashboardApp** | System | Internal view into the local AI brain engine | Complete (Needs Production Validation) |
| **PaintApp** | Desktop | Canvas drawing application | Complete (Needs Production Validation) |
| **FileExplorerApp**| Desktop | Traverses mock file system | Complete (Needs Production Validation) |
| **SettingsApp** | System | Theming, wallpapers, system configuration | Complete (Needs Production Validation) |
| **MobileRecruiter**| Mobile | High-priority landing dashboard for mobile users | Complete (Needs Production Validation) |
| **MobileOS** | Mobile | Android-style app launcher, lock screen, and widgets | Complete (Needs Production Validation) |

---

## 7. Stores / Hooks / Services

### Core Stores (`src/store/`)
- `useWindowStore.js`: Core OS manager. Handles window stack, active focus, z-index calculations, maximize/minimize state.
- `useDesktopStore.js`: Global environment state (booting sequence, lock screen, open context menus).
- `useFileSystemStore.js`: Maintains the mock directory tree and file persistence layer.
- `useThemeStore.js`: Colors, custom wallpapers, dark mode, OLED styling.
- `useAnalyticsStore.js`: Telemetry engine. Tracks "Recruiter metrics" (time spent, clicks, presentations run).
- `usePresentationStore.js`: Holds sequential state, step text, and overlay progress for F9 (Guided) and F10 (Demo) modes.
- `useGitHubStore.js`: Fetches and locally caches live GitHub profile and repository API data.
- `useWidgetStore.js`: Manages visibility and configuration of the desktop widgets panel.

### Important Hooks (`src/hooks/`)
- `useKeyboardShortcuts.js`: Centralized event listener for OS-level hotkeys (e.g., Win keys, F-keys).
- `usePresentationController.js`: Orchestrates the F9/F10 timed sequence logic, invoking store actions programmatically.

---

## 8. Keyboard Shortcuts and Global Commands

- **Win + D**: Show/Hide Desktop (Minimize all).
- **Win + E**: Open File Explorer.
- **Win + R**: Open Run Dialog.
- **Win + X**: Open Power User Menu.
- **Win + S**: Open Global Search.
- **Win + Space**: Toggle Floating AI Assistant.
- **Ctrl + Shift + P**: Open Command Palette.
- **F9**: Start Guided Presentation Mode.
- **F10**: Start Auto Demo Copilot Sequence.
- **F11**: Emergency Exit (Kills active presentations).

---

## 9. Environment Variables / Secrets

- `VITE_GITHUB_TOKEN`: (Optional) Personal access token to bypass GitHub API rate limits.
- `VITE_WEATHER_API_KEY`: OpenWeatherMap API Key for live weather widgets.
- `PORT`: Backend server port (defaults to 5000).
- `VITE_API_BASE_URL`: Pointer to the production backend URL for the client.

---

## 10. Deployment / Hosting

- **Frontend Hosting**: Designed for Vercel or Netlify (Configured via standard `vite build`).
- **Backend Hosting**: Designed for Render, Heroku, or Vercel Serverless Functions.
- **Build Command**: `npm run build`
- **Dev Command**: `npm run dev` (Concurrently for client and server).
- **Status**: *To Verify* upon final production push.

---

## 11. Known Issues / TODOs

- **VS-34 Architecture Explorer**: Not yet started. (Pending Phase 3).
- **VS-34.5 Portfolio Health Center**: Not yet started. (Pending Phase 3).
- **Mobile PWA Enhancements**: Needs verification on physical devices for Standalone mode manifest behavior and caching.
- **Backend Integrations**: The Node/Express server exists and handles external routes, but deep analytics telemetry may require wiring if transitioning away from `localStorage`.

---

## 12. Future Maintenance Notes

### How to Extend the OS

- **Adding a new Desktop App**: 
  1. Create the component folder in `src/apps/NewApp/`.
  2. Register the app metadata (ID, icon, title, default dimensions) in `src/config/apps.jsx`.
  3. The Window Manager will automatically support rendering it when `openWindow('newappid')` is called.
- **Adding a new Store**:
  Use Zustand. Create `useNewStore.js` in `src/store/`. If state persistence across reloads is required, import `persist` from `zustand/middleware`.
- **Adding a new Keyboard Shortcut**:
  Inject the key listener into `src/hooks/useKeyboardShortcuts.js`. Remember to call `e.preventDefault()` if overriding standard browser keys.
- **Adding a new AI Intent**:
  Update `src/ai/training/intents.js` with the trigger phrases and implement the functional execution logic in `src/ai/actions/actionRegistry.js`.
- **Adding a new Mobile Component**:
  Create it in `src/mobile/components/` and register the route/view inside `MobileOS.jsx` or the respective mobile store.
- **Updating this Documentation**:
  When a new phase (like VS-34 Architecture Explorer) is completed, update Section 2 (Completion Status), Section 6 (App Inventory), and clear the item from Section 11 (TODOs).
