
export interface StorageKeys {
  PETANI_DATA: 'petani_data';
  SAWAH_DATA: 'sawah_data';
  PRODUK_DATA: 'produk_data';
  KOORDINAT_DATA: 'koordinat_data';
  LAYER_DEMOGRAFI_DATA: 'layer_demografi_data';
  LEGENDA_DATA: 'legenda_data';
}

export const STORAGE_KEYS: StorageKeys = {
  PETANI_DATA: 'petani_data',
  SAWAH_DATA: 'sawah_data',
  PRODUK_DATA: 'produk_data',
  KOORDINAT_DATA: 'koordinat_data',
  LAYER_DEMOGRAFI_DATA: 'layer_demografi_data',
  LEGENDA_DATA: 'legenda_data'
};

export class LocalStorageService {
  private static instance: LocalStorageService;

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Generic CRUD operations
  getAll<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading data from ${key}:`, error);
      return [];
    }
  }

  getById<T extends { id: number }>(key: string, id: number): T | null {
    try {
      const items = this.getAll<T>(key);
      return items.find(item => item.id === id) || null;
    } catch (error) {
      console.error(`Error finding item with id ${id} in ${key}:`, error);
      return null;
    }
  }

  create<T extends { id: number }>(key: string, item: Omit<T, 'id'>): T {
    try {
      const items = this.getAll<T>(key);
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
      const newItem = { ...item, id: newId } as T;
      
      items.push(newItem);
      this.saveAll(key, items);
      
      return newItem;
    } catch (error) {
      console.error(`Error creating item in ${key}:`, error);
      throw new Error(`Failed to create item in ${key}`);
    }
  }

  update<T extends { id: number }>(key: string, updatedItem: T): T {
    try {
      const items = this.getAll<T>(key);
      const index = items.findIndex(item => item.id === updatedItem.id);
      
      if (index === -1) {
        throw new Error(`Item with id ${updatedItem.id} not found in ${key}`);
      }
      
      items[index] = updatedItem;
      this.saveAll(key, items);
      
      return updatedItem;
    } catch (error) {
      console.error(`Error updating item in ${key}:`, error);
      throw new Error(`Failed to update item in ${key}`);
    }
  }

  delete<T extends { id: number }>(key: string, id: number): boolean {
    try {
      const items = this.getAll<T>(key);
      const filteredItems = items.filter(item => item.id !== id);
      
      if (filteredItems.length === items.length) {
        return false; // Item not found
      }
      
      this.saveAll(key, filteredItems);
      return true;
    } catch (error) {
      console.error(`Error deleting item with id ${id} from ${key}:`, error);
      return false;
    }
  }

  saveAll<T>(key: string, items: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving data to ${key}:`, error);
      throw new Error(`Failed to save data to ${key}`);
    }
  }

  clear(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing ${key}:`, error);
    }
  }

  clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  }

  // Bulk operations
  bulkCreate<T extends { id: number }>(key: string, items: Omit<T, 'id'>[]): T[] {
    try {
      const existingItems = this.getAll<T>(key);
      const maxId = existingItems.length > 0 ? Math.max(...existingItems.map(i => i.id)) : 0;
      
      const newItems = items.map((item, index) => ({
        ...item,
        id: maxId + index + 1
      })) as T[];
      
      const allItems = [...existingItems, ...newItems];
      this.saveAll(key, allItems);
      
      return newItems;
    } catch (error) {
      console.error(`Error bulk creating items in ${key}:`, error);
      throw new Error(`Failed to bulk create items in ${key}`);
    }
  }

  // Search and filter operations
  search<T>(key: string, searchTerm: string, searchFields: (keyof T)[]): T[] {
    try {
      const items = this.getAll<T>(key);
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      
      return items.filter(item => 
        searchFields.some(field => {
          const fieldValue = item[field];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(lowercaseSearchTerm);
          }
          if (typeof fieldValue === 'number') {
            return fieldValue.toString().includes(lowercaseSearchTerm);
          }
          return false;
        })
      );
    } catch (error) {
      console.error(`Error searching in ${key}:`, error);
      return [];
    }
  }

  filter<T>(key: string, filterFn: (item: T) => boolean): T[] {
    try {
      const items = this.getAll<T>(key);
      return items.filter(filterFn);
    } catch (error) {
      console.error(`Error filtering in ${key}:`, error);
      return [];
    }
  }

  // Data validation and migration
  validateAndMigrate<T>(key: string, validator: (item: any) => item is T, migrator?: (item: any) => T): T[] {
    try {
      const rawData = localStorage.getItem(key);
      if (!rawData) return [];
      
      const items = JSON.parse(rawData);
      if (!Array.isArray(items)) return [];
      
      const validItems: T[] = [];
      
      items.forEach(item => {
        if (validator(item)) {
          validItems.push(item);
        } else if (migrator) {
          try {
            const migratedItem = migrator(item);
            if (validator(migratedItem)) {
              validItems.push(migratedItem);
            }
          } catch (migrationError) {
            console.warn(`Failed to migrate item:`, item, migrationError);
          }
        }
      });
      
      // Save cleaned data back
      this.saveAll(key, validItems);
      return validItems;
    } catch (error) {
      console.error(`Error validating and migrating ${key}:`, error);
      return [];
    }
  }

  // Export/Import functionality
  exportData(keys?: string[]): Record<string, any[]> {
    try {
      const exportKeys = keys || Object.values(STORAGE_KEYS);
      const exportData: Record<string, any[]> = {};
      
      exportKeys.forEach(key => {
        exportData[key] = this.getAll(key);
      });
      
      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      return {};
    }
  }

  importData(data: Record<string, any[]>, overwrite: boolean = false): void {
    try {
      Object.entries(data).forEach(([key, items]) => {
        if (overwrite) {
          this.saveAll(key, items);
        } else {
          const existingItems = this.getAll(key);
          const combinedItems = [...existingItems, ...items];
          this.saveAll(key, combinedItems);
        }
      });
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }
}

export const localStorageService = LocalStorageService.getInstance();
