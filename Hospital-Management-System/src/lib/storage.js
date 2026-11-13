export function readStoredValue(key, fallback, validate = () => true) {
  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return fallback;
    }

    const value = JSON.parse(storedValue);

    if (!validate(value)) {
      console.error(`Ignoring invalid localStorage data for "${key}".`);
      return fallback;
    }

    return value;
  } catch (error) {
    console.error(`Unable to read localStorage key "${key}".`, error);
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save localStorage key "${key}".`, error);
  }
}

export function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Unable to remove localStorage key "${key}".`, error);
  }
}