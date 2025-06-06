// Clamp number
export const clamp = (number, min, max) => {
  return Math.min(Math.max(number, min), max);
};

// Random number
export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Round number
export const round = (number, decimals = 0) => {
  const factor = Math.pow(10, decimals);
  return Math.round(number * factor) / factor;
};

// Format number
export const format = (number, options = {}) => {
  const defaults = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  return new Intl.NumberFormat('en-US', { ...defaults, ...options }).format(number);
};

// Format currency
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
  const defaults = {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  return new Intl.NumberFormat('en-US', { ...defaults, ...options }).format(amount);
};

// Format percent
export const formatPercent = (number, options = {}) => {
  const defaults = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };
  return new Intl.NumberFormat('en-US', { ...defaults, ...options }).format(number / 100);
};

// Format bytes
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

// Format duration
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}s`);
  }

  return parts.join(' ');
};

// Format file size
export const formatFileSize = (bytes) => {
  return formatBytes(bytes);
};

// Format memory size
export const formatMemorySize = (bytes) => {
  return formatBytes(bytes);
};

// Format disk size
export const formatDiskSize = (bytes) => {
  return formatBytes(bytes);
};

// Format network speed
export const formatNetworkSpeed = (bytesPerSecond) => {
  return `${formatBytes(bytesPerSecond)}/s`;
};

// Format bandwidth
export const formatBandwidth = (bytesPerSecond) => {
  return formatNetworkSpeed(bytesPerSecond);
};

// Format throughput
export const formatThroughput = (bytesPerSecond) => {
  return formatNetworkSpeed(bytesPerSecond);
};

// Format latency
export const formatLatency = (milliseconds) => {
  if (milliseconds < 1) {
    return `${Math.round(milliseconds * 1000)}μs`;
  }
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
};

// Format frequency
export const formatFrequency = (hertz) => {
  if (hertz < 1000) {
    return `${hertz}Hz`;
  }
  if (hertz < 1000000) {
    return `${(hertz / 1000).toFixed(2)}kHz`;
  }
  if (hertz < 1000000000) {
    return `${(hertz / 1000000).toFixed(2)}MHz`;
  }
  return `${(hertz / 1000000000).toFixed(2)}GHz`;
};

// Format temperature
export const formatTemperature = (celsius, unit = 'C') => {
  if (unit === 'F') {
    return `${Math.round(celsius * 9 / 5 + 32)}°F`;
  }
  return `${Math.round(celsius)}°C`;
};

// Format pressure
export const formatPressure = (pascals, unit = 'Pa') => {
  if (unit === 'kPa') {
    return `${(pascals / 1000).toFixed(2)}kPa`;
  }
  if (unit === 'MPa') {
    return `${(pascals / 1000000).toFixed(2)}MPa`;
  }
  return `${pascals}Pa`;
};

// Format distance
export const formatDistance = (meters, unit = 'm') => {
  if (unit === 'km') {
    return `${(meters / 1000).toFixed(2)}km`;
  }
  if (unit === 'mi') {
    return `${(meters / 1609.344).toFixed(2)}mi`;
  }
  return `${meters}m`;
};

// Format speed
export const formatSpeed = (metersPerSecond, unit = 'm/s') => {
  if (unit === 'km/h') {
    return `${(metersPerSecond * 3.6).toFixed(2)}km/h`;
  }
  if (unit === 'mph') {
    return `${(metersPerSecond * 2.236936).toFixed(2)}mph`;
  }
  return `${metersPerSecond}m/s`;
}; 