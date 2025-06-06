// Chunk array
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Filter array by key and value
export const filterBy = (array, key, value) => {
  return array.filter((item) => item[key] === value);
};

// Find item by key and value
export const findById = (array, id) => {
  return array.find((item) => item.id === id);
};

// Remove item by id
export const removeById = (array, id) => {
  return array.filter((item) => item.id !== id);
};

// Update item by id
export const updateById = (array, id, updates) => {
  return array.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    return item;
  });
};

// Get unique values
export const unique = (array) => {
  return [...new Set(array)];
};

// Get unique values by key
export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// Flatten array
export const flatten = (array) => {
  return array.reduce((result, item) => {
    if (Array.isArray(item)) {
      return result.concat(flatten(item));
    }
    return result.concat(item);
  }, []);
};

// Shuffle array
export const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Get random item
export const random = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Get random items
export const randomItems = (array, count) => {
  return shuffle(array).slice(0, count);
};

// Get first item
export const first = (array) => {
  return array[0];
};

// Get last item
export const last = (array) => {
  return array[array.length - 1];
};

// Get items by range
export const range = (array, start, end) => {
  return array.slice(start, end);
};

// Get items by page
export const paginate = (array, page, size) => {
  const start = (page - 1) * size;
  const end = start + size;
  return array.slice(start, end);
}; 