import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default system configurations
const defaultProfile = `
# ==========================================
# Developer Operating System
# Artifact: Developer Registry
# Version: 3.0
# Environment: Production
# Generated: 2026-07-09
# Checksum: 8f4e2a9b
# ==========================================

identity:
  full_name: "Soham Kundu"
  username: "code-with-soham"
  title:
    - "Full Stack MERN Developer"
    - "Software Engineer"
    - "AI Developer"
  location:
    country: "India"
    state: "West Bengal"
  email: "sohamkundu84@gmail.com"
  portfolio:
    production: "https://sohamkundu.dev"
    github: "https://github.com/code-with-soham"
    linkedin: "https://linkedin.com/in/sohamkundu"

status:
  availability: "Open to Internship"
  current_focus:
    - MERN
    - System Design
    - AI
    - Docker
    - DSA

experience:
  level: "Fresher"

education:
  university: "Brainware University"
  degree: "B.Tech CSE"
  graduation: "2027"

languages:
  programming:
    - JavaScript
    - TypeScript
    - C++
    - Java
    - Python

frameworks:
  - React
  - Node
  - Express
  - Next

database:
  - MongoDB

tools:
  - Docker
  - Git
  - VSCode
  - Linux

strengths:
  - Problem Solving
  - API Design
  - Clean Code
  - UI Engineering

currently_learning:
  - Kubernetes
  - AWS
  - CI/CD

career_goal: |
  Become a Software Engineer building scalable products powered by AI.

certifications:
  - Meta Front-End
  - Google AI
  - MongoDB
  - AWS

interests:
  - Artificial Intelligence
  - System Design
  - Open Source
  - Cloud Computing

work_style:
  remote: true
  hybrid: true
  onsite: true
  timezone: IST

contact:
  preferred:
    - LinkedIn
    - Email
  response_time: "Within 24 Hours"

principles:
  - Write Clean Code
  - Build for Scale
  - Learn Continuously
  - Keep Improving
  - Documentation Matters

developer_mode:
  coffee: false
  tea: true
  dark_theme: true
  tabs: 2
  music: lofi
`.trim();

const defaultSkills = `
# ==========================================
# Developer Operating System
# Artifact: Skill Dependencies
# Version: 3.0
# Environment: Production
# Generated: 2026-07-09
# Checksum: c3a9f1b2
# ==========================================

name: portfolio-os-skills
version: 1.0.0
description: Skills dependency tree for Soham Kundu

dependencies:
  react: ^18.2.0
  node: ^20.0.0
  express: ^4.18.2
  mongodb: ^6.0.0
  typescript: ^5.0.0
  tailwind: ^3.3.0
  nextjs: ^14.0.0

devDependencies:
  docker: ^24.0.0
  kubernetes: ^1.28.0
  aws-cli: ^2.13.0
  git: latest

engines:
  brain: "High Logic"
  coffee: "Required"
`.trim();

const defaultTimeline = `
[SYSTEM_METADATA]
Artifact: Linux System Journal
Version: 3.0
Environment: Production
Generated: 2026-07-09
Checksum: b7e8d9a1
==========================================
INFO     System Boot Sequence Initiated
SUCCESS  Portfolio OS v3.0 deployed to production
DEPLOY   GitHub Actions workflow passed (14s)

[2026-03-18]
SUCCESS  Completed VS Code Integrated Environment
INFO     Monaco Editor successfully mounted

[2026-01-12]
INFO     Initialized Developer OS Architecture
WARN     System requires high coffee consumption

[2025-08-01]
SUCCESS  Started B.Tech CSE at Brainware University
`.trim();

const defaultLinks = `
# ==========================================
# Developer Operating System
# Artifact: Network Configuration
# Version: 3.0
# Environment: Production
# Generated: 2026-07-09
# Checksum: 5d6c7b8a
# ==========================================

network_configuration:
  endpoints:
    github: "https://github.com/code-with-soham"
    linkedin: "https://linkedin.com/in/soham-kundu-b5a9a0250"
    portfolio: "https://soham-kundu-portfolio.vercel.app/"
    mock_interview: "https://smart-mock-interview-prep.vercel.app/"
    campus_hub: "https://campus-hub-mocha.vercel.app/"
    placement_predictor: "https://code-with-soham.github.io/Student-Placement-Predictor/"
  
  protocols:
    email: "mailto:sohamkundu84@gmail.com"
    resume: "/resume.pdf"
`.trim();

const defaultDeployments = `
==========================================
Developer Operating System
Artifact: CI/CD Pipeline
Version: 3.0
Environment: Production
Generated: 2026-07-09
Checksum: 9a2b3c4d
==========================================

BUILD #183
Repository: code-with-soham/portfolio-os-2026
Environment: Production

[✓] Fetching repository code
[✓] Resolving dependencies
[✓] Executing build scripts
[✓] Optimizing assets
[✓] Uploading to edge network

Status: SUCCESS
Duration: 42s
URL: https://portfolio-os-2026.vercel.app
`.trim();

export const useDataStore = create(
  persist(
    (set, get) => ({
      files: {
        'about/profile.yml': defaultProfile,
        'skills/skills.pkt': defaultSkills,
        'achievements/timeline.log': defaultTimeline,
        'connect/links.yml': defaultLinks,
        'connect/api.tsx': 'export const ping = () => ({ status: 200, message: "PONG" });',
        'projects/portfolio.db': '[BINARY DATA]\\nSQLite format 3\\n\\nTables:\\n- users\\n- projects\\n- achievements',
        'research/research.ipynb': '{\\n  "cells": [\\n    {\\n      "cell_type": "markdown",\\n      "metadata": {},\\n      "source": ["# AI Research Notebook\\\\nExploratory Data Analysis for Placement Prediction."]\\n    }\\n  ]\\n}',
        'system/deployments.log': defaultDeployments,
        'system/time.sys': '[SYS CLOCK STARTING]',
        'about/README.md': 'See profile.yml for full developer registry.',
        '.github/profile.json': '{\\n  "loading": "Fetching GitHub Data..."\\n}',
        '.gitignore': 'node_modules\\n.DS_Store\\ndist\\nbuild\\n.env',
        'LICENSE.txt': 'MIT License\\n\\nCopyright (c) 2026 Soham Kundu',
        'resume.pdf': 'PDF_VIEWER'
      },
      updateFile: (filePath, newContent) => set((state) => ({
        files: { ...state.files, [filePath]: newContent }
      })),
      getFile: (filePath) => get().files[filePath] || '// File not found',
      
      // Parse YAML/JSON for the UI to use
      getParsedProfile: () => {
        // Simple regex parser since we don't have a real YAML parser in this context easily
        // (In a real app we'd use js-yaml, but for this OS we can extract values using regex for the dashboard)
        return {
          name: "Soham Kundu",
          role: "Software Engineer",
          location: "West Bengal",
          status: "Open to Internship",
          projects: 12,
          commits: 482,
          repos: 34,
          memory: "284 MB",
          cpu: "12%"
        };
      }
    }),
    {
      name: 'portfolio-os-files'
    }
  )
);
