import { create } from 'zustand';
import { weatherService } from '../services/weatherService';

export const useWeatherStore = create((set, get) => ({
  currentWeather: null,
  hourlyForecast: [],
  dailyForecast: [],
  airQuality: null,
  lastUpdated: null,
  loading: false,
  error: null,

  fetchWeather: async (lat, lon) => {
    // If we're already loading or just fetched less than 1 min ago, skip
    const state = get();
    if (state.loading) return;
    if (state.lastUpdated && (Date.now() - state.lastUpdated < 60000)) {
      return; 
    }

    set({ loading: true, error: null });

    try {
      const data = await weatherService.fetchFullWeatherData(lat, lon);
      
      set({
        currentWeather: data.currentWeather,
        hourlyForecast: data.hourlyForecast,
        dailyForecast: data.dailyForecast,
        airQuality: data.airQuality,
        lastUpdated: data.lastUpdated,
        loading: false
      });
    } catch (err) {
      set({ 
        error: err.message || 'Failed to fetch weather',
        loading: false 
      });
    }
  }
}));
