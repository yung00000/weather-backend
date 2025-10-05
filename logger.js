// Enhanced logging system for weather backend
class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    return JSON.stringify(logEntry);
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  error(message, meta = {}) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  warn(message, meta = {}) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message, meta = {}) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  debug(message, meta = {}) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, meta));
    }
  }

  // Weather-specific logging methods
  logApiCall(dataType, language, success, duration, error = null) {
    this.info('Weather API call', {
      dataType,
      language,
      success,
      duration: `${duration}ms`,
      error: error?.message
    });
  }

  logCacheHit(dataType, language) {
    this.debug('Cache hit', { dataType, language });
  }

  logCacheMiss(dataType, language) {
    this.debug('Cache miss', { dataType, language });
  }

  logAutomationStart() {
    this.info('Weather automation started', {
      interval: process.env.AUTOMATION_INTERVAL || '5 minutes',
      endpoints: process.env.AUTOMATION_ENDPOINTS || 'rhrread,flw,warnsum'
    });
  }

  logAutomationStop() {
    this.info('Weather automation stopped');
  }

  logAutomationFetch(dataType, success, error = null) {
    if (success) {
      this.debug('Automated fetch completed', { dataType });
    } else {
      this.error('Automated fetch failed', { dataType, error: error?.message });
    }
  }

  logRequest(method, path, statusCode, duration) {
    this.info('HTTP request', {
      method,
      path,
      statusCode,
      duration: `${duration}ms`
    });
  }

  logError(error, context = {}) {
    this.error('Application error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }
}

export default new Logger();
