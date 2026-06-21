const API_KEY = '729bff6d3eec9d0b2770578328e5f023';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Default to Kolkata
const DEFAULT_LOCATION = { lat: 22.5726, lon: 88.3639, name: 'Kolkata' };

class WeatherService {
  /**
   * Retrieves data from cache if it exists and is fresh.
   */
  getCache(key) {
    try {
      const cached = localStorage.getItem(`weather_cache_${key}`);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Failed to read weather cache', e);
    }
    return null;
  }

  /**
   * Saves data to cache.
   */
  setCache(key, data) {
    try {
      localStorage.setItem(`weather_cache_${key}`, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (e) {
      console.warn('Failed to save weather cache', e);
    }
  }

  /**
   * Fetches weather data.
   * Will attempt to use geolocation if available and no lat/lon provided.
   */
  async fetchFullWeatherData(lat = null, lon = null) {
    let finalLat = lat;
    let finalLon = lon;

    // Use default if none provided (could integrate geolocation later)
    if (!finalLat || !finalLon) {
      finalLat = DEFAULT_LOCATION.lat;
      finalLon = DEFAULT_LOCATION.lon;
    }

    const cacheKey = `${finalLat.toFixed(2)}_${finalLon.toFixed(2)}`;
    const cachedData = this.getCache(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const [currentRes, forecastRes, aqiRes] = await Promise.all([
        fetch(`${BASE_URL}/weather?lat=${finalLat}&lon=${finalLon}&units=metric&appid=${API_KEY}`),
        fetch(`${BASE_URL}/forecast?lat=${finalLat}&lon=${finalLon}&units=metric&appid=${API_KEY}`),
        fetch(`${BASE_URL}/air_pollution?lat=${finalLat}&lon=${finalLon}&appid=${API_KEY}`)
      ]);

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const current = await currentRes.json();
      const forecast = await forecastRes.json();
      const aqi = aqiRes.ok ? await aqiRes.json() : null;

      const processedData = this.processData(current, forecast, aqi);
      
      this.setCache(cacheKey, processedData);
      return processedData;

    } catch (error) {
      console.error('WeatherService Error:', error);
      throw error;
    }
  }

  processData(current, forecast, aqi) {
    // 1. Current Weather
    const currentWeather = {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
      pressure: current.main.pressure,
      visibility: current.visibility / 1000, // meters to km
      city: current.name,
      country: current.sys.country,
      sunrise: current.sys.sunrise * 1000,
      sunset: current.sys.sunset * 1000,
    };

    // 2. AQI Mapping (1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor)
    let airQuality = { index: 1, label: 'Good', details: {} };
    if (aqi && aqi.list && aqi.list.length > 0) {
      const aq = aqi.list[0];
      const aqiIndex = aq.main.aqi;
      const labels = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };
      airQuality = {
        index: aqiIndex,
        label: labels[aqiIndex] || 'Unknown',
        details: aq.components // pm2_5, pm10, co, no2, etc.
      };
    }

    // 3. Hourly Forecast (next 24 hours approximately, using 3-hour blocks)
    // The forecast endpoint provides 3-hour intervals. We'll take the next 8 items.
    const hourlyForecast = forecast.list.slice(0, 8).map(item => ({
      dt: item.dt * 1000,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      rainChance: Math.round(item.pop * 100), // Probability of precipitation
    }));

    // 4. Daily Forecast (5-day)
    // Group by day to find high/low
    const dailyMap = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!dailyMap[date]) {
        dailyMap[date] = {
          day: date,
          temps: [],
          icons: {},
          rainChance: 0
        };
      }
      dailyMap[date].temps.push(item.main.temp);
      // Count icon occurrences to pick the most frequent one
      const icon = item.weather[0].icon.replace('n', 'd'); // normalize to day icons
      dailyMap[date].icons[icon] = (dailyMap[date].icons[icon] || 0) + 1;
      dailyMap[date].rainChance = Math.max(dailyMap[date].rainChance, Math.round(item.pop * 100));
    });

    const dailyForecast = Object.values(dailyMap).map(day => {
      const sortedIcons = Object.keys(day.icons).sort((a, b) => day.icons[b] - day.icons[a]);
      return {
        day: day.day,
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
        icon: sortedIcons[0],
        rainChance: day.rainChance
      };
    }).slice(0, 5); // ensure 5 days

    return {
      currentWeather,
      hourlyForecast,
      dailyForecast,
      airQuality,
      lastUpdated: Date.now()
    };
  }
}

export const weatherService = new WeatherService();
