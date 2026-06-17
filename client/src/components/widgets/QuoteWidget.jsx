import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QUOTES = [
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Java is to JavaScript what car is to Carpet.", author: "Chris Heilmann" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" }
];

export default function QuoteWidget() {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Pick random quote on mount
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'linear-gradient(135deg, #0078d4, #005a9e)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '2rem', lineHeight: 1, opacity: 0.5 }}>"</span>
      <p style={{ margin: 0, fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.5 }}>
        {quote.text}
      </p>
      <div style={{ alignSelf: 'flex-end', fontSize: '0.8rem', opacity: 0.8, fontWeight: 600 }}>
        — {quote.author}
      </div>
    </motion.div>
  );
}
