import { useMusicStore } from '../../../store/useMusicStore';
import Visualizer from './Visualizer';

export default function Player() {
  const { playlist, currentSongIndex, audioElement } = useMusicStore();
  
  if (!playlist || playlist.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary, #a0a0a0)' }}>Playlist is empty</p>
      </div>
    );
  }

  const currentSong = playlist[currentSongIndex];

  return (
    <>
      <img 
        src={currentSong.cover} 
        alt={currentSong.title} 
        className="album-art-large"
        draggable={false}
      />

      <div className="visualizer-container">
        <Visualizer audioElement={audioElement} />
      </div>
    </>
  );
}
