import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, MapPin, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CrudForm, FormField } from "@/components/ui/crud-form";
import { MapPicker } from "@/components/MapPicker";
import { Koordinat } from "./pengaturan-types";
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

// Default coordinates for Desa Sumberagung
const DESA_SUMBERAGUNG = {
  lat: -7.0521,
  lng: 110.7987
};

interface CoordinateManagementProps {
  koordinatList: Koordinat[];
  setKoordinatList: React.Dispatch<React.SetStateAction<Koordinat[]>>;
}

export const CoordinateManagement: React.FC<CoordinateManagementProps> = ({
  koordinatList,
  setKoordinatList
}) => {
  const { toast } = useToast();
  
  // Form states
  const [isKoordinatFormOpen, setIsKoordinatFormOpen] = useState(false);
  const [editingKoordinat, setEditingKoordinat] = useState<Koordinat | null>(null);
  const [deleteKoordinat, setDeleteKoordinat] = useState<Koordinat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Map picker states - using default Desa Sumberagung coordinates
  const [selectedLatitude, setSelectedLatitude] = useState(DESA_SUMBERAGUNG.lat);
  const [selectedLongitude, setSelectedLongitude] = useState(DESA_SUMBERAGUNG.lng);

  // Visibility state
  const [hiddenKoordinat, setHiddenKoordinat] = useState<Set<number>>(new Set());

  // Form fields untuk koordinat
  const koordinatFields: FormField[] = [
    { name: 'nama', label: 'Nama Lokasi', type: 'text', required: true, placeholder: 'Masukkan nama lokasi' },
    { 
      name: 'tipe', 
      label: 'Tipe Lokasi', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Fasilitas Umum', label: 'Fasilitas Umum' },
        { value: 'Ekonomi', label: 'Ekonomi' },
        { value: 'Pertanian', label: 'Pertanian' },
        { value: 'Pemukiman', label: 'Pemukiman' },
        { value: 'Infrastruktur', label: 'Infrastruktur' },
        { value: 'Pariwisata', label: 'Pariwisata' },
        { value: 'Pendidikan', label: 'Pendidikan' },
        { value: 'Kesehatan', label: 'Kesehatan' }
      ]
    },
    { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', placeholder: 'Masukkan deskripsi lokasi (opsional)' }
  ];

  // Handler functions untuk koordinat
  const handleAddKoordinat = async (data: any) => {
    setIsLoading(true);
    try {
      const newKoordinat: Koordinat = {
        id: Math.max(0, ...koordinatList.map(k => k.id)) + 1,
        nama: data.nama.trim(),
        latitude: selectedLatitude,
        longitude: selectedLongitude,
        tipe: data.tipe,
        deskripsi: data.deskripsi?.trim() || ''
      };
      
      setKoordinatList(prev => [...prev, newKoordinat]);
      toast({
        title: "Berhasil",
        description: `Koordinat "${newKoordinat.nama}" telah ditambahkan`
      });
      setIsKoordinatFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan koordinat",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditKoordinat = async (data: any) => {
    if (!editingKoordinat) return;
    setIsLoading(true);
    try {
      const updatedKoordinat: Koordinat = {
        ...editingKoordinat,
        nama: data.nama.trim(),
        latitude: selectedLatitude,
        longitude: selectedLongitude,
        tipe: data.tipe,
        deskripsi: data.deskripsi?.trim() || ''
      };
      
      setKoordinatList(prev => prev.map(k => k.id === editingKoordinat.id ? updatedKoordinat : k));
      setEditingKoordinat(null);
      toast({
        title: "Berhasil",
        description: `Koordinat "${updatedKoordinat.nama}" telah diperbarui`
      });
      setIsKoordinatFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui koordinat",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKoordinat = async () => {
    if (!deleteKoordinat) return;
    setIsLoading(true);
    try {
      setKoordinatList(prev => prev.filter(k => k.id !== deleteKoordinat.id));
      toast({
        title: "Berhasil",
        description: `Koordinat "${deleteKoordinat.nama}" telah dihapus`
      });
      setDeleteKoordinat(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus koordinat",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoordinateSelect = (lat: number, lng: number) => {
    setSelectedLatitude(lat);
    setSelectedLongitude(lng);
  };

  const handleOpenKoordinatForm = (koordinat: Koordinat | null = null) => {
    if (koordinat) {
      setEditingKoordinat(koordinat);
      setSelectedLatitude(koordinat.latitude);
      setSelectedLongitude(koordinat.longitude);
    } else {
      setEditingKoordinat(null);
      // Always use default Desa Sumberagung coordinates for new coordinates
      setSelectedLatitude(DESA_SUMBERAGUNG.lat);
      setSelectedLongitude(DESA_SUMBERAGUNG.lng);
    }
    setIsKoordinatFormOpen(true);
  };

  const toggleKoordinatVisibility = (id: number) => {
    setHiddenKoordinat(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getTypeColor = (tipe: string) => {
    const colors = {
      'Fasilitas Umum': 'bg-blue-100 text-blue-800',
      'Ekonomi': 'bg-green-100 text-green-800',
      'Pertanian': 'bg-yellow-100 text-yellow-800',
      'Pemukiman': 'bg-purple-100 text-purple-800',
      'Infrastruktur': 'bg-gray-100 text-gray-800',
      'Pariwisata': 'bg-pink-100 text-pink-800',
      'Pendidikan': 'bg-cyan-100 text-cyan-800',
      'Kesehatan': 'bg-red-100 text-red-800'
    };
    return colors[tipe as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Manajemen Titik Koordinat
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola titik-titik koordinat penting di wilayah Desa Sumberagung
            </p>
          </div>
          <Button onClick={() => handleOpenKoordinatForm()} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Koordinat
          </Button>
        </CardHeader>
        <CardContent>
          {koordinatList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada koordinat yang ditambahkan</p>
              <p className="text-sm">Klik tombol "Tambah Koordinat" untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-4">
              {koordinatList.map((koordinat) => {
                const isHidden = hiddenKoordinat.has(koordinat.id);
                return (
                  <div key={koordinat.id} className={`border rounded-lg p-4 transition-opacity ${isHidden ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{koordinat.nama}</h3>
                          <Badge className={getTypeColor(koordinat.tipe)}>
                            {koordinat.tipe}
                          </Badge>
                          {isHidden && <Badge variant="secondary">Tersembunyi</Badge>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-muted-foreground">Koordinat:</span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {koordinat.latitude.toFixed(6)}, {koordinat.longitude.toFixed(6)}
                            </code>
                          </div>
                        </div>
                        {koordinat.deskripsi && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                            {koordinat.deskripsi}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKoordinatVisibility(koordinat.id)}
                        >
                          {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenKoordinatForm(koordinat)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteKoordinat(koordinat)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal with Map Integration */}
      {isKoordinatFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {editingKoordinat ? "Edit Koordinat" : "Tambah Koordinat Baru"}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {editingKoordinat 
                      ? "Perbarui informasi koordinat" 
                      : "Pilih lokasi pada peta di wilayah Desa Sumberagung dan isi detail koordinat"
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsKoordinatFormOpen(false);
                    setEditingKoordinat(null);
                  }}
                  disabled={isLoading}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Pilih Lokasi pada Peta</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <MapPicker
                      latitude={selectedLatitude}
                      longitude={selectedLongitude}
                      onCoordinateSelect={handleCoordinateSelect}
                      height="400px"
                    />
                  </div>
                  <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                    <p><span className="font-medium">Koordinat Terpilih:</span></p>
                    <code>{selectedLatitude.toFixed(6)}, {selectedLongitude.toFixed(6)}</code>
                    <p className="text-xs text-muted-foreground mt-1">
                      Default: Pusat Desa Sumberagung (7.0521° S, 110.7987° E)
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Detail Koordinat</h3>
                  <CrudForm
                    isOpen={true}
                    onClose={() => {}}
                    onSubmit={editingKoordinat ? handleEditKoordinat : handleAddKoordinat}
                    fields={koordinatFields}
                    title=""
                    description=""
                    initialData={editingKoordinat}
                    mode={editingKoordinat ? "edit" : "create"}
                    hideDialog={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteKoordinat} onOpenChange={() => setDeleteKoordinat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Koordinat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus koordinat "{deleteKoordinat?.nama}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteKoordinat} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
