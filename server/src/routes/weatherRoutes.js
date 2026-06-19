const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = req.query.city || 'Kolkata';

    if (!apiKey) {
      return res.status(500).json({ error: 'OpenWeather API Key is not configured' });
    }

    // Fetch current weather
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!currentRes.ok) {
      throw new Error('Failed to fetch current weather');
    }
    const currentData = await currentRes.json();

    // Fetch 5-day forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (!forecastRes.ok) {
      throw new Error('Failed to fetch forecast');
    }
    const forecastData = await forecastRes.json();

    // Process forecast (get one reading per day, usually 12:00 PM)
    const dailyForecast = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // If we don't have this day yet, or if it's closer to noon
      if (!dailyForecast[day] || item.dt_txt.includes('12:00:00')) {
        dailyForecast[day] = Math.round(item.main.temp);
      }
    });

    // Format final 5-day forecast array
    const forecastArray = Object.keys(dailyForecast)
      .slice(0, 5)
      .map(day => ({
        day,
        temp: dailyForecast[day]
      }));

    // Construct the response matching the user's requirements
    const formattedResponse = {
      city: currentData.name,
      country: currentData.sys.country,
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      condition: currentData.weather[0].main,
      icon: currentData.weather[0].icon,
      sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toISOString(),
      forecast: forecastArray
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

module.exports = router;
