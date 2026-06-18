import { useState, useEffect, useRef } from 'react';
import { 
  DismissRegular, 
  ZoomInRegular, 
  ZoomOutRegular, 
  PlayRegular, 
  PauseRegular,
  ChevronLeftRegular,
  ChevronRightRegular
} from '@fluentui/react-icons';

export default function Lightbox({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalSec, setIntervalSec] = useState(5);
  const timerRef = useRef(null);

  const currentImage = images[currentIndex];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
    setZoom(1);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setZoom(1);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, intervalSec * 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, intervalSec, images.length]);

  // Keyboard Shortcuts (Ctrl+, Ctrl-, Arrows)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }

      // Zoom shortcuts (Ctrl + and Ctrl -)
      if (e.ctrlKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-header" onClick={e => e.stopPropagation()}>
        <div className="lightbox-title">{currentImage.title}</div>
        
        <div className="lightbox-toolbar">
          <button className="lightbox-btn" onClick={handleZoomOut} title="Zoom Out (Ctrl -)">
            <ZoomOutRegular />
          </button>
          <span style={{fontSize: '12px'}}>{Math.round(zoom * 100)}%</span>
          <button className="lightbox-btn" onClick={handleZoomIn} title="Zoom In (Ctrl +)">
            <ZoomInRegular />
          </button>
          
          <div style={{width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 8px'}} />
          
          <select 
            className="lightbox-select" 
            value={intervalSec} 
            onChange={(e) => setIntervalSec(Number(e.target.value))}
          >
            <option value={5}>5 sec</option>
            <option value={10}>10 sec</option>
            <option value={30}>30 sec</option>
          </select>
          
          <button 
            className={`lightbox-btn ${isPlaying ? 'active' : ''}`} 
            onClick={() => setIsPlaying(!isPlaying)}
            title="Slideshow"
          >
            {isPlaying ? <PauseRegular /> : <PlayRegular />}
          </button>
          
          <button className="lightbox-btn" onClick={onClose} style={{marginLeft: '16px'}}>
            <DismissRegular />
          </button>
        </div>
      </div>

      <div className="lightbox-content">
        <button 
          className="lightbox-nav-btn prev" 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        >
          <ChevronLeftRegular fontSize={24} />
        </button>
        
        <div className="lightbox-img-container" onClick={e => e.stopPropagation()}>
          <img 
            src={currentImage.src} 
            alt={currentImage.title} 
            className="lightbox-img"
            loading="lazy"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>

        <button 
          className="lightbox-nav-btn next" 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
        >
          <ChevronRightRegular fontSize={24} />
        </button>
      </div>
      
      <div className="lightbox-footer" onClick={e => e.stopPropagation()}>
        {currentIndex + 1} of {images.length} • {currentImage.date}
      </div>
    </div>
  );
}
