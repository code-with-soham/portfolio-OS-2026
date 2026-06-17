import React, { useState } from 'react';
import { PlayRegular } from '@fluentui/react-icons';
import './MockDBViewer.css';

export default function MockDBViewer() {
  const [query, setQuery] = useState('SELECT * FROM projects;');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);

  const projectsTable = [
    { id: 1, project_name: 'Portfolio OS', status: 'Completed', tech_stack: 'React, Node.js' },
    { id: 2, project_name: 'AI Interview', status: 'In Progress', tech_stack: 'Next.js, OpenAI' },
    { id: 3, project_name: 'Placement Predictor', status: 'Completed', tech_stack: 'Python, Scikit-learn' }
  ];

  const skillsTable = [
    { id: 1, category: 'Frontend', name: 'React', level: 'Expert' },
    { id: 2, category: 'Frontend', name: 'Tailwind CSS', level: 'Expert' },
    { id: 3, category: 'Backend', name: 'Node.js', level: 'Advanced' },
    { id: 4, category: 'AI/ML', name: 'TensorFlow', level: 'Intermediate' }
  ];

  const achievementsTable = [
    { id: 1, date: '2026-06-01', title: 'Portfolio OS Released' },
    { id: 2, date: '2026-04-15', title: 'AI Resume Analyzer Completed' }
  ];

  const handleRun = () => {
    setIsExecuting(true);
    setResult(null);
    setTimeout(() => {
      const q = query.toLowerCase();
      if (q.includes('projects')) {
        setResult(projectsTable);
      } else if (q.includes('skills')) {
        setResult(skillsTable);
      } else if (q.includes('achievements')) {
        setResult(achievementsTable);
      } else {
        setResult([]);
      }
      setIsExecuting(false);
    }, 800 + Math.random() * 400); // add random latency
  };

  // Run initial query
  React.useEffect(() => {
    handleRun();
  }, []);

  return (
    <div className="vscode-db-viewer">
      <div className="vscode-db-query-panel">
        <div className="vscode-db-query-header">
          <span>SQL Query</span>
          <button className="vscode-db-run-btn" onClick={handleRun} disabled={isExecuting}>
            <PlayRegular fontSize={14} /> Run
          </button>
        </div>
        <textarea 
          className="vscode-db-textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="vscode-db-result-panel">
        {isExecuting ? (
          <div className="vscode-db-loading">Executing query...</div>
        ) : result ? (
          <>
            {result.length > 0 ? (
              <table className="vscode-db-table">
                <thead>
                  <tr>
                    {Object.keys(result[0]).map(key => <th key={key}>{key}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>
                          {val === 'Completed' ? <span style={{color:'#89d185'}}>{val}</span> : 
                           val === 'In Progress' ? <span style={{color:'#cca700'}}>{val}</span> : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="vscode-db-empty">0 rows returned.</div>
            )}
            <div className="vscode-db-footer">{result.length} rows returned in 804ms</div>
          </>
        ) : null}
      </div>
    </div>
  );
}
