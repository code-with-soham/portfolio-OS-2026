import { useMusicStore } from '../../../store/useMusicStore';

export default function Playlist() {
  const { 
    playlist, 
    currentSongIndex, 
    playSong, 
    isPlaying,
    searchQuery,
    setSearchQuery,
    likedSongs,
    recentlyPlayed
  } = useMusicStore();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const renderSongList = (songs, emptyMessage) => {
    if (songs.length === 0) {
      return <div style={{ padding: '8px 16px', color: 'var(--color-text-secondary)' }}>{emptyMessage}</div>;
    }

    return songs.map((song) => {
      // Find original index in playlist to pass to playSong
      const originalIndex = playlist.findIndex(s => s.id === song.id);
      const isActive = currentSongIndex === originalIndex;
      
      return (
        <div 
          key={song.id} 
          className={`playlist-item ${isActive ? 'active' : ''}`}
          onClick={() => playSong(originalIndex)}
        >
          <img src={song.cover} alt="" className="playlist-item-cover" draggable={false} />
          
          <div className="playlist-item-info">
            <div className="playlist-item-title">{song.title}</div>
            <div className="playlist-item-artist">{song.artist}</div>
          </div>
          
          {isActive && isPlaying ? (
            <div className="playing-bars">
              <div className="playing-bar"></div>
              <div className="playing-bar"></div>
              <div className="playing-bar"></div>
              <div className="playing-bar"></div>
            </div>
          ) : (
            <div className="playlist-item-duration">{song.duration}</div>
          )}
        </div>
      );
    });
  };

  // Filter based on search query
  const filteredPlaylist = playlist.filter(song => 
    song.title.toLowerCase().includes(searchQuery) || 
    song.artist.toLowerCase().includes(searchQuery)
  );

  const likedPlaylist = playlist.filter(song => likedSongs.includes(song.id));

  // If there's a search query, just show search results
  if (searchQuery) {
    return (
      <div className="music-sidebar">
        <div className="playlist-header">
          <input 
            type="text" 
            className="playlist-search" 
            placeholder="🔍 Search songs..." 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="playlist-list">
          <div className="playlist-section-title">Search Results</div>
          {renderSongList(filteredPlaylist, "No songs found.")}
        </div>
      </div>
    );
  }

  return (
    <div className="music-sidebar">
      <div className="playlist-header">
        Your Library
        <input 
          type="text" 
          className="playlist-search" 
          placeholder="🔍 Search songs..." 
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="playlist-list">
        
        {recentlyPlayed.length > 0 && (
          <>
            <div className="playlist-section-title">Recently Played</div>
            {renderSongList(recentlyPlayed, "")}
          </>
        )}

        {likedPlaylist.length > 0 && (
          <>
            <div className="playlist-section-title">Liked Songs</div>
            {renderSongList(likedPlaylist, "")}
          </>
        )}

        <div className="playlist-section-title">All Songs</div>
        {renderSongList(playlist, "Playlist is empty.")}
        
      </div>
    </div>
  );
}
