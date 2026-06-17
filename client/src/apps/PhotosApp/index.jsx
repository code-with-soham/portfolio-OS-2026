import { useState } from 'react';
import { ALBUMS, IMAGES } from './imageData';
import Lightbox from './Lightbox';
import './PhotosApp.css';

export default function PhotosApp() {
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredImages = activeAlbum === 'all' 
    ? IMAGES 
    : IMAGES.filter(img => img.album === activeAlbum);

  return (
    <div className="photos-app">
      {/* Sidebar / Albums */}
      <div className="photos-sidebar">
        <div className="photos-sidebar-title">Albums</div>
        {ALBUMS.map(album => (
          <div 
            key={album.id}
            className={`photos-album ${activeAlbum === album.id ? 'active' : ''}`}
            onClick={() => setActiveAlbum(album.id)}
          >
            <span>{album.icon}</span>
            <span>{album.label}</span>
          </div>
        ))}
      </div>

      {/* Gallery */}
      <div className="photos-gallery">
        <div className="photos-gallery-header">
          <div className="photos-gallery-title">
            {ALBUMS.find(a => a.id === activeAlbum)?.label}
          </div>
        </div>
        
        <div className="photos-grid">
          {filteredImages.length === 0 ? (
            <div style={{ color: '#888', gridColumn: '1 / -1' }}>
              No photos found in this album.
            </div>
          ) : (
            filteredImages.map((img, idx) => (
              <div 
                key={img.id} 
                className="photo-item"
                onClick={() => setLightboxIndex(idx)}
              >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="photo-img" 
                  loading="lazy"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <Lightbox 
          images={filteredImages} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </div>
  );
}
