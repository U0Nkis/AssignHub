// Capitalize first letter
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Capitalize all words
export const capitalizeWords = (string) => {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Convert to camel case
export const camelCase = (string) => {
  return string
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''));
};

// Convert to kebab case
export const kebabCase = (string) => {
  return string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

// Convert to snake case
export const snakeCase = (string) => {
  return string
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

// Convert to title case
export const titleCase = (string) => {
  return string
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};

// Truncate string
export const truncate = (string, length = 30, suffix = '...') => {
  if (string.length <= length) {
    return string;
  }
  return string.slice(0, length) + suffix;
};

// Strip HTML tags
export const stripHtml = (string) => {
  return string.replace(/<[^>]*>/g, '');
};

// Escape HTML
export const escapeHtml = (string) => {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return string.replace(/[&<>"']/g, (char) => entities[char]);
};

// Unescape HTML
export const unescapeHtml = (string) => {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  return string.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => entities[entity]);
};

// Generate random string
export const randomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate slug
export const slugify = (string) => {
  return string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Format number
export const formatNumber = (number, options = {}) => {
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

// Format date
export const formatDate = (date, options = {}) => {
  const defaults = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(date);
};

// Format time
export const formatTime = (date, options = {}) => {
  const defaults = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(date);
};

// Format datetime
export const formatDateTime = (date, options = {}) => {
  const defaults = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(date);
};

// Format relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  return 'just now';
}; 