
import { localStorageService, STORAGE_KEYS } from './localStorageService';
import { Sawah } from '../components/data-sawah/types';

export class SawahStorageService {
  private static instance: SawahStorageService;
  private readonly storageKey = STORAGE_KEYS.SAWAH_DATA;

  static getInstance(): SawahStorageService {
    if (!SawahStorageService.instance) {
      SawahStorageService.instance = new SawahStorageService();
    }
    return SawahStorageService.instance;
  }

  initializeDefaultData(): void {
    const existingData = this.getAllSawah();
    if (existingData.length === 0) {
      const defaultSawah: Omit<Sawah, 'id'>[] = [
        {
          nama: "Sawah Pak Budi - Blok A",
          petani: "Budi Santoso",
          luas: 2.5,
          koordinat: "-7.2575, 112.7521",
          jenisVarietas: "IR64",
          musimTanam: "Gadu 2024",
          hasilPanen: 8.2,
          statusTanam: "Panen",
          tanggalTanam: "2024-01-15",
          tanggalPanen: "2024-05-20",
          irigasi: "Teknis",
          jenisLahan: "Sawah Irigasi",
          catatan: "Hasil panen memuaskan, kualitas gabah baik"
        },
        {
          nama: "Sawah Bu Sari - Blok B",
          petani: "Sari Wati",
          luas: 1.8,
          koordinat: "-7.2585, 112.7531",
          jenisVarietas: "Ciherang",
          musimTanam: "Rendeng 2024",
          hasilPanen: 6.5,
          statusTanam: "Tanam",
          tanggalTanam: "2024-11-01",
          tanggalPanen: "2025-03-15",
          irigasi: "Semi Teknis",
          jenisLahan: "Sawah Irigasi",
          catatan: "Pertumbuhan normal, perlu pupuk tambahan"
        }
      ];
      
      localStorageService.bulkCreate<Sawah>(this.storageKey, defaultSawah);
    }
  }

  getAllSawah(): Sawah[] {
    return localStorageService.getAll<Sawah>(this.storageKey);
  }

  getSawahById(id: number): Sawah | null {
    return localStorageService.getById<Sawah>(this.storageKey, id);
  }

  createSawah(sawah: Omit<Sawah, 'id'>): Sawah {
    return localStorageService.create<Sawah>(this.storageKey, sawah);
  }

  updateSawah(sawah: Sawah): Sawah {
    return localStorageService.update<Sawah>(this.storageKey, sawah);
  }

  deleteSawah(id: number): boolean {
    return localStorageService.delete<Sawah>(this.storageKey, id);
  }

  searchSawah(searchTerm: string): Sawah[] {
    return localStorageService.search<Sawah>(
      this.storageKey, 
      searchTerm, 
      ['nama', 'petani', 'jenisVarietas', 'statusTanam', 'musimTanam']
    );
  }

  getSawahByPetani(petani: string): Sawah[] {
    return localStorageService.filter<Sawah>(
      this.storageKey,
      sawah => sawah.petani === petani
    );
  }

  getSawahByStatus(status: string): Sawah[] {
    return localStorageService.filter<Sawah>(
      this.storageKey,
      sawah => sawah.statusTanam === status
    );
  }

  getSawahByVarietas(varietas: string): Sawah[] {
    return localStorageService.filter<Sawah>(
      this.storageKey,
      sawah => sawah.jenisVarietas === varietas
    );
  }

  getTotalLuas(): number {
    return this.getAllSawah().reduce((total, sawah) => total + sawah.luas, 0);
  }

  getTotalHasilPanen(): number {
    return this.getAllSawah().reduce((total, sawah) => total + sawah.hasilPanen, 0);
  }

  getAverageHasilPerHektar(): number {
    const allSawah = this.getAllSawah();
    if (allSawah.length === 0) return 0;
    
    const totalHasil = this.getTotalHasilPanen();
    const totalLuas = this.getTotalLuas();
    
    return totalLuas > 0 ? totalHasil / totalLuas : 0;
  }
}

export const sawahStorageService = SawahStorageService.getInstance();
