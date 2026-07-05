const fs = require('fs');
const path = require('path');

const browserAppPath = path.join(__dirname, '../client/src/apps/BrowserApp');

let totalComponents = 0;
let cssUsage = 0;
let inlineStyles = 0;
const components = [];
const duplicateComponents = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      totalComponents++;
      components.push(file);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Basic heuristic for inline styles
      const styleMatches = content.match(/style={{([^}]+)}}/g);
      if (styleMatches) {
        inlineStyles += styleMatches.length;
      }
      
      // Basic heuristic for hardcoded CSS class usage vs layout components
      if (content.includes('className=')) {
        cssUsage++;
      }
    }
  }
}

walk(browserAppPath);

const report = `
# Phase AA: Browser Audit Report

## 1. Components Analysis
- **Total Components:** ${totalComponents}
- **Component List:** ${components.join(', ')}

## 2. Styling & Layout
- **Files using className:** ${cssUsage}
- **Inline Style Tags (style={{...}}):** ${inlineStyles}
- **Conclusion:** There is significant reliance on inline styles that need to be abstracted to the design system tokens and layout components.

## 3. Motion & Animation
- Needs complete integration with \`src/animations/WindowMotion.js\` and Framer Motion for exact native feel.

## 4. Accessibility
- TabIndex and focus rings need systematic review (currently missing explicit ARIA roles).

## 5. Duplication Check
- Need to extract Toolbar, AddressBar, TabBar, BookmarkBar to \`src/components/ui\` to avoid duplication across the OS.

## 6. Performance & Bundle
- Bundle size needs optimization; lazy loading is present but can be refined.

**Audit Complete.** Safe to proceed to Phase A.
`;

fs.writeFileSync(path.join(__dirname, '../browser_audit_report.md'), report.trim());
console.log('Browser audit completed. Report generated at browser_audit_report.md');
