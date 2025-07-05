
import { FormField } from "@/components/ui/crud-form"

export const formFields: FormField[] = [
  { name: "nama", label: "Nama Produk", type: "text", required: true, placeholder: "Nama produk" },
  { name: "petani", label: "Nama Petani", type: "text", required: true, placeholder: "Nama petani/penjual" },
  { name: "lokasi", label: "Lokasi", type: "text", required: true, placeholder: "Alamat lengkap" },
  { name: "harga", label: "Harga", type: "number", required: true, placeholder: "Harga per satuan" },
  { name: "stok", label: "Stok", type: "number", required: true, placeholder: "Jumlah stok tersedia" },
  { 
    name: "satuan", 
    label: "Satuan", 
    type: "select", 
    required: true,
    options: [
      { value: "kg", label: "Kilogram (kg)" },
      { value: "ton", label: "Ton" },
      { value: "karung", label: "Karung" },
      { value: "liter", label: "Liter" }
    ]
  },
  { 
    name: "kualitas", 
    label: "Kualitas", 
    type: "select", 
    required: true,
    options: [
      { value: "Premium", label: "Premium" },
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" }
    ]
  },
  { name: "deskripsi", label: "Deskripsi", type: "text", required: true, placeholder: "Deskripsi produk" },
  { name: "kontak", label: "Kontak", type: "tel", required: true, placeholder: "Nomor HP/WA" }
]
