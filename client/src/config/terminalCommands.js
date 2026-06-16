// ============================================
// Portfolio OS 2026 — Terminal Command Registry
// ============================================
// Extensible command map for the Terminal app.
// Each command has a description and handler function.
// Handlers receive { args, addOutput, clearOutput, openWindow, setTheme, cwd, setCwd }

import { fetchHelpCommands } from '../services/terminalService';
import { APP_NAME, APP_VERSION, APP_AUTHOR } from '../constants';
import { FILE_SYSTEM, resolveNode } from '../data/fileSystem';

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
    handler: async ({ addOutput }) => {
      try {
        const lines = await fetchHelpCommands();
        if (lines && lines.length > 0) {
          addOutput(lines);
        } else {
          addOutput([
            '  Failed to fetch help commands from the backend.',
            '  Please ensure the server is running.'
          ]);
        }
      } catch (error) {
        addOutput(['  An error occurred while fetching commands.']);
      }
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
      addOutput([`  soham@portfolio-os`]);
    },
  },

  specs: {
    description: 'Display system specs',
    handler: ({ addOutput }) => TERMINAL_COMMANDS.sysinfo.handler({ addOutput })
  },
  
  education: {
    description: 'Show educational background',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  🎓 Education',
        '  ─────────────────────────────────',
        '  B.Tech in Computer Science & Engineering',
        '  UEM Kolkata (2022 - 2026)',
        '  CGPA: 9.0/10.0',
        ''
      ]);
    }
  },

  experience: {
    description: 'Display professional experience',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  💼 Experience',
        '  ─────────────────────────────────',
        '  Full Stack Developer Intern @ TechCorp (2025)',
        '  - Built scalable REST APIs',
        '  - Optimized React frontends',
        ''
      ]);
    }
  },

  research: {
    description: 'List research papers',
    handler: ({ addOutput }) => {
      addOutput(['  No published research papers currently. Check back later!']);
    }
  },

  profile: {
    description: 'Full profile overview',
    handler: ({ addOutput }) => TERMINAL_COMMANDS.about.handler({ addOutput })
  },

  stats: {
    description: 'Portfolio statistics dashboard',
    handler: ({ addOutput }) => {
      addOutput([
        '',
        '  📊 Portfolio Statistics',
        '  ─────────────────────────────────',
        '  Github Commits: 1,204',
        '  Coffee Consumed: 342 cups',
        '  Bugs Squashed: 99+',
        ''
      ]);
    }
  },

  tech: {
    description: 'Browse technology stack',
    handler: ({ addOutput }) => TERMINAL_COMMANDS.skills.handler({ addOutput })
  },

  inspect: {
    description: 'Fetch metadata of a tech node',
    handler: ({ args, addOutput }) => {
      if (!args[0]) return addOutput(['  Usage: inspect <node_id>']);
      addOutput([`  🔍 Inspecting ${args[0]}...`, `  Status: Operational`, `  Version: Latest`]);
    }
  },

  cat_manifest: {
    description: 'Dump complete skills layout as JSON',
    handler: ({ addOutput }) => {
      addOutput(['  { "status": "access_denied", "reason": "Manifest is classified." }']);
    }
  },

  diagnose: {
    description: 'Run comprehensive system check',
    handler: ({ addOutput }) => {
      addOutput([
        '  [OK] CPU checks passed.',
        '  [OK] Memory integrity verified.',
        '  [OK] Network latency: 12ms',
        '  [OK] All systems go.'
      ]);
    }
  },

  trace: {
    description: 'Trace dependency connections',
    handler: ({ addOutput }) => {
      addOutput([
        '  Tracing route to target...',
        '  1  192.168.1.1  2ms',
        '  2  10.0.0.1     15ms',
        '  3  portfolio.os 24ms',
        '  Trace complete.'
      ]);
    }
  },

  sqlite3: {
    description: 'Run SQL queries',
    handler: ({ args, addOutput }) => {
      addOutput(['  Connected to portfolio.db', '  Result: 0 rows returned.']);
    }
  },

  python: {
    description: 'Execute python script',
    handler: ({ args, addOutput }) => {
      addOutput(['  Python environment active.', `  Executing ${args[0] || 'script'}...`, '  Done.']);
    }
  },

  ls: {
    description: 'List directory contents',
    handler: ({ args, addOutput, cwd }) => {
      const node = resolveNode(cwd);
      if (!node || node.type !== 'folder') {
        return addOutput([`  ls: cannot access '${cwd.join('/')}': No such directory`]);
      }
      
      if (!node.children || node.children.length === 0) {
        return; // Empty directory
      }

      const lines = ['', '  ' + node.children.map(c => c.type === 'folder' ? `📁 ${c.name}/` : `📄 ${c.name}`).join('    '), ''];
      addOutput(lines);
    },
  },

  dir: {
    description: 'List directory contents',
    handler: (ctx) => TERMINAL_COMMANDS.ls.handler(ctx)
  },

  cd: {
    description: 'Change directory',
    handler: ({ args, addOutput, cwd, setCwd }) => {
      if (!args[0] || args[0] === '~') {
        setCwd([]);
        return;
      }

      const pathArg = args[0];
      if (pathArg === '.') return;
      if (pathArg === '..') {
        if (cwd.length > 0) {
          setCwd(cwd.slice(0, -1));
        }
        return;
      }

      // Very basic relative path resolution (only 1 level deep for simplicity)
      const currentNode = resolveNode(cwd);
      if (!currentNode || !currentNode.children) {
        return addOutput([`  cd: ${pathArg}: No such file or directory`]);
      }

      const target = currentNode.children.find(c => c.name.toLowerCase() === pathArg.toLowerCase() || c.name.toLowerCase() === pathArg.toLowerCase().replace('/', ''));
      
      if (!target) {
        return addOutput([`  cd: ${pathArg}: No such file or directory`]);
      }

      if (target.type !== 'folder') {
        return addOutput([`  cd: ${pathArg}: Not a directory`]);
      }

      setCwd([...cwd, target.name]);
    }
  },

  cat: {
    description: 'Display file contents',
    handler: ({ args, addOutput, cwd }) => {
      if (!args[0]) return addOutput(['  Usage: cat <file>']);
      
      const fileName = args[0];
      const currentNode = resolveNode(cwd);
      
      if (!currentNode || !currentNode.children) {
        return addOutput([`  cat: ${fileName}: No such file or directory`]);
      }

      const target = currentNode.children.find(c => c.name.toLowerCase() === fileName.toLowerCase());
      
      if (!target) {
        return addOutput([`  cat: ${fileName}: No such file or directory`]);
      }

      if (target.type === 'folder') {
        return addOutput([`  cat: ${fileName}: Is a directory`]);
      }

      if (target.content) {
        addOutput(['', ...target.content.split('\n').map(line => `  ${line}`), '']);
      } else {
        addOutput([`  [Binary file or no text content: ${fileName}]`]);
      }
    }
  },

  pwd: {
    description: 'Print working directory',
    handler: ({ addOutput, cwd }) => {
      const path = cwd.length > 0 ? `/home/soham/${cwd.join('/')}` : '/home/soham';
      addOutput([`  ${path}`]);
    },
  },

  'git': {
    description: 'Show virtual git status',
    handler: ({ args, addOutput }) => {
      if (args[0] === 'status') {
        addOutput([
          '  On branch main',
          '  Your branch is up to date with "origin/main".',
          '',
          '  nothing to commit, working tree clean'
        ]);
      } else {
        addOutput(['  Usage: git status']);
      }
    }
  },

  curl: {
    description: 'Simulate API calls',
    handler: ({ args, addOutput }) => {
      if (!args[0]) return addOutput(['  curl: try \'curl --help\' or \'curl --manual\' for more information']);
      addOutput([`  Fetching ${args[0]}...`, '  200 OK', '  { "message": "Success" }']);
    }
  },

  secrets: {
    description: 'Display classified metrics',
    handler: ({ addOutput }) => {
      addOutput([
        '  ACCESS GRANTED',
        '  [CLASSIFIED] Over-engineering score: 99%',
        '  [CLASSIFIED] Sleep deprivation level: Critical'
      ]);
    }
  },

  run: {
    description: 'Execute simulation',
    handler: ({ args, addOutput }) => {
      addOutput([`  Initiating simulation: ${args[0] || 'default'}...`, '  Simulation complete. Reality remains intact.']);
    }
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
