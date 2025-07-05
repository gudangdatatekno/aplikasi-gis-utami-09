
export interface Sawah {
  id: number
  nama: string
  petani: string
  luas: number
  koordinat: string
  jenisVarietas: string
  musimTanam: string
  hasilPanen: number
  statusTanam: string
  tanggalTanam?: string
  tanggalPanen?: string
  irigasi?: string
  jenisLahan?: string
  catatan?: string
}
