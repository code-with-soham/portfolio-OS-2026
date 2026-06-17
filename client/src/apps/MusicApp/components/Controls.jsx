import { useState, useEffect } from 'react';
import { useMusicStore } from '../../../store/useMusicStore';
import { useSystemAudioStore } from '../../../store/useSystemAudioStore';
import {
  PlayRegular,
  PauseRegular,
  PreviousRegular,
  NextRegular,
  ArrowRepeatAllRegular,
  ArrowSyncRegular,
  Speaker2Regular,
  SpeakerOffRegular,
  HeartRegular,
  Heart16Filled
} from '@fluentui/react-icons';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function Controls() {
  const {
    playlist,
    currentSongIndex,
    isPlaying,
    togglePlayPause,
    nextSong,
    prevSong,
    progress,
    duration,
    setProgress,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    audioElement,
    likedSongs,
    toggleLike
  } = useMusicStore();

  const { volume, isMuted, setVolume, toggleMute } = useSystemAudioStore();

  const currentSong = playlist[currentSongIndex];

  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  // Sync local progress when not dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalProgress(progress);
    }
  }, [progress, isDragging]);

  const handleSeekStart = () => {
    setIsDragging(true);
  };

  const handleSeekChange = (e) => {
    setLocalProgress(parseFloat(e.target.value));
  };

  const handleSeekEnd = (e) => {
    const newTime = parseFloat(e.target.value);
    setIsDragging(false);
    setProgress(newTime);
    if (audioElement) {
      audioElement.currentTime = newTime;
    }
  };

  const handleVolume = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  if (!currentSong) return null;

  const isLiked = likedSongs.includes(currentSong.id);

  return (
    <>
      <div className="bottom-bar-left">
        <div className="now-playing-info">
          <img src={currentSong.cover} alt="" className="now-playing-cover" draggable={false} />
          <div className="now-playing-text">
            <span className="now-playing-title">{currentSong.title}</span>
            <span className="now-playing-artist">{currentSong.artist}</span>
          </div>
          <button 
            className={`like-btn ${isLiked ? 'liked' : ''}`} 
            onClick={() => toggleLike(currentSong.id)}
            title={isLiked ? "Remove from Liked Songs" : "Add to Liked Songs"}
          >
            {isLiked ? <Heart16Filled fontSize={20} /> : <HeartRegular fontSize={20} />}
          </button>
        </div>
      </div>

      <div className="bottom-bar-center">
        <div className="media-buttons">
          <button 
            className={`control-btn ${isShuffle ? 'active' : ''}`} 
            onClick={toggleShuffle} 
            title="Shuffle"
          >
            <ArrowSyncRegular fontSize={20} />
          </button>
          
          <button className="control-btn" onClick={prevSong} title="Previous">
            <PreviousRegular fontSize={24} />
          </button>
          
          <button className="control-btn play-btn" onClick={togglePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <PauseRegular fontSize={20} /> : <PlayRegular fontSize={20} />}
          </button>
          
          <button className="control-btn" onClick={nextSong} title="Next">
            <NextRegular fontSize={24} />
          </button>
          
          <button 
            className={`control-btn ${isRepeat ? 'active' : ''}`} 
            onClick={toggleRepeat} 
            title="Repeat"
          >
            <ArrowRepeatAllRegular fontSize={20} />
          </button>
        </div>

        <div className="progress-bar-container">
          <span className="time-text">{formatTime(isDragging ? localProgress : progress)}</span>
          <input
            type="range"
            className="progress-slider"
            min="0"
            max={duration || 100}
            value={localProgress || 0}
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            style={{
              background: `linear-gradient(to right, var(--color-text-primary, #ffffff) ${(localProgress / (duration || 100)) * 100}%, var(--os-border, #3c3c3c) 0)`
            }}
          />
          <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="bottom-bar-right">
        <div className="volume-container">
          <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {isMuted ? <SpeakerOffRegular fontSize={20} /> : <Speaker2Regular fontSize={20} />}
          </button>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            style={{
              background: `linear-gradient(to right, var(--color-text-primary, #ffffff) ${(isMuted ? 0 : volume) * 100}%, var(--os-border, #3c3c3c) 0)`
            }}
          />
        </div>
      </div>
    </>
  );
}
