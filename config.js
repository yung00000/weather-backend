// Configuration for Hong Kong Observatory Weather API
export const HKO_CONFIG = {
  baseUrl: 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php',
  
  // Available data types from HKO API
  dataTypes: {
    flw: '本港地區天氣預報', // Local weather forecast
    fnd: '九天天氣預報',     // 9-day weather forecast
    rhrread: '本港地區天氣報告', // Local weather report
    warnsum: '天氣警告一覽',   // Weather warnings summary
    warningInfo: '詳細天氣警告資訊', // Detailed weather warnings
    swt: '特別天氣提示'      // Special weather tips
  },
  
  // Supported languages
  languages: {
    en: 'English',
    tc: '繁體中文',
    sc: '簡體中文'
  },
  
  // Default settings
  defaults: {
    language: 'tc',
    cacheTimeout: 10 * 60 * 1000, // 10 minutes in milliseconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  
  // Automation settings
  automation: {
    enabled: true,
    interval: 5 * 60 * 1000, // 5 minutes
    endpoints: ['rhrread', 'flw', 'warnsum'] // Which endpoints to fetch automatically
  }
};
