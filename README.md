# Hong Kong Observatory Weather API Backend

A comprehensive, automated weather data backend that integrates with the Hong Kong Observatory (HKO) API to provide real-time weather information, forecasts, and warnings.

## 🌟 Features

- **Multiple Data Types**: Support for all HKO API endpoints (current weather, forecasts, warnings, etc.)
- **Intelligent Caching**: Reduces API calls with configurable cache timeout
- **Automated Data Fetching**: Scheduled data updates with customizable intervals
- **Robust Error Handling**: Retry logic and comprehensive error management
- **Comprehensive Logging**: Structured logging with different levels
- **RESTful API**: Clean, well-documented endpoints
- **Cloudflare Workers Ready**: Optimized for serverless deployment

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Testing

```bash
npm test
```

## 📡 API Endpoints

### Weather Data Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /weather` | Current weather (backward compatibility) | - |
| `GET /weather/current` | Current weather data | `lang` (optional) |
| `GET /weather/forecast` | Weather forecast | `lang` (optional) |
| `GET /weather/9day` | 9-day forecast | `lang` (optional) |
| `GET /weather/warnings` | Weather warnings | `lang` (optional) |
| `GET /weather/detailed-warnings` | Detailed warnings | `lang` (optional) |
| `GET /weather/special-tips` | Special weather tips | `lang` (optional) |
| `GET /weather/summary` | Comprehensive summary | `lang` (optional) |
| `GET /weather/data/{dataType}` | Specific data type | `lang` (optional) |

### Management Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /weather/cache/status` | Cache status information |
| `POST /weather/cache/clear` | Clear all cached data |
| `POST /weather/automation/start` | Start automated fetching |
| `POST /weather/automation/stop` | Stop automated fetching |
| `GET /weather/info` | API information and documentation |

## 🔧 Configuration

### Environment Variables

```bash
# Logging level (error, warn, info, debug)
LOG_LEVEL=info

# Automation settings
AUTOMATION_ENABLED=true
AUTOMATION_INTERVAL=300000  # 5 minutes in milliseconds
AUTOMATION_ENDPOINTS=rhrread,flw,warnsum

# Cache settings
CACHE_TIMEOUT=600000  # 10 minutes in milliseconds
```

### Supported Data Types

- `rhrread` - 本港地區天氣報告 (Local weather report)
- `flw` - 本港地區天氣預報 (Local weather forecast)
- `fnd` - 九天天氣預報 (9-day weather forecast)
- `warnsum` - 天氣警告一覽 (Weather warnings summary)
- `warningInfo` - 詳細天氣警告資訊 (Detailed weather warnings)
- `swt` - 特別天氣提示 (Special weather tips)

### Supported Languages

- `en` - English
- `tc` - 繁體中文 (Traditional Chinese)
- `sc` - 簡體中文 (Simplified Chinese)

## 📊 Usage Examples

### Get Current Weather

```bash
curl "https://your-domain.com/weather/current?lang=tc"
```

### Get Weather Summary

```bash
curl "https://your-domain.com/weather/summary?lang=en"
```

### Get Specific Data Type

```bash
curl "https://your-domain.com/weather/data/fnd?lang=tc"
```

### Check Cache Status

```bash
curl "https://your-domain.com/weather/cache/status"
```

## 🔄 Automation

The system automatically fetches weather data at configurable intervals:

- **Default Interval**: 5 minutes
- **Default Endpoints**: Current weather, forecast, warnings
- **Configurable**: Via environment variables or API calls

### Start/Stop Automation

```bash
# Start automation
curl -X POST "https://your-domain.com/weather/automation/start"

# Stop automation
curl -X POST "https://your-domain.com/weather/automation/stop"
```

## 📝 Logging

The system provides comprehensive logging with different levels:

- **Error**: Critical errors and failures
- **Warn**: Warnings and non-critical issues
- **Info**: General information and status updates
- **Debug**: Detailed debugging information

### Log Format

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "Weather API call",
  "dataType": "rhrread",
  "language": "tc",
  "success": true,
  "duration": "150ms"
}
```

## 🚀 Deployment

### Cloudflare Workers

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Configure `wrangler.toml`:
```toml
name = "weather-backend"
main = "server.js"
compatibility_date = "2024-01-01"
```

3. Deploy:
```bash
wrangler deploy
```

### Traditional Node.js Server

1. Set environment variables
2. Run: `npm start`

## 🔍 Monitoring

### Health Checks

- Cache status: `GET /weather/cache/status`
- API info: `GET /weather/info`
- Automation status: Check logs for automation start/stop messages

### Performance Metrics

- API response times
- Cache hit/miss rates
- Automation success rates
- Error rates and types

## 🛠️ Development

### Project Structure

```
weather-backend/
├── server.js          # Main server file
├── weatherService.js  # Weather service logic
├── config.js         # Configuration
├── logger.js         # Logging system
├── test.js           # Test script
├── package.json      # Dependencies
└── README.md         # Documentation
```

### Adding New Features

1. Update `config.js` for new data types
2. Add processing methods in `weatherService.js`
3. Add new endpoints in `server.js`
4. Update tests in `test.js`

## 📚 API Documentation

For detailed API documentation, visit: `/weather/info` endpoint.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details.

## 🔗 Links

- [Hong Kong Observatory API Documentation](https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf)
- [GitHub Repository](https://github.com/yung00000/weather-backend)
