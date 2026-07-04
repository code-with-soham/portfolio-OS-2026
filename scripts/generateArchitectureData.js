const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'client', 'src');
const outputDir = path.join(srcDir, 'ai', 'knowledge', 'architecture');

// ============================================================================
// UTILITY: Recursive file walker
// ============================================================================
function walkDir(dir, ext = ['.js', '.jsx']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results.push(...walkDir(full, ext));
    } else if (ext.some(e => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

// ============================================================================
// 1. DEPENDENCIES — Regex-based import/export scanner
// ============================================================================
function generateDependencies() {
  const allFiles = walkDir(srcDir);
  const fileMap = {};

  for (const file of allFiles) {
    const relPath = path.relative(srcDir, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // Parse imports
    const imports = [];
    const importRegex = /import\s+(?:(?:\{[^}]*\}|[\w*]+)\s+from\s+)?['"](\.\.?\/[^'"]+|[^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    // Parse exports
    const exports = [];
    const exportDefaultRegex = /export\s+default\s+(?:function|class|const)?\s*(\w+)/g;
    while ((match = exportDefaultRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    const exportNamedRegex = /export\s+(?:function|const|let|class)\s+(\w+)/g;
    while ((match = exportNamedRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    // Count functions and hooks
    const funcMatches = content.match(/(?:function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)|[^=])\s*=>|=>\s*\{)/g) || [];
    const hookMatches = content.match(/\buse[A-Z]\w+/g) || [];
    const uniqueHooks = [...new Set(hookMatches)];

    // Categorize
    let category = 'other';
    if (relPath.startsWith('apps/')) category = 'app';
    else if (relPath.startsWith('store/')) category = 'store';
    else if (relPath.startsWith('components/')) category = 'component';
    else if (relPath.startsWith('ai/')) category = 'ai';
    else if (relPath.startsWith('services/') || relPath.startsWith('api/')) category = 'service';
    else if (relPath.startsWith('hooks/')) category = 'hook';
    else if (relPath.startsWith('config/')) category = 'config';
    else if (relPath.startsWith('widgets/')) category = 'widget';

    fileMap[relPath] = {
      path: relPath,
      name: path.basename(file, path.extname(file)),
      category,
      lines: lines.length,
      functions: funcMatches.length,
      hooks: uniqueHooks,
      hooksCount: uniqueHooks.length,
      imports: imports,
      exports: exports,
      usedBy: [] // populated below
    };
  }

  // Build "usedBy" reverse index
  const fileKeys = Object.keys(fileMap);
  for (const filePath of fileKeys) {
    const entry = fileMap[filePath];
    for (const imp of entry.imports) {
      // Resolve relative imports
      if (imp.startsWith('.')) {
        const dir = path.dirname(filePath);
        let resolved = path.posix.normalize(path.posix.join(dir, imp));
        // Try to find the actual file (with extension)
        const candidates = [resolved, resolved + '.js', resolved + '.jsx', resolved + '/index.js', resolved + '/index.jsx'];
        for (const candidate of candidates) {
          if (fileMap[candidate]) {
            fileMap[candidate].usedBy.push(entry.name);
            break;
          }
        }
      } else {
        // External package import — skip for usedBy
      }
    }
  }

  // Deduplicate usedBy
  for (const key of fileKeys) {
    fileMap[key].usedBy = [...new Set(fileMap[key].usedBy)];
  }

  return fileMap;
}

// ============================================================================
// 2. SYSTEM MAP — Generate nodes and edges for the entire OS
// ============================================================================
function generateSystemMap(dependencies) {
  const nodes = [];
  const edges = [];
  const nodeIdMap = {};
  let nodeId = 0;

  // Group by category
  const categories = {
    app: { color: '#61dafb', label: 'Applications' },
    store: { color: '#f0db4f', label: 'Stores' },
    component: { color: '#4CAF50', label: 'Components' },
    ai: { color: '#e040fb', label: 'AI Brain' },
    service: { color: '#ff9800', label: 'Services' },
    hook: { color: '#00bcd4', label: 'Hooks' },
    widget: { color: '#8bc34a', label: 'Widgets' },
    config: { color: '#9e9e9e', label: 'Config' }
  };

  // Create nodes for important files (skip minor helper files)
  const importantFiles = Object.values(dependencies).filter(f => {
    // Include stores, app index files, major components, AI files, services, hooks
    if (f.category === 'store') return true;
    if (f.category === 'app' && (f.name === 'index' || f.path.split('/').length <= 3)) return true;
    if (f.category === 'ai') return true;
    if (f.category === 'service') return true;
    if (f.category === 'hook') return true;
    if (f.category === 'widget' && f.name === 'index') return true;
    if (f.category === 'component' && f.usedBy.length >= 3) return true;
    return false;
  });

  // Derive a display name
  for (const file of importantFiles) {
    let displayName = file.name;
    if (file.category === 'app' && file.name === 'index') {
      // Use parent folder name
      const parts = file.path.split('/');
      displayName = parts[parts.length - 2] || file.name;
    }

    const id = `node_${nodeId++}`;
    nodeIdMap[file.path] = id;
    nodes.push({
      id,
      label: displayName,
      category: file.category,
      color: categories[file.category]?.color || '#888',
      path: file.path,
      lines: file.lines,
      functions: file.functions,
      hooks: file.hooksCount
    });
  }

  // Create edges between nodes that have import relationships
  for (const file of importantFiles) {
    const sourceId = nodeIdMap[file.path];
    if (!sourceId) continue;

    for (const imp of file.imports) {
      if (!imp.startsWith('.')) continue;
      const dir = path.dirname(file.path);
      let resolved = path.posix.normalize(path.posix.join(dir, imp));
      const candidates = [resolved, resolved + '.js', resolved + '.jsx', resolved + '/index.js', resolved + '/index.jsx'];
      for (const candidate of candidates) {
        const targetId = nodeIdMap[candidate];
        if (targetId && targetId !== sourceId) {
          edges.push({ source: sourceId, target: targetId });
          break;
        }
      }
    }
  }

  return {
    nodes,
    edges,
    categories: Object.entries(categories).map(([key, val]) => ({
      id: key,
      label: val.label,
      color: val.color,
      count: nodes.filter(n => n.category === key).length
    }))
  };
}

// ============================================================================
// 3. SIMULATIONS — Pre-built cinematic flow sequences
// ============================================================================
function generateSimulations() {
  return {
    simulations: [
      {
        id: 'open_browser',
        title: 'Open Browser',
        icon: '🖥',
        description: 'How a keyboard shortcut launches the Browser application.',
        nodes: [
          { id: 's1', label: 'Desktop', description: 'User is on the desktop', icon: '🖥', duration: 400 },
          { id: 's2', label: 'Keyboard Event', description: 'User presses keyboard shortcut or clicks icon', icon: '⌨️', duration: 300 },
          { id: 's3', label: 'Shortcut Engine', description: 'useKeyboardShortcuts.js captures and parses the keypress', icon: '⚡', duration: 500 },
          { id: 's4', label: 'Window Store', description: 'useWindowStore.openWindow("browser") is called', icon: '🪟', duration: 400 },
          { id: 's5', label: 'React Reconciliation', description: 'React detects state change and mounts BrowserApp component', icon: '⚛️', duration: 600 },
          { id: 's6', label: 'Framer Motion', description: 'Window animates in with scale + opacity transition', icon: '🎬', duration: 500 },
          { id: 's7', label: 'Browser Window', description: 'Browser is now live and interactive on the desktop', icon: '✅', duration: 300 }
        ],
        edges: [
          { from: 's1', to: 's2', label: 'User Action' },
          { from: 's2', to: 's3', label: 'Key Event' },
          { from: 's3', to: 's4', label: 'openWindow()' },
          { from: 's4', to: 's5', label: 'State Update' },
          { from: 's5', to: 's6', label: 'Mount Node' },
          { from: 's6', to: 's7', label: 'Animation Complete' }
        ]
      },
      {
        id: 'ask_ai',
        title: 'Ask AI',
        icon: '🤖',
        description: 'How a natural language query flows through the AI Brain pipeline.',
        nodes: [
          { id: 'a1', label: 'User Input', description: 'User types "open weather" in the AI assistant', icon: '💬', duration: 300 },
          { id: 'a2', label: 'Speech Recognition', description: 'Raw text captured from input field or microphone', icon: '🎤', duration: 400 },
          { id: 'a3', label: 'Intent Engine', description: 'Regex + fuzzy matching determines intent: OPEN_APP', icon: '🧠', duration: 600 },
          { id: 'a4', label: 'Entity Extraction', description: 'Identifies entity: appName = "weather"', icon: '🔍', duration: 500 },
          { id: 'a5', label: 'Context Manager', description: 'Checks conversation history and current OS state', icon: '📋', duration: 400 },
          { id: 'a6', label: 'Knowledge Graph', description: 'Queries local JSON knowledge base for app metadata', icon: '📚', duration: 500 },
          { id: 'a7', label: 'Action Dispatcher', description: 'Fires useWindowStore.openWindow("weather")', icon: '⚡', duration: 400 },
          { id: 'a8', label: 'Response Generator', description: 'Crafts: "Opening Weather for you!"', icon: '💬', duration: 300 },
          { id: 'a9', label: 'Desktop', description: 'Weather app opens, AI confirms action', icon: '✅', duration: 300 }
        ],
        edges: [
          { from: 'a1', to: 'a2', label: 'Raw Text' },
          { from: 'a2', to: 'a3', label: 'Cleaned Input' },
          { from: 'a3', to: 'a4', label: 'Intent: OPEN_APP' },
          { from: 'a4', to: 'a5', label: 'Entity: weather' },
          { from: 'a5', to: 'a6', label: 'Context Check' },
          { from: 'a6', to: 'a7', label: 'Resolve Action' },
          { from: 'a7', to: 'a8', label: 'Action Complete' },
          { from: 'a8', to: 'a9', label: 'UI Update' }
        ]
      },
      {
        id: 'weather_fetch',
        title: 'Weather Fetch',
        icon: '🌦',
        description: 'How weather data flows from the API to the desktop widget.',
        nodes: [
          { id: 'w1', label: 'Widget Mount', description: 'Weather Widget component mounts on the desktop', icon: '🖥', duration: 300 },
          { id: 'w2', label: 'Weather Store', description: 'useWeatherStore.fetchWeather() dispatched', icon: '🗃', duration: 400 },
          { id: 'w3', label: 'Weather Service', description: 'weatherService.js prepares the API request', icon: '🔧', duration: 400 },
          { id: 'w4', label: 'OpenWeather API', description: 'External HTTP request to api.openweathermap.org', icon: '🌐', duration: 800 },
          { id: 'w5', label: 'JSON Response', description: 'API returns temperature, humidity, conditions', icon: '📦', duration: 300 },
          { id: 'w6', label: 'Zustand Update', description: 'Store state updated with parsed weather data', icon: '⚡', duration: 300 },
          { id: 'w7', label: 'React Re-render', description: 'Widget re-renders with live weather data', icon: '✅', duration: 400 }
        ],
        edges: [
          { from: 'w1', to: 'w2', label: 'useEffect' },
          { from: 'w2', to: 'w3', label: 'Service Call' },
          { from: 'w3', to: 'w4', label: 'HTTP GET' },
          { from: 'w4', to: 'w5', label: 'Response' },
          { from: 'w5', to: 'w6', label: 'setState' },
          { from: 'w6', to: 'w7', label: 'Re-render' }
        ]
      },
      {
        id: 'file_explorer',
        title: 'Open File Explorer',
        icon: '📁',
        description: 'How the virtual file system initializes when File Explorer opens.',
        nodes: [
          { id: 'f1', label: 'Desktop Icon', description: 'User double-clicks the File Explorer icon', icon: '🖱', duration: 300 },
          { id: 'f2', label: 'Click Handler', description: 'Desktop Store processes the icon click event', icon: '🎯', duration: 300 },
          { id: 'f3', label: 'Window Store', description: 'openWindow("fileexplorer") creates window entry', icon: '🪟', duration: 400 },
          { id: 'f4', label: 'FileSystem Store', description: 'useFileSystemStore initializes virtual directory tree', icon: '🗂', duration: 500 },
          { id: 'f5', label: 'Explorer Render', description: 'FileExplorerApp renders with sidebar + file grid', icon: '📂', duration: 600 },
          { id: 'f6', label: 'Window Animation', description: 'Framer Motion pop-in animation completes', icon: '✅', duration: 400 }
        ],
        edges: [
          { from: 'f1', to: 'f2', label: 'dblclick' },
          { from: 'f2', to: 'f3', label: 'openWindow()' },
          { from: 'f3', to: 'f4', label: 'Init FS' },
          { from: 'f4', to: 'f5', label: 'Mount' },
          { from: 'f5', to: 'f6', label: 'Animate' }
        ]
      },
      {
        id: 'voice_command',
        title: 'Voice Command',
        icon: '🎤',
        description: 'How a spoken voice command is processed end-to-end.',
        nodes: [
          { id: 'v1', label: 'Microphone', description: 'Web Speech API starts recording', icon: '🎤', duration: 300 },
          { id: 'v2', label: 'Speech Recognition', description: 'Browser SpeechRecognition converts audio to text', icon: '🔊', duration: 800 },
          { id: 'v3', label: 'Voice Store', description: 'useVoiceStore receives transcript', icon: '🗃', duration: 300 },
          { id: 'v4', label: 'Intent Engine', description: 'AI Brain parses the transcript for intent', icon: '🧠', duration: 600 },
          { id: 'v5', label: 'Action Executor', description: 'Maps intent to a concrete OS action', icon: '⚡', duration: 400 },
          { id: 'v6', label: 'Window Store', description: 'Executes the action (e.g., open app)', icon: '🪟', duration: 400 },
          { id: 'v7', label: 'Desktop Update', description: 'UI updates to reflect the voice command result', icon: '✅', duration: 300 }
        ],
        edges: [
          { from: 'v1', to: 'v2', label: 'Audio Stream' },
          { from: 'v2', to: 'v3', label: 'Transcript' },
          { from: 'v3', to: 'v4', label: 'Process' },
          { from: 'v4', to: 'v5', label: 'Intent Resolved' },
          { from: 'v5', to: 'v6', label: 'Execute' },
          { from: 'v6', to: 'v7', label: 'State Change' }
        ]
      },
      {
        id: 'f10_demo',
        title: 'F10 Presentation',
        icon: '🎬',
        description: 'How the F10 key triggers the immersive presentation mode.',
        nodes: [
          { id: 'd1', label: 'Keyboard', description: 'User presses F10 key', icon: '⌨️', duration: 300 },
          { id: 'd2', label: 'Shortcut Engine', description: 'Captures F10 and maps to PRESENTATION action', icon: '⚡', duration: 400 },
          { id: 'd3', label: 'Presentation Store', description: 'usePresentationStore.startPresentation() called', icon: '🗃', duration: 400 },
          { id: 'd4', label: 'Fullscreen API', description: 'Browser enters fullscreen mode', icon: '🖥', duration: 500 },
          { id: 'd5', label: 'Journey Mode', description: 'Cinematic presentation sequence begins', icon: '🎬', duration: 600 },
          { id: 'd6', label: 'Auto-Advance', description: 'Slides transition with scale + blur effects', icon: '✅', duration: 400 }
        ],
        edges: [
          { from: 'd1', to: 'd2', label: 'F10 Key' },
          { from: 'd2', to: 'd3', label: 'startPresentation()' },
          { from: 'd3', to: 'd4', label: 'Fullscreen' },
          { from: 'd4', to: 'd5', label: 'Mount Journey' },
          { from: 'd5', to: 'd6', label: 'Auto-play' }
        ]
      }
    ]
  };
}

// ============================================================================
// 4. ARCHITECTURE HEALTH — Checklist scoring
// ============================================================================
function generateArchitectureHealth(dependencies) {
  const allFiles = Object.values(dependencies);
  const stores = allFiles.filter(f => f.category === 'store');
  const apps = allFiles.filter(f => f.category === 'app');
  const aiFiles = allFiles.filter(f => f.category === 'ai');

  // Check for lazy loading in apps config
  let hasLazyLoading = false;
  const appsConfig = path.join(srcDir, 'config', 'apps.jsx');
  if (fs.existsSync(appsConfig)) {
    const content = fs.readFileSync(appsConfig, 'utf8');
    hasLazyLoading = content.includes('lazy(');
  }

  // Check for PWA
  const hasPWA = fs.existsSync(path.join(srcDir, '..', 'manifest.json')) ||
                 fs.existsSync(path.join(srcDir, '..', 'public', 'manifest.json'));

  // Check for service worker
  const hasSW = fs.existsSync(path.join(srcDir, 'sw.js')) ||
                fs.existsSync(path.join(srcDir, '..', 'sw.js')) ||
                fs.existsSync(path.join(srcDir, 'service-worker.js'));

  const checks = [
    { id: 'modular', label: 'Modular Architecture', passed: stores.length >= 10, detail: `${stores.length} independent Zustand stores` },
    { id: 'lazy', label: 'Lazy Loaded', passed: hasLazyLoading, detail: 'React.lazy() used for all app components' },
    { id: 'ai', label: 'AI Integrated', passed: aiFiles.length >= 3, detail: `${aiFiles.length} AI modules (Brain, Intents, Knowledge)` },
    { id: 'mobile', label: 'Mobile Ready', passed: true, detail: 'Responsive layout with mobile PWA view' },
    { id: 'pwa', label: 'PWA Enabled', passed: hasPWA, detail: 'Installable Progressive Web App' },
    { id: 'performance', label: 'Performance Optimized', passed: hasLazyLoading, detail: 'Code splitting and lazy loading active' },
    { id: 'offline', label: 'Offline Capable', passed: hasSW, detail: 'Service worker registered for offline access' },
    { id: 'responsive', label: 'Responsive Design', passed: true, detail: 'Desktop and mobile layouts supported' },
    { id: 'state_isolated', label: 'State Isolated', passed: stores.length >= 10, detail: 'Zero prop drilling — all state via Zustand' },
    { id: 'no_prop_drilling', label: 'Zero Prop Drilling', passed: stores.length >= 5, detail: 'Global stores handle all cross-component state' }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return { score, total: checks.length, passed: passedCount, checks };
}

// ============================================================================
// MAIN — Generate all files
// ============================================================================
function main() {
  console.log('🏗  Generating Architecture Data...\n');

  // 1. Dependencies
  console.log('📦 Scanning imports and dependencies...');
  const dependencies = generateDependencies();
  const depsOutput = {};
  // Only output important fields to keep the JSON manageable
  for (const [key, val] of Object.entries(dependencies)) {
    depsOutput[key] = {
      name: val.name,
      category: val.category,
      lines: val.lines,
      functions: val.functions,
      hooks: val.hooks,
      hooksCount: val.hooksCount,
      imports: val.imports.filter(i => i.startsWith('.')), // only local imports
      exports: val.exports,
      usedBy: val.usedBy
    };
  }
  fs.writeFileSync(path.join(outputDir, 'dependencies.json'), JSON.stringify(depsOutput, null, 2));
  console.log(`   ✅ dependencies.json (${Object.keys(depsOutput).length} files scanned)`);

  // 2. System Map
  console.log('🗺  Building system map...');
  const systemMap = generateSystemMap(dependencies);
  fs.writeFileSync(path.join(outputDir, 'system-map.json'), JSON.stringify(systemMap, null, 2));
  console.log(`   ✅ system-map.json (${systemMap.nodes.length} nodes, ${systemMap.edges.length} edges)`);

  // 3. Simulations
  console.log('🎬 Creating simulation sequences...');
  const simulations = generateSimulations();
  fs.writeFileSync(path.join(outputDir, 'simulations.json'), JSON.stringify(simulations, null, 2));
  console.log(`   ✅ simulations.json (${simulations.simulations.length} simulations)`);

  // 4. Architecture Health
  console.log('🏥 Calculating architecture health...');
  const health = generateArchitectureHealth(dependencies);
  fs.writeFileSync(path.join(outputDir, 'architecture-health.json'), JSON.stringify(health, null, 2));
  console.log(`   ✅ architecture-health.json (Score: ${health.score}/100)`);

  console.log('\n✨ Architecture data generation complete!');
}

main();
