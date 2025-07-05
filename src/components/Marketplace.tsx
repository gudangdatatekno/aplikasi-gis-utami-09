
import { useState, useEffect } from "react"
import { DataTable } from "@/components/ui/data-table"
import { CrudForm } from "@/components/ui/crud-form"
import { useToast } from "@/hooks/use-toast"
import { Produk } from "./marketplace/types"
import { ProductDetailDialog } from "./marketplace/ProductDetailDialog"
import { DeleteConfirmationDialog } from "./marketplace/DeleteConfirmationDialog"
import { createProductColumns } from "./marketplace/ProductColumns"
import { formFields } from "./marketplace/formFields"
import { produkStorageService } from "../services/produkStorageService"

export const Marketplace = () => {
  const { toast } = useToast()
  const [produkData, setProdukData] = useState<Produk[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [produkToDelete, setProdukToDelete] = useState<Produk | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [produkDetail, setProdukDetail] = useState<Produk | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProdukData()
  }, [])

  const loadProdukData = () => {
    try {
      const data = produkStorageService.getAllProduk()
      setProdukData(data)
    } catch (error) {
      console.error('Error loading produk data:', error)
      toast({
        title: "Error",
        description: "Gagal memuat data produk",
        variant: "destructive"
      })
    }
  }

  const handleAdd = () => {
    setFormMode("create")
    setSelectedProduk(null)
    setIsFormOpen(true)
  }

  const handleEdit = (produk: Produk) => {
    setFormMode("edit")
    setSelectedProduk(produk)
    setIsFormOpen(true)
  }

  const handleDelete = (produk: Produk) => {
    setProdukToDelete(produk)
    setDeleteDialogOpen(true)
  }

  const handleViewDetail = (produk: Produk) => {
    setProdukDetail(produk)
    setDetailDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (produkToDelete) {
      setIsLoading(true)
      try {
        const success = produkStorageService.deleteProduk(produkToDelete.id)
        if (success) {
          loadProdukData()
          toast({
            title: "Berhasil",
            description: `Produk ${produkToDelete.nama} berhasil dihapus.`,
          })
        } else {
          throw new Error('Failed to delete produk')
        }
      } catch (error) {
        console.error('Error deleting produk:', error)
        toast({
          title: "Error",
          description: "Gagal menghapus produk",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
        setProdukToDelete(null)
        setDeleteDialogOpen(false)
      }
    }
  }

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      if (formMode === "create") {
        const newProduk = produkStorageService.createProduk({
          nama: data.nama,
          petani: data.petani,
          lokasi: data.lokasi,
          harga: data.harga,
          stok: data.stok,
          satuan: data.satuan,
          kualitas: data.kualitas,
          deskripsi: data.deskripsi,
          kontak: data.kontak
        })
        
        loadProdukData()
        toast({
          title: "Berhasil",
          description: `Produk ${newProduk.nama} berhasil ditambahkan.`,
        })
      } else if (formMode === "edit" && selectedProduk) {
        const updatedProduk = produkStorageService.updateProduk({
          ...selectedProduk,
          nama: data.nama,
          petani: data.petani,
          lokasi: data.lokasi,
          harga: data.harga,
          stok: data.stok,
          satuan: data.satuan,
          kualitas: data.kualitas,
          deskripsi: data.deskripsi,
          kontak: data.kontak
        })
        
        loadProdukData()
        toast({
          title: "Berhasil",
          description: `Produk ${updatedProduk.nama} berhasil diperbarui.`,
        })
      }
    } catch (error) {
      console.error('Error saving produk:', error)
      toast({
        title: "Error",
        description: "Gagal menyimpan produk",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsFormOpen(false)
    }
  }

  const columns = createProductColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onViewDetail: handleViewDetail
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Marketplace Hasil Pertanian</h2>
        <p className="text-gray-600">Kelola produk marketplace dengan fitur CRUD lengkap dan modal yang lebih luas</p>
      </div>

      <DataTable
        columns={columns}
        data={produkData}
        searchKey="nama"
        onAdd={handleAdd}
        addButtonLabel="Tambah Produk"
        title="Marketplace"
      />

      <CrudForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        fields={formFields}
        title={formMode === "create" ? "Tambah Produk Baru" : "Edit Produk"}
        description={formMode === "create" ? "Masukkan data produk baru dengan lengkap" : "Perbarui data produk"}
        initialData={selectedProduk}
        mode={formMode}
        wide={true}
      />

      <ProductDetailDialog
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        product={produkDetail}
      />

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        product={produkToDelete}
      />
    </div>
  )
}
