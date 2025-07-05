
export interface Koordinat {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
  tipe: string;
  deskripsi: string;
}

export interface LayerDemografi {
  id: number;
  nama: string;
  warna: string;
  properti: string;
  rentangNilai: string;
  visible: boolean;
}

export interface LegendaItem {
  id: number;
  label: string;
  warna: string;
  simbol: string;
  kategori: string;
}
