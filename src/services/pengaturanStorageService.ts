import { localStorageService, STORAGE_KEYS } from './localStorageService';
import { Koordinat, LayerDemografi, LegendaItem } from '../components/pengaturan/pengaturan-types';

export class PengaturanStorageService {
  private static instance: PengaturanStorageService;

  static getInstance(): PengaturanStorageService {
    if (!PengaturanStorageService.instance) {
      PengaturanStorageService.instance = new PengaturanStorageService();
    }
    return PengaturanStorageService.instance;
  }

  // Koordinat methods
  initializeKoordinatData(): void {
    const existingData = this.getAllKoordinat();
    if (existingData.length === 0) {
      const defaultKoordinat: Omit<Koordinat, 'id'>[] = [
        {
          nama: "Balai Desa Sumberagung",
          latitude: -7.0521,
          longitude: 110.7987,
          tipe: "Fasilitas Umum",
          deskripsi: "Kantor balai desa dan pusat administrasi Desa Sumberagung"
        },
        {
          nama: "Pasar Tradisional Sumberagung",
          latitude: -7.0525,
          longitude: 110.7995,
          tipe: "Ekonomi",
          deskripsi: "Pasar tradisional untuk perdagangan hasil pertanian dan kebutuhan sehari-hari"
        },
        {
          nama: "Masjid Al-Ikhlas Sumberagung",
          latitude: -7.0518,
          longitude: 110.7985,
          tipe: "Fasilitas Umum",
          deskripsi: "Masjid utama desa untuk kegiatan keagamaan dan aktivitas kemasyarakatan"
        },
        {
          nama: "SD Negeri Sumberagung 1",
          latitude: -7.0515,
          longitude: 110.7992,
          tipe: "Pendidikan",
          deskripsi: "Sekolah dasar negeri di Desa Sumberagung"
        },
        {
          nama: "Puskesmas Pembantu Sumberagung",
          latitude: -7.0528,
          longitude: 110.7980,
          tipe: "Kesehatan",
          deskripsi: "Fasilitas kesehatan masyarakat desa"
        },
        {
          nama: "Wilayah Persawahan Utara Sumberagung",
          latitude: -7.0510,
          longitude: 110.7975,
          tipe: "Pertanian",
          deskripsi: "Area persawahan irigasi teknis di bagian utara Desa Sumberagung"
        },
        {
          nama: "Wilayah Persawahan Selatan Sumberagung",
          latitude: -7.0535,
          longitude: 110.8000,
          tipe: "Pertanian",
          deskripsi: "Area persawahan tadah hujan di bagian selatan Desa Sumberagung"
        },
        {
          nama: "Wilayah Persawahan Timur Sumberagung",
          latitude: -7.0520,
          longitude: 110.8010,
          tipe: "Pertanian",
          deskripsi: "Area persawahan irigasi semi teknis di bagian timur Desa Sumberagung"
        },
        {
          nama: "Wilayah Persawahan Barat Sumberagung",
          latitude: -7.0525,
          longitude: 110.7965,
          tipe: "Pertanian",
          deskripsi: "Area persawahan dengan sistem irigasi tradisional di bagian barat Desa Sumberagung"
        }
      ];
      
      localStorageService.bulkCreate<Koordinat>(STORAGE_KEYS.KOORDINAT_DATA, defaultKoordinat);
    }
  }

  getAllKoordinat(): Koordinat[] {
    return localStorageService.getAll<Koordinat>(STORAGE_KEYS.KOORDINAT_DATA);
  }

  getKoordinatById(id: number): Koordinat | null {
    return localStorageService.getById<Koordinat>(STORAGE_KEYS.KOORDINAT_DATA, id);
  }

  createKoordinat(koordinat: Omit<Koordinat, 'id'>): Koordinat {
    return localStorageService.create<Koordinat>(STORAGE_KEYS.KOORDINAT_DATA, koordinat);
  }

  updateKoordinat(koordinat: Koordinat): Koordinat {
    return localStorageService.update<Koordinat>(STORAGE_KEYS.KOORDINAT_DATA, koordinat);
  }

  deleteKoordinat(id: number): boolean {
    return localStorageService.delete<Koordinat>(STORAGE_KEYS.KOORDINAT_DATA, id);
  }

  // Layer Demografi methods
  initializeLayerData(): void {
    const existingData = this.getAllLayer();
    if (existingData.length === 0) {
      const defaultLayers: Omit<LayerDemografi, 'id'>[] = [
        {
          nama: "Kepadatan Penduduk Desa Sumberagung",
          warna: "#3B82F6",
          properti: "populasi",
          rentangNilai: "150-400 jiwa/km²",
          visible: true
        },
        {
          nama: "Sebaran Area Persawahan",
          warna: "#22C55E",
          properti: "pertanian",
          rentangNilai: "Sawah Irigasi - Tadah Hujan",
          visible: true
        },
        {
          nama: "Tingkat Pendidikan",
          warna: "#10B981",
          properti: "pendidikan",
          rentangNilai: "SD-Perguruan Tinggi",
          visible: true
        },
        {
          nama: "Mata Pencaharian Utama",
          warna: "#F59E0B",
          properti: "pekerjaan",
          rentangNilai: "Petani-Pedagang",
          visible: true
        }
      ];
      
      localStorageService.bulkCreate<LayerDemografi>(STORAGE_KEYS.LAYER_DEMOGRAFI_DATA, defaultLayers);
    }
  }

