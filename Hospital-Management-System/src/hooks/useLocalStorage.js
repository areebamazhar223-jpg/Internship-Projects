
import { useCallback, useEffect, useState } from "react";

import { readStoredValue, writeStoredValue } from "../lib/storage";

function useLocalStorage(key, initialValue, validate) {
  const [storedValue, setStoredValue] = useState(() =>
    readStoredValue(key, initialValue, validate),
  );

  const setValue = useCallback((value) => {
    setStoredValue((previousValue) =>
      typeof value === "function" ? value(previousValue) : value,
    );
  }, []);

  useEffect(() => {
    writeStoredValue(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
