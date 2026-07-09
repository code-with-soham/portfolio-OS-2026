import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useWindowStore } from '../../../store/useWindowStore';
import { useDesktopStore } from '../../../store/useDesktopStore';
import './ReadmeRenderer.css';

export default function ReadmeRenderer({ onOpenRecruiterView }) {
  const openWindow = useWindowStore(s => s.openWindow);
  const toggleCommandPalette = useDesktopStore(s => s.toggleCommandPalette);

  const handleTerminalCommand = (cmd) => {
    // Open terminal and maybe pass a command? 
    // For now we just open the terminal app. We could pass it as a prop if Terminal supports it.
    openWindow('terminal', { forcedCommand: cmd });
  };

  return (
    <div className="readme-container">
      <div className="readme-background" />

      <div className="readme-content">
        
        {/* Banner image from markdown prompt */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="https://www.pramukhdigital.com/wp-content/uploads/2018/07/New-PNC-Animated-Banners.gif" alt="MasterHead" style={{ width: '100%', borderRadius: '8px' }} />
        </div>

        {/* --- SLEEK DASHBOARD SECTION --- */}
        <div className="readme-hero-dashboard">
          <h1 className="readme-hero-title-neon"># Soham Kundu</h1>
          <div className="readme-hero-comment">
            <span className="comment-syntax">/**</span> Full Stack MERN Developer • AI Enthusiast • Building Portfolio OS <span className="comment-syntax">*/</span>
          </div>
          <div className="readme-hero-meta">
            West Bengal, India &nbsp;|&nbsp; Chasing Curiosity &nbsp;|&nbsp; Solving Problems
          </div>
          
          <div className="readme-actions-sleek">
            <a href="mailto:sohamkundu84@gmail.com" className="btn-primary">✉ Send Message &gt;</a>
            <a href="https://github.com/code-with-soham" target="_blank" rel="noreferrer" className="btn-secondary">
              <img src="https://skillicons.dev/icons?i=github" alt="github" style={{ width: 16, height: 16, marginRight: 8 }} /> GitHub ↗
            </a>
            <a href="https://www.linkedin.com/in/soham-kundu-b5a9a0250/" target="_blank" rel="noreferrer" className="btn-secondary">
              <img src="https://skillicons.dev/icons?i=linkedin" alt="linkedin" style={{ width: 16, height: 16, marginRight: 8 }} /> LinkedIn ↗
            </a>
            <button className="btn-terminal" onClick={() => handleTerminalCommand('whoami')}>
              <span style={{ color: '#4fd1c5' }}>&gt;_</span> whoami in terminal
            </button>
            <button className="btn-terminal" onClick={() => openWindow('resume')} style={{ borderColor: 'rgba(218, 165, 32, 0.4)', color: '#ffd700' }}>
              📄 View PDF Resume
            </button>
          </div>
        </div>

        {/* --- ABOUT --- */}
        <h2 className="section-title">## ABOUT</h2>
        <div className="readme-about-box">
          <span className="comment-text">/* B.Tech Computer Science student with hands-on experience in MERN Stack development, React.js, Node.js, and MongoDB. Strong foundation in Data Structures, OOP, DBMS, and Web Development. Specializing in AI-driven solutions and modern web applications. */</span>
        </div>

        {/* --- WORKSPACE EXPLORER --- */}
        <h2 className="section-title">## WORKSPACE EXPLORER</h2>
        <div className="explorer-grid">
          <div className="explorer-card" onClick={() => openWindow('about')}>
            <div className="card-header"><span className="icon">📄</span> profile.yml</div>
            <div className="card-desc">Profile Schema</div>
            <div className="card-cmd">↳ cat about/profile.yml</div>
          </div>
          <div className="explorer-card" onClick={() => openWindow('projects')}>
            <div className="card-header"><span className="icon">🌐</span> projects.json</div>
            <div className="card-desc">Featured Work</div>
            <div className="card-cmd">↳ ls projects/</div>
          </div>
          <div className="explorer-card" onClick={() => openWindow('skills')}>
            <div className="card-header"><span className="icon">📖</span> skills.ipynb</div>
            <div className="card-desc">Tech Stack</div>
            <div className="card-cmd">↳ jupyter skills.ipynb</div>
          </div>
          <div className="explorer-card" onClick={() => toggleCommandPalette()}>
            <div className="card-header"><span className="icon">⚙️</span> settings.json</div>
            <div className="card-desc">Command Palette</div>
            <div className="card-cmd">↳ Ctrl+Shift+P</div>
          </div>
        </div>

        {/* --- QUICK COMMANDS --- */}
        <h2 className="section-title">## QUICK COMMANDS</h2>
        <div className="commands-grid">
          <div className="command-card">
            <div className="cmd-left">
              <div className="cmd-text"><span className="prompt">&gt;_</span> whoami</div>
              <div className="cmd-desc">Display engineer profile</div>
            </div>
            <button className="run-btn" onClick={() => handleTerminalCommand('whoami')}>Run</button>
          </div>
          <div className="command-card">
            <div className="cmd-left">
              <div className="cmd-text"><span className="prompt">&gt;_</span> skills --list</div>
              <div className="cmd-desc">List technical competencies</div>
            </div>
            <button className="run-btn" onClick={() => handleTerminalCommand('skills --list')}>Run</button>
          </div>
          <div className="command-card">
            <div className="cmd-left">
              <div className="cmd-text"><span className="prompt">&gt;_</span> deploy portfolio</div>
              <div className="cmd-desc">Launch Portfolio OS</div>
            </div>
            <button className="run-btn" onClick={() => handleTerminalCommand('deploy portfolio')}>Run</button>
          </div>
          <div className="command-card">
            <div className="cmd-left">
              <div className="cmd-text"><span className="prompt">&gt;_</span> help</div>
              <div className="cmd-desc">Display all available commands</div>
            </div>
            <button className="run-btn" onClick={() => handleTerminalCommand('help')}>Run</button>
          </div>
        </div>

        {/* --- MARKDOWN CONTENT --- */}
        <div className="readme-markdown-raw">
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <img src="https://readme-typing-svg.herokuapp.com?font=Poppins&weight=600&size=25&pause=1000&color=00c6ff&center=true&vCenter=true&width=700&lines=Full+Stack+MERN+Developer;Building+Portfolio+OS+2026;AI+Powered+Projects;Always+Learning+New+Technologies" alt="Typing SVG" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <img src="https://img.shields.io/github/followers/code-with-soham?style=for-the-badge&color=00c6ff" alt="Followers" />
            <img src="https://img.shields.io/github/stars/code-with-soham?style=for-the-badge&color=00c6ff" alt="Stars" />
            <img src="https://komarev.com/ghpvc/?username=code-with-soham&style=for-the-badge&color=00c6ff" alt="Profile Views" />
            <img src="https://img.shields.io/badge/Open%20To-Internships-success?style=for-the-badge" alt="Internships" />
            <img src="https://img.shields.io/badge/Focus-Full%20Stack%20Development-blue?style=for-the-badge" alt="Focus" />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img src="https://user-images.githubusercontent.com/74038190/212897597-1e8bcb89-0d81-4f2d-90df-d7a54b4fcbbe.gif" width="400" alt="Animated Coding GIF" />
          </div>

          <h2 className="section-title">## 🎯 Current Focus (2026 Goals)</h2>
          <div className="readme-code-block">
            <pre><code>█████████░░░ 85%

✔ Portfolio OS
✔ CareerOS
✔ AI Interview Platform
⬜ Open Source
⬜ Internship
⬜ 500+ DSA Problems</code></pre>
          </div>

          <h2 className="section-title">## 🚀 Tech Stack</h2>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#58a6ff', marginBottom: '10px' }}>Frontend</h3>
            <img src="https://skillicons.dev/icons?i=react,nextjs,ts,js,html,css,tailwind,vite" alt="Frontend Skills" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#58a6ff', marginBottom: '10px' }}>Backend</h3>
            <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,postgres,mysql,firebase" alt="Backend Skills" />
          </div>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#58a6ff', marginBottom: '10px' }}>Tools</h3>
            <img src="https://skillicons.dev/icons?i=git,github,vscode,docker,postman,figma,linux" alt="Tools" />
          </div>

          <h2 className="section-title">## 📊 GitHub Stats</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2%', flexWrap: 'wrap', marginBottom: '20px' }}>
            <img style={{ width: '49%', minWidth: '300px', marginBottom: '10px' }} src="https://github-readme-stats.vercel.app/api?username=code-with-soham&show_icons=true&theme=tokyonight" alt="GitHub Stats" />
            <img style={{ width: '49%', minWidth: '300px', marginBottom: '10px' }} src="https://streak-stats.demolab.com?user=code-with-soham&theme=tokyonight" alt="GitHub Streak" />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img style={{ width: '100%', maxWidth: '800px' }} src="https://github-readme-activity-graph.vercel.app/graph?username=code-with-soham&theme=tokyo-night" alt="Activity Graph" />
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <a href="https://github.com/ryo-ma/github-profile-trophy">
              <img src="https://github-profile-trophy.vercel.app/?username=code-with-soham&theme=algolia&row=2&column=4" alt="GitHub Trophies" style={{ maxWidth: '100%' }} />
            </a>
          </div>

          <h2 className="section-title">## 💡 Random Quote</h2>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Quote" style={{ maxWidth: '100%' }} />
          </div>

          <h2 className="section-title">## 🐍 Contribution Snake</h2>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <picture>
              <source media="(prefers-color-scheme: dark)" srcSet="https://raw.githubusercontent.com/tobiasmeyhoefer/tobiasmeyhoefer/output/github-snake-dark.svg" />
              <source media="(prefers-color-scheme: light)" srcSet="https://raw.githubusercontent.com/tobiasmeyhoefer/tobiasmeyhoefer/output/github-snake.svg" />
              <img alt="github-snake" src="https://raw.githubusercontent.com/tobiasmeyhoefer/tobiasmeyhoefer/output/github-snake.svg" style={{ maxWidth: '100%' }} />
            </picture>
          </div>

        </div>
      </div>
    </div>
  );
}