  getAllLayer(): LayerDemografi[] {
    return localStorageService.getAll<LayerDemografi>(STORAGE_KEYS.LAYER_DEMOGRAFI_DATA);
  }

  getLayerById(id: number): LayerDemografi | null {
    return localStorageService.getById<LayerDemografi>(STORAGE_KEYS.LAYER_DEMOGRAFI_DATA, id);
  }

  createLayer(layer: Omit<LayerDemografi, 'id'>): LayerDemografi {
    return localStorageService.create<LayerDemografi>(STORAGE_KEYS.LAYER_DEMOGRAFI_DATA, layer);
  }

  updateLayer(layer: LayerDemografi): LayerDemografi {
    return localStorageService.update<LayerDemografi>(STORAGE_KEYS.LAYER_DEMOGRAFI_DATA, layer);
  }

  deleteLayer(id: number): boolean {
    return localStorageService.delete<LayerDemografi>(STORAGE_KEYS.LAYER_DEMOGRAFI_DATA, id);
  }

  // Legenda methods
  initializeLegendaData(): void {
    const existingData = this.getAllLegenda();
    if (existingData.length === 0) {
      const defaultLegenda: Omit<LegendaItem, 'id'>[] = [
        {
          label: "Sawah Irigasi Teknis",
          warna: "#22C55E",
          simbol: "polygon",
          kategori: "Pertanian"
        },
        {
          label: "Sawah Tadah Hujan",
          warna: "#84CC16",
          simbol: "polygon",
          kategori: "Pertanian"
        },
        {
          label: "Sawah Irigasi Semi Teknis",
          warna: "#65A30D",
          simbol: "polygon",
          kategori: "Pertanian"
        },
        {
          label: "Pemukiman Penduduk",
          warna: "#F59E0B",
          simbol: "polygon",
          kategori: "Demografi"
        },
        {
          label: "Fasilitas Umum",
          warna: "#3B82F6",
          simbol: "marker",
          kategori: "Infrastruktur"
        },
        {
          label: "Area Perdagangan",
          warna: "#8B5CF6",
          simbol: "marker",
          kategori: "Ekonomi"
        },
        {
          label: "Fasilitas Pendidikan",
          warna: "#06B6D4",
          simbol: "marker",
          kategori: "Infrastruktur"
        },
        {
          label: "Fasilitas Kesehatan",
          warna: "#EF4444",
          simbol: "marker",
          kategori: "Infrastruktur"
        }
      ];
      
      localStorageService.bulkCreate<LegendaItem>(STORAGE_KEYS.LEGENDA_DATA, defaultLegenda);
    }
  }

  getAllLegenda(): LegendaItem[] {
    return localStorageService.getAll<LegendaItem>(STORAGE_KEYS.LEGENDA_DATA);
  }

  getLegendaById(id: number): LegendaItem | null {
    return localStorageService.getById<LegendaItem>(STORAGE_KEYS.LEGENDA_DATA, id);
  }

  createLegenda(legenda: Omit<LegendaItem, 'id'>): LegendaItem {
    return localStorageService.create<LegendaItem>(STORAGE_KEYS.LEGENDA_DATA, legenda);
  }

  updateLegenda(legenda: LegendaItem): LegendaItem {
    return localStorageService.update<LegendaItem>(STORAGE_KEYS.LEGENDA_DATA, legenda);
  }

  deleteLegenda(id: number): boolean {
    return localStorageService.delete<LegendaItem>(STORAGE_KEYS.LEGENDA_DATA, id);
  }

  // Utility methods
  exportAllPengaturan(): Record<string, any[]> {
    return {
      koordinat: this.getAllKoordinat(),
      layers: this.getAllLayer(),
      legenda: this.getAllLegenda()
    };
  }

  importAllPengaturan(data: Record<string, any[]>, overwrite: boolean = false): void {
    if (data.koordinat) {
      if (overwrite) {
        localStorageService.saveAll(STORAGE_KEYS.KOORDINAT_DATA, data.koordinat);
      } else {
        data.koordinat.forEach(item => this.createKoordinat(item));
      }
    }
    
    if (data.layers) {
      if (overwrite) {
        localStorageService.saveAll(STORAGE_KEYS.LAYER_DEMOGRAFI_DATA, data.layers);
      } else {
        data.layers.forEach(item => this.createLayer(item));
      }
    }
    
    if (data.legenda) {
      if (overwrite) {
        localStorageService.saveAll(STORAGE_KEYS.LEGENDA_DATA, data.legenda);
      } else {
        data.legenda.forEach(item => this.createLegenda(item));
      }
    }
  }
}

export const pengaturanStorageService = PengaturanStorageService.getInstance();
