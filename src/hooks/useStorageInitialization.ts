
import { useEffect, useState } from 'react';
import { petaniStorageService } from '../services/petaniStorageService';
import { sawahStorageService } from '../services/sawahStorageService';
import { produkStorageService } from '../services/produkStorageService';
import { pengaturanStorageService } from '../services/pengaturanStorageService';

export const useStorageInitialization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize all storage services with default data
        petaniStorageService.initializeDefaultData();
        sawahStorageService.initializeDefaultData();
        produkStorageService.initializeDefaultData();
        pengaturanStorageService.initializeKoordinatData();
        pengaturanStorageService.initializeLayerData();
        pengaturanStorageService.initializeLegendaData();

        console.log('Local storage initialized successfully');
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing storage:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    initializeStorage();
  }, []);

  const resetAllData = () => {
    try {
      // Clear all storage
      petaniStorageService.getAllPetani().forEach(p => petaniStorageService.deletePetani(p.id));
      sawahStorageService.getAllSawah().forEach(s => sawahStorageService.deleteSawah(s.id));
      produkStorageService.getAllProduk().forEach(p => produkStorageService.deleteProduk(p.id));
      pengaturanStorageService.getAllKoordinat().forEach(k => pengaturanStorageService.deleteKoordinat(k.id));
      pengaturanStorageService.getAllLayer().forEach(l => pengaturanStorageService.deleteLayer(l.id));
      pengaturanStorageService.getAllLegenda().forEach(l => pengaturanStorageService.deleteLegenda(l.id));

      // Re-initialize with default data
      petaniStorageService.initializeDefaultData();
      sawahStorageService.initializeDefaultData();
      produkStorageService.initializeDefaultData();
      pengaturanStorageService.initializeKoordinatData();
      pengaturanStorageService.initializeLayerData();
      pengaturanStorageService.initializeLegendaData();

      console.log('All data reset successfully');
    } catch (err) {
      console.error('Error resetting data:', err);
      throw err;
    }
  };

  return {
    isInitialized,
    isLoading,
    error,
    resetAllData
  };
};
