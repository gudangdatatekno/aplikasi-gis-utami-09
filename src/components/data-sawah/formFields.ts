
import { FormField } from "@/components/ui/crud-form"

export const sawahFormFields: FormField[] = [
  { name: "nama", label: "Nama/Kode Sawah", type: "text", required: true, placeholder: "Contoh: Sawah Pak Budi - Blok A" },
  { name: "petani", label: "Nama Petani Pemilik", type: "text", required: true, placeholder: "Nama pemilik sawah" },
  { name: "luas", label: "Luas Lahan (Ha)", type: "number", required: true, placeholder: "Luas dalam hektar", step: "0.1" },
  { name: "koordinat", label: "Koordinat GPS", type: "text", required: true, placeholder: "Contoh: -7.2575, 112.7521" },
  { 
    name: "jenisLahan", 
    label: "Jenis Lahan", 
    type: "select", 
    required: true,
    options: [
      { value: "Sawah Irigasi", label: "Sawah Irigasi" },
      { value: "Sawah Tadah Hujan", label: "Sawah Tadah Hujan" },
      { value: "Sawah Rawa", label: "Sawah Rawa" },
      { value: "Sawah Lebak", label: "Sawah Lebak" }
    ]
  },
  { 
    name: "irigasi", 
    label: "Sistem Irigasi", 
    type: "select", 
    required: true,
    options: [
      { value: "Teknis", label: "Teknis" },
      { value: "Semi Teknis", label: "Semi Teknis" },
      { value: "Sederhana", label: "Sederhana" },
      { value: "Tadah Hujan", label: "Tadah Hujan" }
    ]
  },
  { 
    name: "jenisVarietas", 
    label: "Jenis Varietas Padi", 
    type: "select", 
    required: true,
    options: [
      { value: "IR64", label: "IR64" },
      { value: "Ciherang", label: "Ciherang" },
      { value: "Inpari 32", label: "Inpari 32" },
      { value: "Segreng", label: "Segreng" },
      { value: "Mapan", label: "Mapan" },
      { value: "Mekongga", label: "Mekongga" }
    ]
  },
  { name: "musimTanam", label: "Musim Tanam", type: "text", required: true, placeholder: "Contoh: Gadu 2024 atau Rendeng 2024" },
  { name: "tanggalTanam", label: "Tanggal Tanam", type: "date", required: false },
  { name: "tanggalPanen", label: "Tanggal Panen (Estimasi/Aktual)", type: "date", required: false },
  { name: "hasilPanen", label: "Hasil Panen (Ton/Ha)", type: "number", required: true, placeholder: "Hasil panen per hektar", step: "0.1" },
  { 
    name: "statusTanam", 
    label: "Status Pertumbuhan", 
    type: "select", 
    required: true,
    options: [
      { value: "Persiapan", label: "Persiapan Lahan" },
      { value: "Tanam", label: "Masa Tanam" },
      { value: "Vegetatif", label: "Fase Vegetatif" },
      { value: "Generatif", label: "Fase Generatif" },
      { value: "Panen", label: "Siap Panen/Sudah Panen" },
      { value: "Bera", label: "Masa Bera" }
    ]
  },
  { name: "catatan", label: "Catatan Tambahan", type: "textarea", required: false, placeholder: "Catatan kondisi lahan, kendala, atau informasi lainnya" }
]
