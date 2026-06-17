import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMusicStore = create(
  persist(
    (set, get) => ({
      playlist: [],
      currentSongIndex: 0,
      isPlaying: false,
      progress: 0,
      duration: 0,
      audioElement: null,
      isShuffle: false,
      isRepeat: false,

      // V3 Enhancements
      likedSongs: [], // Array of song IDs
      recentlyPlayed: [], // Array of song objects (max 10)
      searchQuery: '',

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleLike: (songId) => {
        const { likedSongs } = get();
        if (likedSongs.includes(songId)) {
          set({ likedSongs: likedSongs.filter(id => id !== songId) });
        } else {
          set({ likedSongs: [...likedSongs, songId] });
        }
      },

      addToRecentlyPlayed: (song) => {
        const { recentlyPlayed } = get();
        // Remove if it exists to put it at the top
        const filtered = recentlyPlayed.filter(s => s.id !== song.id);
        set({ recentlyPlayed: [song, ...filtered].slice(0, 10) });
      },

      setPlaylist: (playlist) => set({ playlist }),
      
      setAudioElement: (audioElement) => set({ audioElement }),

      playSong: (index) => {
        const { playlist, audioElement, addToRecentlyPlayed } = get();
        if (index >= 0 && index < playlist.length) {
          set({ currentSongIndex: index, isPlaying: true });
          addToRecentlyPlayed(playlist[index]);
          if (audioElement) {
            audioElement.src = playlist[index].src;
            audioElement.play().catch(e => console.error("Play error", e));
          }
        }
      },

      togglePlayPause: () => {
        const { isPlaying, audioElement, playlist, currentSongIndex, addToRecentlyPlayed } = get();
        if (!audioElement) return;

        if (isPlaying) {
          audioElement.pause();
          set({ isPlaying: false });
        } else {
          // If playing for the first time, add to recently played
          if (playlist[currentSongIndex]) {
            addToRecentlyPlayed(playlist[currentSongIndex]);
          }
          audioElement.play().catch(e => console.error("Play error", e));
          set({ isPlaying: true });
        }
      },

      nextSong: () => {
        const { currentSongIndex, playlist, isShuffle, playSong } = get();
        if (playlist.length === 0) return;
        
        let nextIndex;
        if (isShuffle) {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } else {
          nextIndex = (currentSongIndex + 1) % playlist.length;
        }
        playSong(nextIndex);
      },

      prevSong: () => {
        const { currentSongIndex, playlist, playSong } = get();
        if (playlist.length === 0) return;
        
        const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
        playSong(prevIndex);
      },

      setProgress: (time) => set({ progress: time }),
      setDuration: (time) => set({ duration: time }),
      
      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
      toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
    }),
    {
      name: 'music-storage', // key in localStorage
      partialize: (state) => ({
        likedSongs: state.likedSongs,
        recentlyPlayed: state.recentlyPlayed,
        isShuffle: state.isShuffle,
        isRepeat: state.isRepeat
      }), // only persist these fields
    }
  )
);
