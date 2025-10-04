const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3005;

// Enable CORS for frontend
app.use(cors());

// Endpoint to fetch current HK weather
app.get('/weather', async (req, res) => {
  try {
    const hkoUrl = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
    const response = await fetch(hkoUrl);
    const data = await response.json();
    
    // Extract key fields from the API response
    // Get the first temperature reading (or find a specific location)
    const temperatureData = data.temperature?.data?.[0] || {};
    const humidityData = data.humidity?.data?.[0] || {};
    
    const weatherSummary = {
      temperature: temperatureData.value ? `${temperatureData.value}°C` : 'N/A',
      humidity: humidityData.value ? `${humidityData.value}%` : 'N/A',
      updateTime: data.updateTime || 'N/A',
      icon: data.icon ? data.icon[0] : 'N/A',  // Weather icon code
      place: temperatureData.place || 'N/A'  // Location name
    };
    
    res.json(weatherSummary);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});