const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const THEME_KEY = 'theme';
const LANGUAGE_KEY = 'language';

// Token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// User
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// Theme
export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
};

// Language
export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) || 'en';
};

export const setLanguage = (language) => {
  localStorage.setItem(LANGUAGE_KEY, language);
  document.documentElement.setAttribute('lang', language);
};

// Clear all
export const clearStorage = () => {
  localStorage.clear();
};

// Initialize
export const initializeStorage = () => {
  const theme = getTheme();
  const language = getLanguage();

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('lang', language);
}; 