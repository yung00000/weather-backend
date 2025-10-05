// Enhanced Weather Backend for Hong Kong Observatory API
import WeatherService from './weatherService.js';
import { HKO_CONFIG } from './config.js';

// Initialize weather service
const weatherService = new WeatherService();

// Start automation on startup
weatherService.startAutomation();

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const searchParams = url.searchParams;

    try {
      // Route: /weather - Get current weather (backward compatibility)
      if (path === '/weather') {
        const data = await weatherService.fetchWeatherData('rhrread', 'tc');
        const processedData = weatherService.processCurrentWeather(data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/current - Get current weather data
      if (path === '/weather/current') {
        const language = searchParams.get('lang') || 'tc';
        const data = await weatherService.fetchWeatherData('rhrread', language);
        const processedData = weatherService.processCurrentWeather(data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/forecast - Get weather forecast
      if (path === '/weather/forecast') {
        const language = searchParams.get('lang') || 'tc';
        const data = await weatherService.fetchWeatherData('flw', language);
        const processedData = weatherService.processWeatherForecast(data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/9day - Get 9-day forecast
      if (path === '/weather/9day') {
        const language = searchParams.get('lang') || 'tc';
        const data = await weatherService.fetchWeatherData('fnd', language);
        const processedData = weatherService.processNineDayForecast(data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/warnings - Get weather warnings
      if (path === '/weather/warnings') {
        const language = searchParams.get('lang') || 'tc';
        const data = await weatherService.fetchWeatherData('warnsum', language);
        const processedData = weatherService.processWeatherWarnings(data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/detailed-warnings - Get detailed warnings
      if (path === '/weather/detailed-warnings') {
        const language = searchParams.get('lang') || 'tc';
        const data = await weatherService.fetchWeatherData('warningInfo', language);
        const processedData = weatherService.processDetailedWarnings(data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/special-tips - Get special weather tips
      if (path === '/weather/special-tips') {
        const language = searchParams.get('lang') || 'tc';
        const data = await weatherService.fetchWeatherData('swt', language);
        const processedData = weatherService.processSpecialWeatherTips(data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/summary - Get comprehensive weather summary
      if (path === '/weather/summary') {
        const language = searchParams.get('lang') || 'tc';
        const summary = await weatherService.getWeatherSummary(language);
        
        return new Response(JSON.stringify(summary), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/data/{dataType} - Get specific data type
      if (path.startsWith('/weather/data/')) {
        const dataType = path.split('/')[3];
        const language = searchParams.get('lang') || 'tc';
        
        if (!HKO_CONFIG.dataTypes[dataType]) {
          return new Response(JSON.stringify({ 
            error: 'Invalid data type',
            availableTypes: Object.keys(HKO_CONFIG.dataTypes)
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders 
            },
          });
        }

        const data = await weatherService.fetchWeatherData(dataType, language);
        const processedData = weatherService.processWeatherData(dataType, data);
        
        return new Response(JSON.stringify(processedData), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/cache/status - Get cache status
      if (path === '/weather/cache/status') {
        const cacheStatus = weatherService.getCacheStatus();
        
        return new Response(JSON.stringify(cacheStatus), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/cache/clear - Clear cache
      if (path === '/weather/cache/clear') {
        weatherService.clearCache();
        
        return new Response(JSON.stringify({ 
          message: 'Cache cleared successfully' 
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/automation/start - Start automation
      if (path === '/weather/automation/start') {
        weatherService.startAutomation();
        
        return new Response(JSON.stringify({ 
          message: 'Automation started successfully' 
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/automation/stop - Stop automation
      if (path === '/weather/automation/stop') {
        weatherService.stopAutomation();
        
        return new Response(JSON.stringify({ 
          message: 'Automation stopped successfully' 
        }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Route: /weather/info - Get API information
      if (path === '/weather/info') {
        const info = {
          availableEndpoints: [
            '/weather/current - Current weather data',
            '/weather/forecast - Weather forecast',
            '/weather/9day - 9-day forecast',
            '/weather/warnings - Weather warnings',
            '/weather/detailed-warnings - Detailed warnings',
            '/weather/special-tips - Special weather tips',
            '/weather/summary - Comprehensive summary',
            '/weather/data/{dataType} - Specific data type',
            '/weather/cache/status - Cache status',
            '/weather/cache/clear - Clear cache',
            '/weather/automation/start - Start automation',
            '/weather/automation/stop - Stop automation'
          ],
          supportedDataTypes: HKO_CONFIG.dataTypes,
          supportedLanguages: HKO_CONFIG.languages,
          automation: {
            enabled: HKO_CONFIG.automation.enabled,
            interval: HKO_CONFIG.automation.interval,
            endpoints: HKO_CONFIG.automation.endpoints
          }
        };
        
        return new Response(JSON.stringify(info), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        });
      }

      // Return 404 for unknown routes
      return new Response(JSON.stringify({ 
        error: 'Not Found',
        message: 'Available endpoints: /weather/info'
      }), { 
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      });

    } catch (error) {
      console.error('Error in weather API:', error.message);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error', 
        details: error.message 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      });
    }
  }
};