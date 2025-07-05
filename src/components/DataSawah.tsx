
import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import { CrudForm } from "@/components/ui/crud-form"
import { useToast } from "@/hooks/use-toast"
import { Sawah } from "./data-sawah/types"
import { sawahFormFields } from "./data-sawah/formFields"
import { createSawahColumns } from "./data-sawah/SawahColumns"
import { DeleteSawahDialog } from "./data-sawah/DeleteSawahDialog"
import { sawahStorageService } from "../services/sawahStorageService"

export const DataSawah = () => {
  const { toast } = useToast()
  const [sawahData, setSawahData] = useState<Sawah[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedSawah, setSelectedSawah] = useState<Sawah | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sawahToDelete, setSawahToDelete] = useState<Sawah | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSawahData()
  }, [])

  const loadSawahData = () => {
    try {
      const data = sawahStorageService.getAllSawah()
      setSawahData(data)
    } catch (error) {
      console.error('Error loading sawah data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data sawah",
        variant: "destructive"
      })
    }
  }

  const handleAdd = () => {
    setFormMode("create")
    setSelectedSawah(null)
    setIsFormOpen(true)
  }

  const handleEdit = (sawah: Sawah) => {
    setFormMode("edit")
    setSelectedSawah(sawah)
    setIsFormOpen(true)
  }

  const handleDelete = (sawah: Sawah) => {
    setSawahToDelete(sawah)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (sawahToDelete) {
      setIsLoading(true)
      try {
        const success = sawahStorageService.deleteSawah(sawahToDelete.id)
        if (success) {
          loadSawahData()
          toast({
            title: "Berhasil",
            description: `Data sawah ${sawahToDelete.nama} berhasil dihapus.`,
          })
        } else {
          throw new Error('Failed to delete sawah')
        }
      } catch (error) {
        console.error('Error deleting sawah:', error)
        toast({
          title: "Error",
          description: "Gagal menghapus data sawah",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
        setSawahToDelete(null)
        setDeleteDialogOpen(false)
      }
    }
  }

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      if (formMode === "create") {
        const newSawah = sawahStorageService.createSawah({
          nama: data.nama,
          petani: data.petani,
          luas: data.luas,
          koordinat: data.koordinat,
          jenisVarietas: data.jenisVarietas,
          musimTanam: data.musimTanam,
          hasilPanen: data.hasilPanen,
          statusTanam: data.statusTanam,
          tanggalTanam: data.tanggalTanam,
          tanggalPanen: data.tanggalPanen,
          irigasi: data.irigasi,
          jenisLahan: data.jenisLahan,
          catatan: data.catatan
        })
        
        loadSawahData()
        toast({
          title: "Berhasil",
          description: `Data sawah ${newSawah.nama} berhasil ditambahkan.`,
        })
      } else if (formMode === "edit" && selectedSawah) {
        const updatedSawah = sawahStorageService.updateSawah({
          ...selectedSawah,
          nama: data.nama,
          petani: data.petani,
          luas: data.luas,
          koordinat: data.koordinat,
          jenisVarietas: data.jenisVarietas,
          musimTanam: data.musimTanam,
          hasilPanen: data.hasilPanen,
          statusTanam: data.statusTanam,
          tanggalTanam: data.tanggalTanam,
          tanggalPanen: data.tanggalPanen,
          irigasi: data.irigasi,
          jenisLahan: data.jenisLahan,
          catatan: data.catatan
        })
        
        loadSawahData()
        toast({
          title: "Berhasil",
          description: `Data sawah ${updatedSawah.nama} berhasil diperbarui.`,
        })
      }
    } catch (error) {
      console.error('Error saving sawah:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data sawah",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsFormOpen(false)
    }
  }

  const columns = createSawahColumns({
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data Sawah</h2>
        <p className="text-gray-600">Kelola data lahan sawah dengan fitur CRUD lengkap dan informasi detail</p>
      </div>

      <DataTable
        columns={columns}
        data={sawahData}
        searchKey="nama"
        onAdd={handleAdd}
        addButtonLabel="Tambah Sawah"
        title="Data Sawah"
      />

      <CrudForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        fields={sawahFormFields}
        title={formMode === "create" ? "Tambah Data Sawah Baru" : "Edit Data Sawah"}
        description={formMode === "create" ? "Masukkan data sawah baru dengan informasi lengkap" : "Perbarui data sawah"}
        initialData={selectedSawah}
        mode={formMode}
        wide={true}
      />

      <DeleteSawahDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        sawah={sawahToDelete}
      />
    </div>
  )
}
