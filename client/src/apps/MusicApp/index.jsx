import { useEffect, useRef, useState } from 'react';
import { useMusicStore } from '../../store/useMusicStore';
import { playlist as initialPlaylist } from './data/playlist';
import { useSystemAudioStore } from '../../store/useSystemAudioStore';
import Player from './components/Player';
import Playlist from './components/Playlist';
import Controls from './components/Controls';
import './MusicApp.css';
import { PlayRegular, PauseRegular, PreviousRegular, NextRegular, PanelRightContractRegular, PanelRightExpandRegular } from '@fluentui/react-icons';

export default function MusicApp() {
  const audioRef = useRef(null);
  const [isMiniMode, setIsMiniMode] = useState(false);
  const { 
    setPlaylist, 
    setAudioElement, 
    playlist, 
    currentSongIndex, 
    isPlaying, 
    setProgress, 
    setDuration,
    nextSong,
    prevSong,
    togglePlayPause
  } = useMusicStore();
  
  const { volume, isMuted } = useSystemAudioStore();

  // Initialize store with playlist and audio element
  useEffect(() => {
    // Only set if not already set, or just overwrite (it's safe)
    setPlaylist(initialPlaylist);
    
    if (audioRef.current) {
      setAudioElement(audioRef.current);
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, []);

  // Handle play/pause sync with global state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Need to catch promise to avoid unhandled rejection if user hasn't interacted
        audioRef.current.play().catch(e => {
          console.warn("Autoplay prevented or interrupted:", e);
          // Might want to sync state back to paused if play fails
          // useMusicStore.getState().togglePlayPause();
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Media Session API
  useEffect(() => {
    const currentSong = playlist[currentSongIndex];
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: 'Portfolio OS',
        artwork: [
          { src: currentSong.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '128x128', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '192x192', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '256x256', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '384x384', type: 'image/jpeg' },
          { src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', togglePlayPause);
      navigator.mediaSession.setActionHandler('pause', togglePlayPause);
      navigator.mediaSession.setActionHandler('previoustrack', prevSong);
      navigator.mediaSession.setActionHandler('nexttrack', nextSong);
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.fastSeek && 'fastSeek' in audioRef.current) {
          audioRef.current.fastSeek(details.seekTime);
        } else if (audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setProgress(details.seekTime);
        }
      });
    }
  }, [currentSongIndex, playlist, togglePlayPause, prevSong, nextSong, setProgress]);

  // Audio Event Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    nextSong();
  };

  const currentSong = playlist[currentSongIndex];

  if (isMiniMode) {
    return (
      <div className="music-app mini-mode acrylic">
        <button className="toggle-mini-btn" onClick={() => setIsMiniMode(false)} title="Expand Player">
          <PanelRightExpandRegular fontSize={16} />
        </button>
        
        {currentSong ? (
          <>
            <div className="mini-player-info">
              <img src={currentSong.cover} alt="Cover" className="mini-cover" draggable={false} />
              <div className="mini-text">
                <span className="mini-title">{currentSong.title}</span>
                <span className="mini-artist">{currentSong.artist}</span>
              </div>
            </div>
            
            <div className="mini-controls">
              <button className="control-btn" onClick={prevSong}><PreviousRegular fontSize={20} /></button>
              <button className="control-btn play-btn" style={{ width: '40px', height: '40px' }} onClick={togglePlayPause}>
                {isPlaying ? <PauseRegular fontSize={20} /> : <PlayRegular fontSize={20} />}
              </button>
              <button className="control-btn" onClick={nextSong}><NextRegular fontSize={20} /></button>
            </div>
          </>
        ) : (
          <div className="mini-text">
            <span className="mini-title">No Music</span>
          </div>
        )}
        
        <audio 
          ref={audioRef}
          src={currentSong?.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      </div>
    );
  }

  return (
    <div className="music-app">
      <div className="music-top-section">
        <Playlist />
        <div className="music-main">
          <Player />
        </div>
      </div>
      
      <div className="music-bottom-bar">
        <Controls />
      </div>

      <audio 
        ref={audioRef}
        src={currentSong?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
}
