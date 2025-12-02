import { Injectable } from '@angular/core';

/**
 * Service for managing browser localStorage operations.
 *
 * Provides type-safe methods for storing and retrieving data from localStorage.
 * Handles JSON serialization/deserialization automatically.
 *
 * @usageNotes
 * ### Injecting the Service
 * ```typescript
 * private readonly storageService = inject(StorageService);
 * ```
 *
 * ### Storing Data
 * ```typescript
 * this.storageService.setItem('auth_token', token);
 * this.storageService.setItem('user', JSON.stringify(user));
 * ```
 *
 * ### Retrieving Data
 * ```typescript
 * const token = this.storageService.getItem('auth_token');
 * const userJson = this.storageService.getItem('user');
 * const user = userJson ? JSON.parse(userJson) : null;
 * ```
 *
 * @category Data Access
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Stores a value in localStorage.
   *
   * @param key - Storage key
   * @param value - Value to store (will be converted to string)
   *
   * @example
   * ```typescript
   * this.storageService.setItem('theme', 'dark');
   * this.storageService.setItem('user', JSON.stringify(userData));
   * ```
   */
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error saving to localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Retrieves a value from localStorage.
   *
   * @param key - Storage key
   * @returns The stored value or null if not found
   *
   * @example
   * ```typescript
   * const theme = this.storageService.getItem('theme');
   * const userJson = this.storageService.getItem('user');
   * const user = userJson ? JSON.parse(userJson) : null;
   * ```
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Removes a value from localStorage.
   *
   * @param key - Storage key to remove
   *
   * @example
   * ```typescript
   * this.storageService.removeItem('auth_token');
   * ```
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Clears all data from localStorage.
   *
   * **Warning**: This will remove all stored data for the application.
   *
   * @example
   * ```typescript
   * this.storageService.clear();
   * ```
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Checks if a key exists in localStorage.
   *
   * @param key - Storage key to check
   * @returns True if the key exists, false otherwise
   *
   * @example
   * ```typescript
   * if (this.storageService.hasItem('auth_token')) {
   *   // Token exists
   * }
   * ```
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }
}
