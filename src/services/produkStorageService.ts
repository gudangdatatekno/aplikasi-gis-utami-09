
import { localStorageService, STORAGE_KEYS } from './localStorageService';
import { Produk } from '../components/marketplace/types';

export class ProdukStorageService {
  private static instance: ProdukStorageService;
  private readonly storageKey = STORAGE_KEYS.PRODUK_DATA;

  static getInstance(): ProdukStorageService {
    if (!ProdukStorageService.instance) {
      ProdukStorageService.instance = new ProdukStorageService();
    }
    return ProdukStorageService.instance;
  }

  initializeDefaultData(): void {
    const existingData = this.getAllProduk();
    if (existingData.length === 0) {
      const defaultProduk: Omit<Produk, 'id'>[] = [
        {
          nama: "Beras Premium",
          petani: "Budi Santoso",
          lokasi: "Desa Sukamaju RT 02/03",
          harga: 12000,
          stok: 500,
          satuan: "kg",
          kualitas: "A",
          deskripsi: "Beras berkualitas premium dari sawah organik",
          kontak: "081234567890"
        },
        {
          nama: "Beras Merah Organik",
          petani: "Sari Wati",
          lokasi: "Desa Sukamaju RT 01/02",
          harga: 15000,
          stok: 250,
          satuan: "kg",
          kualitas: "Premium",
          deskripsi: "Beras merah organik tanpa pestisida",
          kontak: "081234567891"
        }
      ];
      
      localStorageService.bulkCreate<Produk>(this.storageKey, defaultProduk);
    }
  }

  getAllProduk(): Produk[] {
    return localStorageService.getAll<Produk>(this.storageKey);
  }

  getProdukById(id: number): Produk | null {
    return localStorageService.getById<Produk>(this.storageKey, id);
  }

  createProduk(produk: Omit<Produk, 'id'>): Produk {
    return localStorageService.create<Produk>(this.storageKey, produk);
  }

  updateProduk(produk: Produk): Produk {
    return localStorageService.update<Produk>(this.storageKey, produk);
  }

  deleteProduk(id: number): boolean {
    return localStorageService.delete<Produk>(this.storageKey, id);
  }

  searchProduk(searchTerm: string): Produk[] {
    return localStorageService.search<Produk>(
      this.storageKey, 
      searchTerm, 
      ['nama', 'petani', 'lokasi', 'kualitas', 'deskripsi']
    );
  }

  getProdukByPetani(petani: string): Produk[] {
    return localStorageService.filter<Produk>(
      this.storageKey,
      produk => produk.petani === petani
    );
  }

  getProdukByKualitas(kualitas: string): Produk[] {
    return localStorageService.filter<Produk>(
      this.storageKey,
      produk => produk.kualitas === kualitas
    );
  }

  getProdukInStock(): Produk[] {
    return localStorageService.filter<Produk>(
      this.storageKey,
      produk => produk.stok > 0
    );
  }

  getProdukByPriceRange(minPrice: number, maxPrice: number): Produk[] {
    return localStorageService.filter<Produk>(
      this.storageKey,
      produk => produk.harga >= minPrice && produk.harga <= maxPrice
    );
  }

  updateStok(id: number, newStok: number): boolean {
    try {
      const produk = this.getProdukById(id);
      if (!produk) return false;
      
      produk.stok = newStok;
      this.updateProduk(produk);
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      return false;
    }
  }

  getTotalNilaiInventory(): number {
    return this.getAllProduk().reduce((total, produk) => total + (produk.harga * produk.stok), 0);
  }

  getTotalStok(): number {
    return this.getAllProduk().reduce((total, produk) => total + produk.stok, 0);
  }
}

export const produkStorageService = ProdukStorageService.getInstance();
