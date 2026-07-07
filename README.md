<div align="center">

<!-- Animated Typing Header -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&pause=1000&color=2563EB&center=true&vCenter=true&width=800&lines=🖥️+Portfolio+OS+2026;A+Windows+11+Experience+in+the+Browser;Built+with+MERN,+Zustand,+and+AI;By+Soham+Kundu" alt="Typing SVG" />

<br/><br/>

<!-- Hero Screenshot -->
<a href="https://portfolio-os-2026.vercel.app/">
  <img src="https://via.placeholder.com/900x500?text=🚀+Replace+with+Full+Desktop+Screenshot" alt="Portfolio OS Desktop" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</a>

<br/><br/>

<!-- Action Buttons -->
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-portfolio--os--2026.vercel.app-blue?style=for-the-badge)](https://portfolio-os-2026.vercel.app/)
[![Documentation](https://img.shields.io/badge/📖_Documentation-View_Docs-success?style=for-the-badge)](#)
[![Demo Video](https://img.shields.io/badge/🎥_Watch_Video-YouTube-red?style=for-the-badge)](#)
[![Star Repo](https://img.shields.io/badge/⭐_Star_Repo-Support_Me-yellow?style=for-the-badge)](#)

</div>

---

## 🎯 Project Overview

> [!NOTE]  
> **Portfolio OS** is not a standard portfolio website. It is a **Windows 11-inspired operating system** built entirely in the browser. 
> 
> Instead of scrolling through a webpage, recruiters and visitors interact with a fully functional desktop environment, complete with a window manager, file explorer, integrated AI assistant, and persistent application state.

<br/>

<div align="center">

### 💡 Why Recruiters Like This Project
*A showcase of production-level engineering.*

✔ **Architecture Mastery** | ✔ **50+ Custom Components** | ✔ **State Management (Zustand)**
✔ **API Design (REST)** | ✔ **Modern UI (Tailwind)** | ✔ **AI Integration**
✔ **High Performance** | ✔ **Desktop UX/UI** | ✔ **Real Product Thinking**

</div>

---

## ✨ Feature Matrix

| Feature | Description | Status |
| :--- | :--- | :---: |
| 🪟 **Window Manager** | Drag, drop, maximize, minimize, and z-index calculation. | ✅ |
| 🤖 **AI Assistant** | Integrated GenAI chat to answer questions about my resume. | ✅ |
| 📁 **File Explorer** | Navigate a mock file system to find projects and documents. | ✅ |
| 💻 **Terminal** | Fully functional CLI to execute commands and navigate. | ✅ |
| ⚙️ **Quick Settings** | Control volume, brightness, and OS themes. | ✅ |
| 🔔 **Notification Center** | Real-time system notifications and alerts. | ✅ |
| 🧩 **Desktop Widgets** | Clock, calendar, and quick-glance information. | ✅ |
| 💾 **State Persistence** | App states remain saved across browser refreshes. | ✅ |
| 🗄️ **Mongo Explorer** | View mock database collections inside a UI. | ✅ |

---

## 🏗️ Architecture

```mermaid
graph TD
    User([🌐 Browser / User]) --> OS[🖥️ Portfolio OS Desktop]
    
    subgraph Frontend [React + Vite + Tailwind]
        OS --> WM[🪟 Window Manager]
        WM --> Apps[📦 Applications]
        Apps --> Store[(🧠 Shared Zustand Store)]
    end
    
    subgraph Backend [Node.js + Express]
        Store --> API[🔌 REST API Layer]
        API --> Express[🚀 Express Server]
        Express --> DB[(📂 JSON Flat-File Data)]
    end
    
    style User fill:#3498db,stroke:#2980b9
    style Frontend fill:#f39c12,stroke:#e67e22,color:#fff
    style Backend fill:#2ecc71,stroke:#27ae60,color:#fff
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
| :---: | :--- |
| **Frontend** | ⚛️ React `(Vite)` &nbsp;•&nbsp; 🎨 Tailwind CSS &nbsp;•&nbsp; 🎭 Framer Motion |
| **State Mgmt**| 🐻 Zustand |
| **Backend** | 🟢 Node.js &nbsp;•&nbsp; 🚀 Express.js |
| **Data** | 📁 JSON Flat-File Storage `(Simulating MongoDB)` |
| **AI Integration**| 🤖 Gemini API / Groq API |
| **Deployment**| ☁️ Vercel `(Frontend)` &nbsp;•&nbsp; 🐳 Docker `(Optional)` |

</div>

---

## 🖼️ Feature Preview Gallery

> [!TIP]  
> A picture is worth a thousand words. Here is the OS in action.

| 🖥️ Desktop Environment | 💻 Terminal CLI | 📁 File Explorer |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/300x200?text=Desktop+Screenshot" /> | <img src="https://via.placeholder.com/300x200?text=Terminal+Screenshot" /> | <img src="https://via.placeholder.com/300x200?text=Explorer+Screenshot" /> |
| **VS Code Emulator** | **AI Assistant** | **Settings Panel** |
| <img src="https://via.placeholder.com/300x200?text=VS+Code+Screenshot" /> | <img src="https://via.placeholder.com/300x200?text=AI+Screenshot" /> | <img src="https://via.placeholder.com/300x200?text=Settings+Screenshot" /> |

---

## 📱 App Ecosystem

The OS comes pre-loaded with the following applications:

```text
🖥️ Desktop Shell
💻 Terminal (CLI)
📁 File Explorer
⚙️ Settings & Personalization
📝 Notepad (Resume Viewer)
🧠 AI Assistant
📊 Project Dashboard
🎮 Game Center
💬 WhatsApp Clone
📈 Mongo DB Explorer
```

---

## 🚀 Getting Started

Follow these steps to run the OS locally on your machine.

### 1. Prerequisites
- **Node.js** >= 18
- **npm** >= 9

### 2. Clone & Setup Backend
```bash
git clone https://github.com/sohamkundu/portfolio-os-2026.git
cd portfolio-os-2026/server
npm install
npm run dev
```
> Server runs on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```
> App runs on `http://localhost:5173`

---

## 📂 Repository Structure

```text
📂 Portfolio OS 2026
├── 📂 client/               # React frontend (Vite, Tailwind, Zustand)
│   ├── 📂 src/
│   │   ├── 📂 components/   # UI elements (Taskbar, Windows, Icons)
│   │   ├── 📂 apps/         # Individual OS Applications
│   │   ├── 📂 store/        # Zustand state management
│   │   └── 📂 hooks/        # Custom React hooks (dragging, resizing)
├── 📂 server/               # Express.js backend (MVC)
│   ├── 📂 controllers/
│   ├── 📂 routes/
│   └── 📂 data/             # JSON flat-file databases
├── 📂 public/               # Static assets (Wallpapers, Icons)
├── 📂 docs/                 # System Architecture & API docs
└── 📄 README.md             # You are here!
```

---

## 📊 Project Statistics

```text
┌────────────────────────────────────────────────────────┐
│ 📈 REPOSITORY STATS                                    │
├────────────────────────────────────────────────────────┤
│ ⚛️ Components: 80+ React Components                    │
│ 📂 Applications: 20+ Functional Apps                   │
│ 📦 Codebase: 100+ Files & Modules                      │
│ 🧠 AI Powered: Integrated GenAI Chat                   │
│ ⚡ State: Complex Multi-Store Zustand                  │
│ 🪟 UI Design: Windows 11 Fluent Design                 │
└────────────────────────────────────────────────────────┘
```

---

## 🛣️ Development Roadmap

```mermaid
graph LR
    P1[Phase 1: UI ✅] --> P2[Phase 2: Backend ✅]
    P2 --> P3[Phase 3: Desktop ✅]
    P3 --> P4[Phase 4: Window Manager ✅]
    P4 --> P5[Phase 5: Applications ⏳]
    P5 --> P6[Future Features 🚀]
    
    style P1 fill:#2ecc71,stroke:#333
    style P2 fill:#2ecc71,stroke:#333
    style P3 fill:#2ecc71,stroke:#333
    style P4 fill:#2ecc71,stroke:#333
    style P5 fill:#f39c12,stroke:#333
```

---

<div align="center">
  <h3>Made with ❤️ by Soham Kundu</h3>
  <p>⭐ If this repository impressed you, please give it a Star!</p>
  <p><b>Happy Coding 🚀</b></p>
</div>
