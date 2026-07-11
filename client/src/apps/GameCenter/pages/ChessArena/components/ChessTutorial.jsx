import React from 'react';
import { motion } from 'framer-motion';
import { BookQuestionMarkRegular, DismissRegular } from '@fluentui/react-icons';
import '../styles/chess.css'; // Uses existing overlay styles

export default function ChessTutorial({ onClose }) {
  return (
    <motion.div 
      className="result-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex: 100 }} // Ensure it's above everything
    >
      <motion.div 
        className="result-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{ width: '500px', maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto', padding: '30px', textAlign: 'left' }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}
        >
          <DismissRegular fontSize={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <BookQuestionMarkRegular fontSize={28} color="#2196f3" />
          <h2 style={{ margin: 0, color: '#fff', fontSize: '24px' }}>How to Play</h2>
        </div>

        <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>
          <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: 5 }}>Moving Pieces</h3>
          <p>
            • <b>Drag and Drop</b> a piece to its destination square.<br/>
            • <b>Or Click</b> a piece to see its legal moves (highlighted in cyan), then click a destination square.<br/>
            • <b>Castling:</b> Drag your King two squares towards the Rook you want to castle with.<br/>
            • <b>Promotion:</b> When a pawn reaches the opposite end of the board, a menu will appear to select your promotion piece.
          </p>

          <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: 5, marginTop: 20 }}>Playing against Stockfish</h3>
          <p>
            • By default, you play White (at the bottom) and the AI (Stockfish) plays Black.<br/>
            • The AI has various personalities (Beginner, Casual, Master) that dictate its skill level.<br/>
            • If you make a move and it snaps back, it means the move is illegal (e.g. your King is in check).
          </p>

          <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: 5, marginTop: 20 }}>Analysis Board</h3>
          <p>
            • Once the game is over, click <b>Analysis Board</b> to review your mistakes.<br/>
            • The engine will classify every move (Brilliant, Blunder, etc.) and generate an interactive accuracy graph!
          </p>
        </div>

        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="result-btn primary" onClick={onClose}>Got it, Let's Play!</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
