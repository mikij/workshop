/**
 * Utility class for safe localStorage operations with JSON serialization
 */
export class LocalStorageUtil {
  
  /**
   * Safely get an item from localStorage with JSON parsing
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    if (typeof localStorage === 'undefined') {
      return defaultValue || null;
    }
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  }
  
  /**
   * Safely set an item to localStorage with JSON serialization
   */
  static setItem<T>(key: string, value: T): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Safely remove an item from localStorage
   */
  static removeItem(key: string): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }
  
  /**
   * Clear all localStorage items
   */
  static clear(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
  
  /**
   * Get all localStorage keys
   */
  static getAllKeys(): string[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.warn('Error getting localStorage keys:', error);
      return [];
    }
  }
  
  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get the size of localStorage in bytes (approximate)
   */
  static getSize(): number {
    if (typeof localStorage === 'undefined') {
      return 0;
    }
    
    let total = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.warn('Error calculating localStorage size:', error);
    }
    
    return total;
  }
  
  /**
   * Get localStorage usage as a percentage of quota (approximate)
   */
  static getUsagePercentage(): number {
    const size = this.getSize();
    const quota = 10 * 1024 * 1024; // Approximate 10MB quota
    return (size / quota) * 100;
  }
}