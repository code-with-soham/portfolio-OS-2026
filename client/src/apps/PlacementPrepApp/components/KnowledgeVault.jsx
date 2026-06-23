import React from 'react';

export default function KnowledgeVault() {
  return (
    <div className="placement-card">
      <h2 style={{ marginTop: 0 }}>Knowledge Vault</h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Your personal local storage for Core CS, SQL, and DSA notes. 
        The AI Study Coach will ingest these notes to provide highly personalized answers.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-accent)' }}>DBMS & SQL</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <li>ACID Properties</li>
                <li>Normal Forms (1NF to BCNF)</li>
                <li>Joins (Inner, Left, Right, Outer)</li>
                <li>Indexing and B-Trees</li>
            </ul>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00c864' }}>Operating Systems</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <li>Process vs Thread</li>
                <li>Deadlocks & Mutexes</li>
                <li>Paging & Virtual Memory</li>
                <li>Scheduling Algorithms</li>
            </ul>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff8c00' }}>Object Oriented Programming</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <li>Polymorphism</li>
                <li>Inheritance Types</li>
                <li>Encapsulation & Abstraction</li>
                <li>Virtual Functions</li>
            </ul>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff3366' }}>Computer Networks</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <li>OSI Model Layers</li>
                <li>TCP vs UDP</li>
                <li>HTTP vs HTTPS</li>
                <li>DNS Resolution</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
