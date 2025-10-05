// Weather service for Hong Kong Observatory API
import { HKO_CONFIG } from './config.js';
import logger from './logger.js';

class WeatherService {
  constructor() {
    this.cache = new Map();
    this.automationInterval = null;
  }

  // Build API URL with parameters
  buildApiUrl(dataType, language = HKO_CONFIG.defaults.language) {
    const url = new URL(HKO_CONFIG.baseUrl);
    url.searchParams.set('dataType', dataType);
    url.searchParams.set('lang', language);
    return url.toString();
  }

  // Fetch weather data with caching and retry logic
  async fetchWeatherData(dataType, language = HKO_CONFIG.defaults.language, useCache = true) {
    const cacheKey = `${dataType}_${language}`;
    
    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < HKO_CONFIG.defaults.cacheTimeout) {
        logger.logCacheHit(dataType, language);
        return cached.data;
      }
    }
    
    logger.logCacheMiss(dataType, language);

    // Fetch from API with retry logic
    const startTime = Date.now();
    for (let attempt = 1; attempt <= HKO_CONFIG.defaults.retryAttempts; attempt++) {
      try {
        const url = this.buildApiUrl(dataType, language);
        logger.debug(`Fetching ${dataType} from HKO API (attempt ${attempt})`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Cache the result
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        
        const duration = Date.now() - startTime;
        logger.logApiCall(dataType, language, true, duration);
        return data;
        
      } catch (error) {
        logger.error(`Attempt ${attempt} failed for ${dataType}`, { error: error.message });
        
        if (attempt === HKO_CONFIG.defaults.retryAttempts) {
          const duration = Date.now() - startTime;
          logger.logApiCall(dataType, language, false, duration, error);
          throw new Error(`Failed to fetch ${dataType} after ${attempt} attempts: ${error.message}`);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, HKO_CONFIG.defaults.retryDelay * attempt));
      }
    }
  }

  // Process different types of weather data
  processWeatherData(dataType, rawData) {
    switch (dataType) {
      case 'rhrread':
        return this.processCurrentWeather(rawData);
      case 'flw':
        return this.processWeatherForecast(rawData);
      case 'fnd':
        return this.processNineDayForecast(rawData);
      case 'warnsum':
        return this.processWeatherWarnings(rawData);
      case 'warningInfo':
        return this.processDetailedWarnings(rawData);
      case 'swt':
        return this.processSpecialWeatherTips(rawData);
      default:
        return rawData;
    }
  }

  // Process current weather data
  processCurrentWeather(data) {
    return {
      temperature: data.temperature?.data || [],
      rainfall: data.rainfall?.data || [],
      humidity: data.humidity?.data || [],
      wind: data.wind?.data || [],
      pressure: data.pressure?.data || [],
      visibility: data.visibility?.data || [],
      warningMessage: data.warningMessage || [],
      tcMessage: data.tcmessage || [],
      icon: data.icon || [],
      updateTime: data.updateTime || 'N/A',
      rainfallTime: {
        startTime: data.rainfall?.startTime || 'N/A',
        endTime: data.rainfall?.endTime || 'N/A'
      }
    };
  }

  // Process weather forecast
  processWeatherForecast(data) {
    return {
      generalSituation: data.generalSituation || '',
      tcInfo: data.tcInfo || '',
      fireDangerWarning: data.fireDangerWarning || '',
      forecastPeriod: data.forecastPeriod || '',
      forecastDesc: data.forecastDesc || '',
      outlook: data.outlook || '',
      updateTime: data.updateTime || 'N/A'
    };
  }

  // Process 9-day forecast
  processNineDayForecast(data) {
    return {
      forecastDate: data.forecastDate || '',
      forecastPeriod: data.forecastPeriod || '',
      generalSituation: data.generalSituation || '',
      weatherForecast: data.weatherForecast || [],
      seaTemp: data.seaTemp || {},
      soilTemp: data.soilTemp || {},
      updateTime: data.updateTime || 'N/A'
    };
  }

  // Process weather warnings
  processWeatherWarnings(data) {
    return {
      warningInfo: data.warningInfo || [],
      updateTime: data.updateTime || 'N/A'
    };
  }

  // Process detailed warnings
  processDetailedWarnings(data) {
    return {
      warningInfo: data.warningInfo || [],
      updateTime: data.updateTime || 'N/A'
    };
  }

  // Process special weather tips
  processSpecialWeatherTips(data) {
    return {
      swt: data.swt || [],
      updateTime: data.updateTime || 'N/A'
    };
  }

  // Get comprehensive weather summary
  async getWeatherSummary(language = HKO_CONFIG.defaults.language) {
    try {
      const [current, forecast, warnings] = await Promise.all([
        this.fetchWeatherData('rhrread', language),
        this.fetchWeatherData('flw', language),
        this.fetchWeatherData('warnsum', language)
      ]);

      return {
        current: this.processCurrentWeather(current),
        forecast: this.processWeatherForecast(forecast),
        warnings: this.processWeatherWarnings(warnings),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting weather summary:', error);
      throw error;
    }
  }

  // Start automation
  startAutomation() {
    if (!HKO_CONFIG.automation.enabled) {
      logger.info('Automation is disabled');
      return;
    }

    logger.logAutomationStart();
    
    // Initial fetch
    this.fetchAutomatedData();
    
    // Set up interval
    this.automationInterval = setInterval(() => {
      this.fetchAutomatedData();
    }, HKO_CONFIG.automation.interval);
  }

  // Stop automation
  stopAutomation() {
    if (this.automationInterval) {
      clearInterval(this.automationInterval);
      this.automationInterval = null;
      logger.logAutomationStop();
    }
  }

  // Fetch data for automation
  async fetchAutomatedData() {
    logger.debug('Running automated weather data fetch...');
    
    for (const dataType of HKO_CONFIG.automation.endpoints) {
      try {
        await this.fetchWeatherData(dataType, HKO_CONFIG.defaults.language);
        logger.logAutomationFetch(dataType, true);
      } catch (error) {
        logger.logAutomationFetch(dataType, false, error);
      }
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    logger.info('Weather cache cleared');
  }

  // Get cache status
  getCacheStatus() {
    const status = {};
    for (const [key, value] of this.cache.entries()) {
      status[key] = {
        timestamp: new Date(value.timestamp).toISOString(),
        age: Date.now() - value.timestamp,
        expired: Date.now() - value.timestamp > HKO_CONFIG.defaults.cacheTimeout
      };
    }
    return status;
  }
}

export default WeatherService;
