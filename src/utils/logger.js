
const isProduction = process.env.NODE_ENV === 'production';

const format = (level, message, meta) => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  ...(meta ? { meta } : {}),
});

const emit = (payload) => {
  // In production, this could POST to a logging service
  if (!isProduction) {
    // eslint-disable-next-line no-console
    console[levelToConsole[payload.level]](payload);
  }
};

const levelToConsole = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
};

export const logDebug = (message, meta) => emit(format('debug', message, meta));
export const logInfo = (message, meta) => emit(format('info', message, meta));
export const logWarn = (message, meta) => emit(format('warn', message, meta));
export const logError = (message, meta) => emit(format('error', message, meta));

// API helpers for consistent logging around fetches
export const logApiStart = (name, meta) => logInfo(`API_START:${name}`, meta);
export const logApiSuccess = (name, meta) => logInfo(`API_SUCCESS:${name}`, meta);
export const logApiError = (name, error) => logError(`API_ERROR:${name}`, { error: String(error) });


