
import { localStorageService, STORAGE_KEYS } from './localStorageService';
import { Petani } from '../components/data-petani/types';

export class PetaniStorageService {
  private static instance: PetaniStorageService;
  private readonly storageKey = STORAGE_KEYS.PETANI_DATA;

  static getInstance(): PetaniStorageService {
    if (!PetaniStorageService.instance) {
      PetaniStorageService.instance = new PetaniStorageService();
    }
    return PetaniStorageService.instance;
  }

  // Initialize with default data if empty
  initializeDefaultData(): void {
    const existingData = this.getAllPetani();
    if (existingData.length === 0) {
      const defaultPetani: Omit<Petani, 'id'>[] = [
        {
          nama: "Budi Santoso",
          umur: 45,
          alamat: "Desa Sukamaju RT 02/03",
          jumlahSawah: 2,
          totalLuas: 2.5,
          totalHasil: 20.5,
          status: "Aktif",
          noTelepon: "081234567890",
          email: "budi.santoso@email.com",
          jenisKelamin: "Laki-laki",
          pendidikan: "SMA",
          pengalaman: 20
        },
        {
          nama: "Sari Wati",
          umur: 38,
          alamat: "Desa Sukamaju RT 01/02",
          jumlahSawah: 1,
          totalLuas: 1.8,
          totalHasil: 11.7,
          status: "Aktif",
          noTelepon: "081234567891",
          email: "sari.wati@email.com",
          jenisKelamin: "Perempuan",
          pendidikan: "SMP",
          pengalaman: 15
        }
      ];
      
      localStorageService.bulkCreate<Petani>(this.storageKey, defaultPetani);
    }
  }

  getAllPetani(): Petani[] {
    return localStorageService.getAll<Petani>(this.storageKey);
  }

  getPetaniById(id: number): Petani | null {
    return localStorageService.getById<Petani>(this.storageKey, id);
  }

  createPetani(petani: Omit<Petani, 'id'>): Petani {
    return localStorageService.create<Petani>(this.storageKey, petani);
  }

  updatePetani(petani: Petani): Petani {
    return localStorageService.update<Petani>(this.storageKey, petani);
  }

  deletePetani(id: number): boolean {
    return localStorageService.delete<Petani>(this.storageKey, id);
  }

  searchPetani(searchTerm: string): Petani[] {
    return localStorageService.search<Petani>(
      this.storageKey, 
      searchTerm, 
      ['nama', 'alamat', 'status', 'email', 'noTelepon']
    );
  }

  getPetaniByStatus(status: string): Petani[] {
    return localStorageService.filter<Petani>(
      this.storageKey,
      petani => petani.status === status
    );
  }

  getPetaniByPendidikan(pendidikan: string): Petani[] {
    return localStorageService.filter<Petani>(
      this.storageKey,
      petani => petani.pendidikan === pendidikan
    );
  }

  getTotalPetani(): number {
    return this.getAllPetani().length;
  }

  getTotalLuasLahan(): number {
    return this.getAllPetani().reduce((total, petani) => total + petani.totalLuas, 0);
  }

  getTotalHasilPanen(): number {
    return this.getAllPetani().reduce((total, petani) => total + petani.totalHasil, 0);
  }
}

export const petaniStorageService = PetaniStorageService.getInstance();
