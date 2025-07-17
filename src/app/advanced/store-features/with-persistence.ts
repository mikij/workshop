import { computed, effect, inject, DestroyRef } from '@angular/core';
import { signalStoreFeature, withState, withComputed, withMethods, withHooks, patchState, getState } from '@ngrx/signals';
import { PersistenceConfig, PersistenceState, PersistenceStats } from './types';

/**
 * Custom Store Feature: Persistence
 * 
 * This feature provides automatic state persistence with versioning and migrations.
 * Supports localStorage/sessionStorage with configurable debouncing.
 * 
 * Usage:
 * ```typescript
 * export const MyStore = signalStore(
 *   { providedIn: 'root' },
 *   withState(initialState),
 *   withPersistence({
 *     key: 'my-store',
 *     storage: 'localStorage',
 *     version: 1,
 *     exclude: ['loading', 'error']
 *   }),
 *   withComputed((store) => ({
 *     // Your computed properties
 *   }))
 * );
 * ```
 */
export function withPersistence(config: Partial<PersistenceConfig> = {}) {
  const defaultConfig: PersistenceConfig = {
    key: 'store-state',
    storage: 'localStorage',
    debounceMs: 500,
    version: 1,
    include: [],
    exclude: ['isLoading', 'error'],
    migrations: {},
    ...config
  };

  return signalStoreFeature(
    // Feature state
    withState<PersistenceState>({
      lastSaved: null,
      version: defaultConfig.version,
      persistenceStats: {
        saveCount: 0,
        loadCount: 0,
        errorCount: 0,
        storageSize: 0
      }
    }),

    // Feature computed signals
    withComputed((store) => ({
      // Get persistence statistics
      stats: computed((): PersistenceStats => ({
        saveCount: store.persistenceStats().saveCount,
        loadCount: store.persistenceStats().loadCount,
        errorCount: store.persistenceStats().errorCount,
        storageSize: store.persistenceStats().storageSize,
        lastSaved: store.lastSaved()
      })),

      // Check if persistence is healthy
      isPersistenceHealthy: computed(() => {
        const stats = store.persistenceStats();
        const errorRate = stats.saveCount > 0 ? stats.errorCount / stats.saveCount : 0;
        return errorRate < 0.1; // Less than 10% error rate
      }),

      // Get storage size in human readable format
      storageSizeFormatted: computed(() => {
        const bytes = store.persistenceStats().storageSize;
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }),

      // Get time since last save
      timeSinceLastSave: computed(() => {
        const lastSaved = store.lastSaved();
        if (!lastSaved) return 'Never';
        
        const now = new Date();
        const diff = now.getTime() - lastSaved.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`;
        return `${seconds}s ago`;
      })
    })),

    // Feature methods
    withMethods((store) => ({
      // Manual save
      saveToStorage: () => {
        try {
          const state = getState(store);
          const filteredState = filterStateForPersistence(state, defaultConfig);
          const persistenceData = {
            version: defaultConfig.version,
            timestamp: new Date().toISOString(),
            state: filteredState
          };

          const storage = getStorageAPI(defaultConfig.storage);
          storage.setItem(defaultConfig.key, JSON.stringify(persistenceData));

          const storageSize = getStorageSize(defaultConfig.key, defaultConfig.storage);

          patchState(store, {
            lastSaved: new Date(),
            persistenceStats: {
              ...store.persistenceStats(),
              saveCount: store.persistenceStats().saveCount + 1,
              storageSize
            }
          });

          return true;
        } catch (error) {
          console.error('Failed to save to storage:', error);
          patchState(store, {
            persistenceStats: {
              ...store.persistenceStats(),
              errorCount: store.persistenceStats().errorCount + 1
            }
          });
          return false;
        }
      },

      // Manual load
      loadFromStorage: () => {
        try {
          const storage = getStorageAPI(defaultConfig.storage);
          const saved = storage.getItem(defaultConfig.key);

          if (!saved) {
            return false; // No saved data
          }

          const persistenceData = JSON.parse(saved);
          let state = persistenceData.state;

          // Handle version migrations
          if (persistenceData.version !== defaultConfig.version) {
            state = migrateState(state, persistenceData.version, defaultConfig);
          }

          // Merge loaded state with current state (excluding persistence state itself)
          const { lastSaved, version, persistenceStats, ...currentState } = getState(store);
          const mergedState = { ...currentState, ...state };

          patchState(store, {
            ...mergedState,
            persistenceStats: {
              ...store.persistenceStats(),
              loadCount: store.persistenceStats().loadCount + 1
            }
          });

          return true;
        } catch (error) {
          console.error('Failed to load from storage:', error);
          patchState(store, {
            persistenceStats: {
              ...store.persistenceStats(),
              errorCount: store.persistenceStats().errorCount + 1
            }
          });
          return false;
        }
      },

      // Clear stored data
      clearStorage: () => {
        try {
          const storage = getStorageAPI(defaultConfig.storage);
          storage.removeItem(defaultConfig.key);
          
          patchState(store, {
            lastSaved: null,
            persistenceStats: {
              ...store.persistenceStats(),
              storageSize: 0
            }
          });

          return true;
        } catch (error) {
          console.error('Failed to clear storage:', error);
          return false;
        }
      },

      // Check if data exists in storage
      hasStoredData: (): boolean => {
        try {
          const storage = getStorageAPI(defaultConfig.storage);
          return storage.getItem(defaultConfig.key) !== null;
        } catch {
          return false;
        }
      },

      // Get storage info
      getStorageInfo: () => {
        try {
          const storage = getStorageAPI(defaultConfig.storage);
          const saved = storage.getItem(defaultConfig.key);
          
          if (!saved) {
            return null;
          }

          const persistenceData = JSON.parse(saved);
          return {
            version: persistenceData.version,
            timestamp: new Date(persistenceData.timestamp),
            size: new Blob([saved]).size,
            needsMigration: persistenceData.version !== defaultConfig.version
          };
        } catch {
          return null;
        }
      },

      // Update persistence configuration
      updateConfig: (newConfig: Partial<PersistenceConfig>) => {
        Object.assign(defaultConfig, newConfig);
      }
    })),

    // Feature lifecycle hooks
    withHooks({
      onInit(store) {
        // Load initial data
        store.loadFromStorage();

        // Set up auto-save with debouncing
        let saveTimeout: any | null = null;
        
        const destroyRef = inject(DestroyRef);
        
        const autoSaveEffect = effect(() => {
          // Trigger on any state change
          getState(store);
          
          // Clear previous timeout
          if (saveTimeout) {
            clearTimeout(saveTimeout);
          }

          // Set new timeout
          saveTimeout = setTimeout(() => {
            store.saveToStorage();
          }, defaultConfig.debounceMs);
        });

        // Clean up on destroy
        destroyRef.onDestroy(() => {
          if (saveTimeout) {
            clearTimeout(saveTimeout);
          }
          autoSaveEffect.destroy();
        });
      }
    })
  );
}

// Helper functions
function getStorageAPI(storageType: 'localStorage' | 'sessionStorage'): Storage {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
  }
  
  return storageType === 'localStorage' ? localStorage : sessionStorage;
}

function filterStateForPersistence(state: any, config: PersistenceConfig): any {
  const { include, exclude } = config;
  
  // If include list is specified, only include those fields
  if (include && include.length > 0) {
    const filtered: any = {};
    for (const key of include) {
      if (key in state) {
        filtered[key] = state[key];
      }
    }
    return filtered;
  }
  
  // Otherwise, exclude specified fields
  if (exclude && exclude.length > 0) {
    const filtered = { ...state };
    for (const key of exclude) {
      delete filtered[key];
    }
    return filtered;
  }
  
  return state;
}

function migrateState(state: any, fromVersion: number, config: PersistenceConfig): any {
  let migratedState = state;
  const migrations = config.migrations || {};
  
  // Apply migrations sequentially from old version to current
  for (let version = fromVersion + 1; version <= config.version; version++) {
    if (migrations[version]) {
      migratedState = migrations[version](migratedState);
    }
  }
  
  return migratedState;
}

function getStorageSize(key: string, storageType: 'localStorage' | 'sessionStorage'): number {
  try {
    const storage = getStorageAPI(storageType);
    const value = storage.getItem(key);
    return value ? new Blob([value]).size : 0;
  } catch {
    return 0;
  }
}

// Export types for external use
export type { PersistenceConfig, PersistenceState, PersistenceStats };