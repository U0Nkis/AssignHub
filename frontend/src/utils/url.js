// Get query parameters
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// Set query parameters
export const setQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value);
    }
  });
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState({}, '', newUrl);
};

// Add query parameter
export const addQueryParam = (key, value) => {
  const params = getQueryParams();
  params[key] = value;
  setQueryParams(params);
};

// Remove query parameter
export const removeQueryParam = (key) => {
  const params = getQueryParams();
  delete params[key];
  setQueryParams(params);
};

// Get path parameters
export const getPathParams = (path) => {
  const params = {};
  const pathParts = path.split('/');
  const urlParts = window.location.pathname.split('/');

  pathParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const key = part.slice(1);
      params[key] = urlParts[index];
    }
  });

  return params;
};

// Build URL
export const buildUrl = (path, params = {}) => {
  let url = path;

  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });

  // Add query parameters
  const queryParams = {};
  Object.entries(params).forEach(([key, value]) => {
    if (!url.includes(`:${key}`)) {
      queryParams[key] = value;
    }
  });

  if (Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams(queryParams);
    url += `?${searchParams.toString()}`;
  }

  return url;
};

// Parse URL
export const parseUrl = (url) => {
  const parser = document.createElement('a');
  parser.href = url;
  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    hash: parser.hash,
    href: parser.href,
  };
};

// Is absolute URL
export const isAbsoluteUrl = (url) => {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

// Join URLs
export const joinUrls = (...urls) => {
  return urls
    .map((url) => url.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
}; 