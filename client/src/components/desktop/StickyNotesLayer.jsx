import { motion } from 'framer-motion';
import { useStickyNotesStore } from '../../store/useStickyNotesStore';

const COLORS = [
  { label: 'Yellow', value: '#fff2ab' },
  { label: 'Green', value: '#c5f2b8' },
  { label: 'Blue', value: '#bcebf5' },
  { label: 'Pink', value: '#fcdce8' },
  { label: 'Purple', value: '#e2d3fc' }
];

function StickyNote({ note }) {
  const { updateNote, deleteNote, bringToFront } = useStickyNotesStore();

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => bringToFront(note.id)}
      onDragEnd={(event, info) => {
        updateNote(note.id, { x: note.x + info.offset.x, y: note.y + info.offset.y });
      }}
      initial={{ x: note.x, y: note.y, opacity: 0, scale: 0.9 }}
      animate={{ x: note.x, y: note.y, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: note.width,
        height: note.height,
        background: note.color,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: note.zIndex,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
      }}
      onPointerDown={() => bringToFront(note.id)}
    >
      {/* Header (Drag handle) */}
      <div 
        className="sticky-note-header"
        style={{
          height: '24px',
          background: 'rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px',
          cursor: 'grab'
        }}
      >
        <div style={{ display: 'flex', gap: '4px', paddingLeft: '4px' }}>
          {COLORS.map(c => (
            <div
              key={c.value}
              onClick={() => updateNote(note.id, { color: c.value })}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: c.value,
                cursor: 'pointer',
                border: note.color === c.value ? '2px solid rgba(0,0,0,0.5)' : '1px solid rgba(0,0,0,0.2)'
              }}
            />
          ))}
        </div>
        <button 
          onClick={() => deleteNote(note.id)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <textarea
        value={note.text}
        onChange={(e) => updateNote(note.id, { text: e.target.value })}
        placeholder="Type a note..."
        style={{
          flex: 1,
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '12px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: '14px',
          color: '#222'
        }}
      />
    </motion.div>
  );
}

export default function StickyNotesLayer() {
  const notes = useStickyNotesStore((s) => s.notes);

  return (
    <>
      {notes.map(note => (
        <StickyNote key={note.id} note={note} />
      ))}
    </>
  );
}
