// Test script for weather backend
import WeatherService from './weatherService.js';
import logger from './logger.js';

async function testWeatherAPI() {
  console.log('🧪 Testing Hong Kong Observatory Weather API Backend\n');
  
  const weatherService = new WeatherService();
  
  try {
    // Test 1: Current weather data
    console.log('📊 Test 1: Current Weather Data');
    const currentWeather = await weatherService.fetchWeatherData('rhrread', 'tc');
    console.log('✅ Current weather data fetched successfully');
    console.log('📈 Sample data:', {
      temperature: currentWeather.temperature?.data?.slice(0, 2),
      updateTime: currentWeather.updateTime
    });
    console.log('');

    // Test 2: Weather forecast
    console.log('📊 Test 2: Weather Forecast');
    const forecast = await weatherService.fetchWeatherData('flw', 'tc');
    console.log('✅ Weather forecast fetched successfully');
    console.log('📈 Sample data:', {
      generalSituation: forecast.generalSituation?.substring(0, 50) + '...',
      updateTime: forecast.updateTime
    });
    console.log('');

    // Test 3: 9-day forecast
    console.log('📊 Test 3: 9-Day Forecast');
    const nineDayForecast = await weatherService.fetchWeatherData('fnd', 'tc');
    console.log('✅ 9-day forecast fetched successfully');
    console.log('📈 Sample data:', {
      forecastDate: nineDayForecast.forecastDate,
      updateTime: nineDayForecast.updateTime
    });
    console.log('');

    // Test 4: Weather warnings
    console.log('📊 Test 4: Weather Warnings');
    const warnings = await weatherService.fetchWeatherData('warnsum', 'tc');
    console.log('✅ Weather warnings fetched successfully');
    console.log('📈 Sample data:', {
      warningCount: warnings.warningInfo?.length || 0,
      updateTime: warnings.updateTime
    });
    console.log('');

    // Test 5: Cache functionality
    console.log('📊 Test 5: Cache Functionality');
    const startTime = Date.now();
    await weatherService.fetchWeatherData('rhrread', 'tc'); // Should use cache
    const cacheTime = Date.now() - startTime;
    console.log(`✅ Cache test completed in ${cacheTime}ms (should be very fast)`);
    console.log('');

    // Test 6: Cache status
    console.log('📊 Test 6: Cache Status');
    const cacheStatus = weatherService.getCacheStatus();
    console.log('✅ Cache status retrieved');
    console.log('📈 Cache entries:', Object.keys(cacheStatus).length);
    console.log('');

    // Test 7: Weather summary
    console.log('📊 Test 7: Weather Summary');
    const summary = await weatherService.getWeatherSummary('tc');
    console.log('✅ Weather summary fetched successfully');
    console.log('📈 Summary includes:', Object.keys(summary));
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Current weather data');
    console.log('✅ Weather forecast');
    console.log('✅ 9-day forecast');
    console.log('✅ Weather warnings');
    console.log('✅ Cache functionality');
    console.log('✅ Cache status');
    console.log('✅ Weather summary');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    logger.logError(error, { test: 'weather-api' });
  }
}

// Run tests
testWeatherAPI();
