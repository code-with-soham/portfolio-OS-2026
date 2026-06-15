// ============================================
// Portfolio OS 2026 — Terminal Command Registry
// ============================================
// Extensible command map for the Terminal app.
// Each command has a description and handler function.
// Handlers receive { args, addOutput, clearOutput, openWindow, setTheme }

import { APP_NAME, APP_VERSION, APP_AUTHOR } from '../constants';

/**
 * Command registry — map of command name → { description, handler }
 *
 * Handler signature:
 *   handler({ args, addOutput, clearOutput, openWindow, setTheme }) => void
 *
 * addOutput(lines) — append lines (string[]) to terminal output
 * clearOutput() — clear all terminal output
 * openWindow(appId) — open an app window
 * setTheme(theme) — set 'dark' or 'light' theme
 */
export const TERMINAL_COMMANDS = {
  help: {
    description: 'Show available commands',
    handler: ({ addOutput }) => {
      const lines = [
        '┌─────────────────────────────────────────────┐',
        '│          Available Commands                  │',
        '├──────────────┬──────────────────────────────┤',
      ];

      Object.entries(TERMINAL_COMMANDS).forEach(([name, cmd]) => {
        const paddedName = name.padEnd(14);
        const paddedDesc = cmd.description.padEnd(28);
        lines.push(`│ ${paddedName}│ ${paddedDesc} │`);
      });

      lines.push('└──────────────┴──────────────────────────────┘');
      addOutput(lines);
    },
  },

  about: {
    description: 'Display bio and profile info',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        `  ╔══════════════════════════════════════════╗`,
        `  ║  ${APP_AUTHOR}                           ║`,
        `  ║  Full Stack Developer                    ║`,
        `  ╚══════════════════════════════════════════╝`,
        '',
        '  📍 Kolkata, West Bengal, India',
        '  💼 2+ years of experience',
        '  🎓 B.Tech CSE — UEM Kolkata',
        '  📧 soham.kundu@example.com',
        '',
        '  Passionate full-stack developer specializing',
        '  in modern web technologies.',
        '',
        '  🔗 GitHub:    github.com/sohamkundu',
        '  🔗 LinkedIn:  linkedin.com/in/sohamkundu',
        '  🔗 Portfolio: sohamkundu.dev',
        '',
      ]);
    },
  },

  projects: {
    description: 'List all projects',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  📂 Projects',
        '  ─────────────────────────────────',
        '',
        '  ⭐ Portfolio OS 2026    [In Progress]',
        '     React, Node.js, Express, Zustand',
        '',
        '  ⭐ HealthSathi AI       [Completed]',
        '     React, TypeScript, TensorFlow.js',
        '',
        '     DevCollab Platform   [Completed]',
        '     Next.js, Socket.io, WebRTC',
        '',
        '     FinTrack Dashboard   [Completed]',
        '     React, Chart.js, MongoDB',
        '',
        '  Use "open projects" to view full details.',
        '',
      ]);
    },
  },

  skills: {
    description: 'Show tech stack',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  ⚡ Skills Overview',
        '  ─────────────────────────────────',
        '',
        '  🎨 Frontend',
        '     React ████████████████████░ 90%',
        '     JavaScript ██████████████████░░ 92%',
        '     TypeScript ███████████████░░░░░ 75%',
        '     Tailwind CSS ████████████████░░░ 88%',
        '',
        '  ⚙️ Backend',
        '     Node.js █████████████████░░░ 85%',
        '     Express.js ████████████████░░░ 88%',
        '     MongoDB ███████████████░░░░░ 78%',
        '',
        '  🔧 Tools',
        '     Git ████████████████████░ 90%',
        '     Docker ██████████░░░░░░░░░░ 50%',
        '',
        '  Use "open skills" to see visual details.',
        '',
      ]);
    },
  },

  resume: {
    description: 'Download resume',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  📄 Opening resume download...',
        '',
      ]);
      // Trigger download
      const link = document.createElement('a');
      link.href = '/Soham_June_Resume_1_Page.pdf';
      link.download = 'Soham_Kundu_Resume.pdf';
      link.click();
    },
  },

  contact: {
    description: 'Show contact info',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  📬 Contact Information',
        '  ─────────────────────────────────',
        '',
        '  📧 Email:    soham.kundu@example.com',
        '  📱 Phone:    +91-9876543210',
        '  🔗 GitHub:   github.com/sohamkundu',
        '  🔗 LinkedIn: linkedin.com/in/sohamkundu',
        '  🌐 Website:  sohamkundu.dev',
        '',
      ]);
    },
  },

  sudo: {
    description: 'Execute command as superuser',
    handler: ({ args, addOutput }) => {
      if (args.length === 2 && args[0] === 'hire' && args[1] === 'soham') {
        import('../store/useAchievementStore').then(({ useAchievementStore }) => {
          useAchievementStore.getState().trackEvent('sudo-hire-soham');
        });
        addOutput([
          '',
          '  Excellent choice 😎',
          '  (Achievement Unlocked: Hidden Gem)',
          '',
        ]);
      } else {
        addOutput(['  soham is not in the sudoers file. This incident will be reported.']);
      }
    },
  },

  clear: {
    description: 'Clear the terminal',
    handler: ({ clearOutput }) => {
      clearOutput();
    },
  },

  whoami: {
    description: 'Who am I?',
    handler: ({ addOutput }) => {
      addOutput([`soham@portfolio-os`]);
    },
  },

  ls: {
    description: 'List directory contents',
    handler: ({ args, addOutput }) => {
      addOutput([
        '',
        '  📁 Desktop/',
        '  ├── 📁 Projects/',
        '  ├── 📁 Certificates/',
        '  ├── 📁 Resume/',
        '  ├── 📁 Photos/',
        '  ├── 📁 Notes/',
        '  └── 📁 Downloads/',
        '',
      ]);
    },
  },

  pwd: {
    description: 'Print working directory',
    handler: ({ addOutput }) => {
      addOutput(['/home/soham/Desktop']);
    },
  },

  date: {
    description: 'Show current date and time',
    handler: ({ addOutput }) => {
      addOutput([new Date().toLocaleString()]);
    },
  },

  theme: {
    description: 'Switch theme (dark/light)',
    handler: ({ args, addOutput, setTheme }) => {
      const target = args[0]?.toLowerCase();
      if (target === 'dark' || target === 'light') {
        setTheme(target);
        addOutput([`  ✓ Theme switched to ${target} mode.`]);
      } else {
        addOutput([
          '  Usage: theme <dark|light>',
          '  Example: theme dark',
        ]);
      }
    },
  },

  open: {
    description: 'Open an application',
    handler: ({ args, addOutput, openWindow }) => {
      const appName = args[0]?.toLowerCase();
      const appMap = {
        about: 'about',
        projects: 'projects',
        skills: 'skills',
        terminal: 'terminal',
        resume: 'resume',
        settings: 'settings',
        explorer: 'fileexplorer',
        files: 'fileexplorer',
      };

      if (appMap[appName]) {
        openWindow(appMap[appName]);
        addOutput([`  ✓ Opening ${appName}...`]);
      } else {
        addOutput([
          '  Usage: open <app>',
          '  Available: about, projects, skills, terminal, resume, settings, explorer',
        ]);
      }
    },
  },

  neofetch: {
    description: 'System information',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '         ╔══════════╗        soham@portfolio-os',
        '         ║  ▄▄▄▄▄▄  ║        ─────────────────',
        '         ║  ██████  ║        OS:     Portfolio OS v' + APP_VERSION,
        '         ║  ██████  ║        Host:   Browser',
        '         ║  ▀▀▀▀▀▀  ║        Kernel: React 19.1',
        '         ╚══════════╝        Shell:  PortShell v1.0',
        '                             DE:     Portfolio Desktop',
        '   ████████████████          WM:     Custom Window Manager',
        '   ████████████████          Theme:  Windows 11 Inspired',
        '                             Icons:  Emoji',
        '                             CPU:    JavaScript V8',
        '                             Memory: Zustand State',
        '',
      ]);
    },
  },

  history: {
    description: 'Show command history',
    // Special: handled directly by Terminal since it needs access to history state
    handler: ({ args, addOutput, commandHistory }) => {
      if (!commandHistory || commandHistory.length === 0) {
        addOutput(['  No commands in history.']);
        return;
      }
      const lines = commandHistory.map((cmd, i) => `  ${(i + 1).toString().padStart(4)}  ${cmd}`);
      addOutput(lines);
    },
  },

  version: {
    description: 'Show OS version',
    handler: ({ addOutput }) => {
      addOutput([
        `  ${APP_NAME} v${APP_VERSION}`,
        `  Built by ${APP_AUTHOR}`,
        `  Build: 2026.06.14`,
      ]);
    },
  },

  sysinfo: {
    description: 'Show system information',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  ╔═══════════════════════════════════════╗',
        '  ║         System Information             ║',
        '  ╠═══════════════════════════════════════╣',
        `  ║  OS:        ${APP_NAME.padEnd(25)} ║`,
        `  ║  Version:   ${APP_VERSION.padEnd(25)} ║`,
        `  ║  Author:    ${APP_AUTHOR.padEnd(25)} ║`,
        '  ║  Runtime:   React 19.1                ║',
        '  ║  Bundler:   Vite 6.0                  ║',
        '  ║  State:     Zustand 5.0               ║',
        '  ║  Animation: Framer Motion 12          ║',
        '  ║  Backend:   Express.js + JSON         ║',
        '  ╚═══════════════════════════════════════╝',
        '',
      ]);
    },
  },

  echo: {
    description: 'Print text to terminal',
    handler: ({ args, addOutput }) => {
      addOutput([args.join(' ')]);
    },
  },
};
