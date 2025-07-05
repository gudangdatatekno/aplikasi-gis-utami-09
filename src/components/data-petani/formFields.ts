
import { FormField } from "@/components/ui/crud-form"

export const petaniFormFields: FormField[] = [
  { name: "nama", label: "Nama Lengkap", type: "text", required: true, placeholder: "Masukkan nama lengkap petani" },
  { name: "umur", label: "Umur", type: "number", required: true, placeholder: "Masukkan umur" },
  { 
    name: "jenisKelamin", 
    label: "Jenis Kelamin", 
    type: "select", 
    required: true,
    options: [
      { value: "Laki-laki", label: "Laki-laki" },
      { value: "Perempuan", label: "Perempuan" }
    ]
  },
  { name: "alamat", label: "Alamat Lengkap", type: "textarea", required: true, placeholder: "Masukkan alamat lengkap" },
  { name: "noTelepon", label: "No. Telepon", type: "tel", required: false, placeholder: "Contoh: 081234567890" },
  { name: "email", label: "Email", type: "email", required: false, placeholder: "Contoh: petani@email.com" },
  { 
    name: "pendidikan", 
    label: "Pendidikan Terakhir", 
    type: "select", 
    required: false,
    options: [
      { value: "SD", label: "SD" },
      { value: "SMP", label: "SMP" },
      { value: "SMA", label: "SMA" },
      { value: "Diploma", label: "Diploma" },
      { value: "Sarjana", label: "Sarjana" }
    ]
  },
  { name: "pengalaman", label: "Pengalaman Bertani (Tahun)", type: "number", required: false, placeholder: "Lama pengalaman dalam tahun" },
  { name: "jumlahSawah", label: "Jumlah Lahan Sawah", type: "number", required: true, placeholder: "Jumlah lahan sawah" },
  { name: "totalLuas", label: "Total Luas Lahan (Ha)", type: "number", required: true, placeholder: "Total luas dalam hektar", step: "0.1" },
  { name: "totalHasil", label:  "Total Hasil Panen (Ton)", type: "number", required: true, placeholder: "Total hasil panen terakhir", step: "0.1" },
  { 
    name: "status", 
    label: "Status", 
    type: "select", 
    required: true,
    options: [
      { value: "Aktif", label: "Aktif" },
      { value: "Tidak Aktif", label: "Tidak Aktif" }
    ]
  }
]
