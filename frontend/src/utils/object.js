// Get value by path
export const get = (object, path, defaultValue) => {
  const keys = path.split('.');
  let result = object;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
};

// Set value by path
export const set = (object, path, value) => {
  const keys = path.split('.');
  let current = object;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return object;
};

// Pick properties
export const pick = (object, keys) => {
  return keys.reduce((result, key) => {
    if (key in object) {
      result[key] = object[key];
    }
    return result;
  }, {});
};

// Omit properties
export const omit = (object, keys) => {
  return Object.entries(object).reduce((result, [key, value]) => {
    if (!keys.includes(key)) {
      result[key] = value;
    }
    return result;
  }, {});
};

// Deep clone
export const clone = (object) => {
  if (object === null || typeof object !== 'object') {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(clone);
  }

  return Object.entries(object).reduce((result, [key, value]) => {
    result[key] = clone(value);
    return result;
  }, {});
};

// Deep merge
export const merge = (target, source) => {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map((item) => clone(item));
  }

  return Object.entries(source).reduce((result, [key, value]) => {
    result[key] = key in result ? merge(result[key], value) : clone(value);
    return result;
  }, { ...target });
};

// Deep equal
export const equal = (a, b) => {
  if (a === b) {
    return true;
  }

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => equal(a[key], b[key]));
};

// Transform object
export const transform = (object, iteratee) => {
  return Object.entries(object).reduce((result, [key, value]) => {
    const [newKey, newValue] = iteratee(key, value);
    result[newKey] = newValue;
    return result;
  }, {});
};

// Map object
export const map = (object, iteratee) => {
  return Object.entries(object).reduce((result, [key, value]) => {
    result[key] = iteratee(value, key, object);
    return result;
  }, {});
};

// Filter object
export const filter = (object, predicate) => {
  return Object.entries(object).reduce((result, [key, value]) => {
    if (predicate(value, key, object)) {
      result[key] = value;
    }
    return result;
  }, {});
};

// Invert object
export const invert = (object) => {
  return Object.entries(object).reduce((result, [key, value]) => {
    result[value] = key;
    return result;
  }, {});
};

// Keys by value
export const keysBy = (object, value) => {
  return Object.entries(object)
    .filter(([, v]) => v === value)
    .map(([key]) => key);
};

// Values by key
export const valuesBy = (object, key) => {
  return Object.values(object).map((item) => item[key]);
};

// Group by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const value = item[key];
    if (!result[value]) {
      result[value] = [];
    }
    result[value].push(item);
    return result;
  }, {});
};

// Count by key
export const countBy = (array, key) => {
  return array.reduce((result, item) => {
    const value = item[key];
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}; 