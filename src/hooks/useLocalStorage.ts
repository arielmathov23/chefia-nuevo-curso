'use client';

import { useState, useEffect } from 'react';

// Type for the hook's return value
type UseLocalStorageReturn<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  { error: Error | null; isLoading: boolean }
];

/**
 * Custom hook for using localStorage with React state
 * @param key The localStorage key
 * @param initialValue The initial value if nothing is in localStorage
 * @returns [storedValue, setValue, { error, isLoading }]
 */
function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  
  // State for error handling and loading state
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to safely parse JSON with error handling
  const safelyParseJSON = (json: string | null): T | null => {
    if (!json) return null;
    
    try {
      return JSON.parse(json) as T;
    } catch (e) {
      console.error('Error parsing JSON from localStorage:', e);
      setError(e instanceof Error ? e : new Error(String(e)));
      return null;
    }
  };

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.warn('useLocalStorage called in a non-browser environment');
        setIsLoading(false);
        return;
      }
      
      // Get from localStorage
      const item = window.localStorage.getItem(key);
      const parsedItem = safelyParseJSON(item);
      
      // If item exists, use it, otherwise use initialValue
      setStoredValue(parsedItem !== null ? parsedItem : initialValue);
      
      // Create a storage event listener to sync state across tabs
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key && e.newValue !== null) {
          const newValue = safelyParseJSON(e.newValue);
          if (newValue !== null) {
            setStoredValue(newValue);
          }
        }
      };
      
      // Listen for changes in other tabs/windows
      window.addEventListener('storage', handleStorageChange);
      
      setIsLoading(false);
      
      // Clean up
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } catch (e) {
      console.error('Error in useLocalStorage initialization:', e);
      setError(e instanceof Error ? e : new Error(String(e)));
      setIsLoading(false);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Save to localStorage
        const serializedValue = JSON.stringify(valueToStore);
        window.localStorage.setItem(key, serializedValue);
        
        // Dispatch a custom event so other tabs can listen for changes
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: serializedValue,
        }));
      }
    } catch (e) {
      console.error('Error setting localStorage value:', e);
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  };

  // Update stored value if the key changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [key]);

  return [storedValue, setValue, { error, isLoading }];
}

export default useLocalStorage; 