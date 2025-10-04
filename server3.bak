const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3005;

// Enable CORS for frontend
app.use(cors());

// Endpoint to fetch full HK weather data
app.get('/weather', async (req, res) => {
  try {
    const hkoUrl = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc';
    const response = await fetch(hkoUrl);
    const data = await response.json();

    // Structure the response to include all relevant fields
    const weatherSummary = {
      temperature: data.temperature?.data || [],
      rainfall: data.rainfall?.data || [],
      humidity: data.humidity?.data?.find(h => h.place === '香港天文台')?.value || data.humidity?.data?.[0]?.value || 'N/A',
      warningMessage: data.warningMessage || [],
      tcMessage: data.tcmessage || [],
      icon: data.icon?.[0] || 'N/A',
      updateTime: data.updateTime || 'N/A',
      rainfallTime: {
        startTime: data.rainfall?.startTime || 'N/A',
        endTime: data.rainfall?.endTime || 'N/A'
      }
    };

    res.json(weatherSummary);
  } catch (error) {
    console.error('Error fetching HKO data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});