
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CrudForm, FormField } from "@/components/ui/crud-form";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Beaker, Package2, Calendar, AlertTriangle, Plus, Eye, Edit, Trash2 } from "lucide-react";

interface Pupuk {
  id: number;
  nama: string;
  jenis: string;
  stok: number;
  satuan: string;
  harga: number;
  supplier: string;
  tanggalBeli: string;
  tanggalKadaluarsa: string;
  lokasi: string;
  status: string;
  penggunaan: Array<{
    tanggal: string;
    jumlah: number;
    petani: string;
    lahan: string;
  }>;
}

export const ManajemenPupuk = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPupuk, setSelectedPupuk] = useState<Pupuk | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pupukToDelete, setPupukToDelete] = useState<Pupuk | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [pupukDetail, setPupukDetail] = useState<Pupuk | null>(null);

  const [pupukData, setPupukData] = useState<Pupuk[]>([
    {
      id: 1,
      nama: "Urea",
      jenis: "Nitrogen",
      stok: 500,
      satuan: "kg",
      harga: 2500,
      supplier: "PT Pupuk Indonesia",
      tanggalBeli: "2024-01-15",
      tanggalKadaluarsa: "2024-12-31",
      lokasi: "Gudang A",
      status: "Tersedia",
      penggunaan: [
        { tanggal: "2024-01-20", jumlah: 50, petani: "Budi Santoso", lahan: "Sawah A" },
        { tanggal: "2024-01-25", jumlah: 30, petani: "Sari Wati", lahan: "Sawah B" }
      ]
    },
    {
      id: 2,
      nama: "NPK 16-16-16",
      jenis: "Majemuk",
      stok: 300,
      satuan: "kg",
      harga: 3500,
      supplier: "PT Pupuk Majemuk",
      tanggalBeli: "2024-02-01",
      tanggalKadaluarsa: "2025-01-31",
      lokasi: "Gudang A",
      status: "Tersedia",
      penggunaan: [
        { tanggal: "2024-02-05", jumlah: 25, petani: "Joko Widodo", lahan: "Sawah C" }
      ]
    },
    {
      id: 3,
      nama: "TSP (Triple Super Phosphate)",
      jenis: "Fosfor",
      stok: 150,
      satuan: "kg",
      harga: 4000,
      supplier: "PT Agro Kimia",
      tanggalBeli: "2024-01-10",
      tanggalKadaluarsa: "2024-06-30",
      lokasi: "Gudang B",
      status: "Segera Habis",
      penggunaan: [
        { tanggal: "2024-01-15", jumlah: 40, petani: "Rina Sari", lahan: "Sawah D" }
      ]
    },
    {
      id: 4,
      nama: "KCl (Kalium Klorida)",
      jenis: "Kalium",
      stok: 0,
      satuan: "kg",
      harga: 3200,
      supplier: "PT Pupuk Kalium",
      tanggalBeli: "2023-12-01",
      tanggalKadaluarsa: "2024-11-30",
      lokasi: "Gudang B",
      status: "Habis",
      penggunaan: [
        { tanggal: "2024-01-10", jumlah: 35, petani: "Budi Santoso", lahan: "Sawah A" }
      ]
    }
  ]);

  const formFields: FormField[] = [
    { name: "nama", label: "Nama Pupuk", type: "text", required: true, placeholder: "Masukkan nama pupuk" },
    { 
      name: "jenis", 
      label: "Jenis Pupuk", 
      type: "select", 
      required: true,
      options: [
        { value: "Nitrogen", label: "Nitrogen" },
        { value: "Fosfor", label: "Fosfor" },
        { value: "Kalium", label: "Kalium" },
        { value: "Majemuk", label: "Majemuk" }
      ]
    },
    { name: "stok", label: "Stok", type: "number", required: true, placeholder: "Jumlah stok" },
    { 
      name: "satuan", 
      label: "Satuan", 
      type: "select", 
      required: true,
      options: [
        { value: "kg", label: "Kilogram (kg)" },
        { value: "ton", label: "Ton" },
        { value: "karung", label: "Karung" }
      ]
    },
    { name: "harga", label: "Harga per Satuan", type: "number", required: true, placeholder: "Harga dalam rupiah" },
    { name: "supplier", label: "Supplier", type: "text", required: true, placeholder: "Nama supplier" },
    { name: "tanggalBeli", label: "Tanggal Pembelian", type: "date", required: true },
    { name: "tanggalKadaluarsa", label: "Tanggal Kadaluarsa", type: "date", required: true },
    { 
      name: "lokasi", 
      label: "Lokasi Penyimpanan", 
      type: "select", 
      required: true,
      options: [
        { value: "Gudang A", label: "Gudang A" },
        { value: "Gudang B", label: "Gudang B" },
        { value: "Gudang C", label: "Gudang C" }
      ]
    }
  ];

  const filteredPupuk = pupukData.filter(pupuk =>
    pupuk.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pupuk.jenis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormMode("create");
    setSelectedPupuk(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pupuk: Pupuk) => {
    setFormMode("edit");
    setSelectedPupuk(pupuk);
    setIsFormOpen(true);
  };

  const handleDelete = (pupuk: Pupuk) => {
    setPupukToDelete(pupuk);
    setDeleteDialogOpen(true);
  };

  const handleViewDetail = (pupuk: Pupuk) => {
    setPupukDetail(pupuk);
    setDetailDialogOpen(true);
  };

  const confirmDelete = () => {
    if (pupukToDelete) {
      setPupukData(prev => prev.filter(p => p.id !== pupukToDelete.id));
      toast({
        title: "Berhasil",
        description: `Pupuk ${pupukToDelete.nama} berhasil dihapus.`,
      });
      setPupukToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const updateStockStatus = (stok: number) => {
    if (stok === 0) return "Habis";
    if (stok < 100) return "Segera Habis";
    return "Tersedia";
  };

  const handleFormSubmit = (data: any) => {
    const status = updateStockStatus(data.stok);
    
    if (formMode === "create") {
      const newId = Math.max(...pupukData.map(p => p.id)) + 1;
      const newPupuk: Pupuk = {
        id: newId,
        nama: data.nama,
        jenis: data.jenis,
        stok: data.stok,
        satuan: data.satuan,
        harga: data.harga,
        supplier: data.supplier,
        tanggalBeli: data.tanggalBeli,
        tanggalKadaluarsa: data.tanggalKadaluarsa,
        lokasi: data.lokasi,
        status: status,
        penggunaan: []
      };
      setPupukData(prev => [...prev, newPupuk]);
      toast({
        title: "Berhasil",
        description: `Pupuk ${data.nama} berhasil ditambahkan.`,
      });
    } else if (formMode === "edit" && selectedPupuk) {
      const updatedPupuk: Pupuk = {
        ...selectedPupuk,
        nama: data.nama,
        jenis: data.jenis,
        stok: data.stok,
        satuan: data.satuan,
        harga: data.harga,
        supplier: data.supplier,
        tanggalBeli: data.tanggalBeli,
        tanggalKadaluarsa: data.tanggalKadaluarsa,
        lokasi: data.lokasi,
        status: status
      };
      setPupukData(prev => prev.map(p => p.id === selectedPupuk.id ? updatedPupuk : p));
      toast({
        title: "Berhasil",
        description: `Pupuk ${data.nama} berhasil diperbarui.`,
      });
    }
    setIsFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tersedia": return "bg-green-100 text-green-800";
      case "Segera Habis": return "bg-yellow-100 text-yellow-800";
      case "Habis": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStokWarning = (stok: number) => {
    if (stok === 0) return "text-red-600";
    if (stok < 100) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Pupuk</h2>
          <p className="text-gray-600">Kelola stok dan distribusi pupuk untuk petani</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package2 className="h-4 w-4" />
          <span>{pupukData.length} Jenis Pupuk</span>
        </div>
      </div>

      <div className="flex space-x-4 items-center">
        <Input
          placeholder="Cari nama pupuk atau jenis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pupuk
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPupuk.map((pupuk) => (
          <Card key={pupuk.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pupuk.nama}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Beaker className="h-4 w-4 mr-1" />
                    {pupuk.jenis}
                  </div>
                </div>
                <Badge className={getStatusColor(pupuk.status)}>
                  {pupuk.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Stok</p>
                    <p className={`font-semibold ${getStokWarning(pupuk.stok)}`}>
                      {pupuk.stok} {pupuk.satuan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Harga</p>
                    <p className="font-semibold">Rp {pupuk.harga.toLocaleString()}/{pupuk.satuan}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Supplier</p>
                    <p className="text-sm font-medium">{pupuk.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lokasi</p>
                    <p className="text-sm font-medium">{pupuk.lokasi}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Kadaluarsa</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm font-medium">{pupuk.tanggalKadaluarsa}</p>
                    {new Date(pupuk.tanggalKadaluarsa) < new Date(Date.now() + 30*24*60*60*1000) && (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetail(pupuk)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(pupuk)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(pupuk)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CrudForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        fields={formFields}
        title={formMode === "create" ? "Tambah Pupuk Baru" : "Edit Data Pupuk"}
        description={formMode === "create" ? "Masukkan data pupuk baru" : "Perbarui data pupuk"}
        initialData={selectedPupuk}
        mode={formMode}
        wide={true}
      />

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pupuk - {pupukDetail?.nama}</DialogTitle>
          </DialogHeader>
          {pupukDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Jenis</p>
                  <p className="text-sm text-gray-600">{pupukDetail.jenis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Stok</p>
                  <p className="text-sm text-gray-600">{pupukDetail.stok} {pupukDetail.satuan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Supplier</p>
                  <p className="text-sm text-gray-600">{pupukDetail.supplier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Lokasi</p>
                  <p className="text-sm text-gray-600">{pupukDetail.lokasi}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Riwayat Penggunaan</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pupukDetail.penggunaan.map((usage, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{usage.petani}</p>
                        <p className="text-xs text-gray-600">{usage.lahan} - {usage.tanggal}</p>
                      </div>
                      <p className="text-sm font-semibold">{usage.jumlah} kg</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Pupuk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pupuk {pupukToDelete?.nama}? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
