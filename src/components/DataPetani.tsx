
import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import { CrudForm } from "@/components/ui/crud-form"
import { useToast } from "@/hooks/use-toast"
import { Petani } from "./data-petani/types"
import { petaniFormFields } from "./data-petani/formFields"
import { createPetaniColumns } from "./data-petani/PetaniColumns"
import { DeletePetaniDialog } from "./data-petani/DeletePetaniDialog"
import { petaniStorageService } from "../services/petaniStorageService"

export const DataPetani = () => {
  const { toast } = useToast()
  const [petaniData, setPetaniData] = useState<Petani[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedPetani, setSelectedPetani] = useState<Petani | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [petaniToDelete, setPetaniToDelete] = useState<Petani | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load data from storage on component mount
  useEffect(() => {
    loadPetaniData()
  }, [])

  const loadPetaniData = () => {
    try {
      const data = petaniStorageService.getAllPetani()
      setPetaniData(data)
    } catch (error) {
      console.error('Error loading petani data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data petani",
        variant: "destructive"
      })
    }
  }

  const handleAdd = () => {
    setFormMode("create")
    setSelectedPetani(null)
    setIsFormOpen(true)
  }

  const handleEdit = (petani: Petani) => {
    setFormMode("edit")
    setSelectedPetani(petani)
    setIsFormOpen(true)
  }

  const handleDelete = (petani: Petani) => {
    setPetaniToDelete(petani)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (petaniToDelete) {
      setIsLoading(true)
      try {
        const success = petaniStorageService.deletePetani(petaniToDelete.id)
        if (success) {
          loadPetaniData() // Reload data after deletion
          toast({
            title: "Berhasil",
            description: `Data petani ${petaniToDelete.nama} berhasil dihapus.`,
          })
        } else {
          throw new Error('Failed to delete petani')
        }
      } catch (error) {
        console.error('Error deleting petani:', error)
        toast({
          title: "Error",
          description: "Gagal menghapus data petani",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
        setPetaniToDelete(null)
        setDeleteDialogOpen(false)
      }
    }
  }

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      if (formMode === "create") {
        const newPetani = petaniStorageService.createPetani({
          nama: data.nama,
          umur: data.umur,
          alamat: data.alamat,
          jumlahSawah: data.jumlahSawah,
          totalLuas: data.totalLuas,
          totalHasil: data.totalHasil,
          status: data.status,
          noTelepon: data.noTelepon,
          email: data.email,
          jenisKelamin: data.jenisKelamin,
          pendidikan: data.pendidikan,
          pengalaman: data.pengalaman
        })
        
        loadPetaniData() // Reload data after creation
        toast({
          title: "Berhasil",
          description: `Data petani ${newPetani.nama} berhasil ditambahkan.`,
        })
      } else if (formMode === "edit" && selectedPetani) {
        const updatedPetani = petaniStorageService.updatePetani({
          ...selectedPetani,
          nama: data.nama,
          umur: data.umur,
          alamat: data.alamat,
          jumlahSawah: data.jumlahSawah,
          totalLuas: data.totalLuas,
          totalHasil: data.totalHasil,
          status: data.status,
          noTelepon: data.noTelepon,
          email: data.email,
          jenisKelamin: data.jenisKelamin,
          pendidikan: data.pendidikan,
          pengalaman: data.pengalaman
        })
        
        loadPetaniData() // Reload data after update
        toast({
          title: "Berhasil",
          description: `Data petani ${updatedPetani.nama} berhasil diperbarui.`,
        })
      }
    } catch (error) {
      console.error('Error saving petani:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data petani",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsFormOpen(false)
    }
  }

  const columns = createPetaniColumns({
    onEdit: handleEdit,
    onDelete: handleDelete
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data Petani</h2>
        <p className="text-gray-600">Kelola data petani dengan fitur CRUD lengkap dan form yang lebih detail</p>
      </div>

      <DataTable
        columns={columns}
        data={petaniData}
        searchKey="nama"
        onAdd={handleAdd}
        addButtonLabel="Tambah Petani"
        title="Data Petani"
      />

      <CrudForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        fields={petaniFormFields}
        title={formMode === "create" ? "Tambah Petani Baru" : "Edit Data Petani"}
        description={formMode === "create" ? "Masukkan data petani baru dengan lengkap" : "Perbarui data petani"}
        initialData={selectedPetani}
        mode={formMode}
        wide={true}
      />

      <DeletePetaniDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        petani={petaniToDelete}
      />
    </div>
  )
}
