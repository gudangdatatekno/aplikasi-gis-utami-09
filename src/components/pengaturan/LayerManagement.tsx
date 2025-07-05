
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, Layers, Eye, EyeOff, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CrudForm, FormField } from "@/components/ui/crud-form";
import { LayerDemografi } from "./pengaturan-types";
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

interface LayerManagementProps {
  layerList: LayerDemografi[];
  setLayerList: React.Dispatch<React.SetStateAction<LayerDemografi[]>>;
}

export const LayerManagement: React.FC<LayerManagementProps> = ({
  layerList,
  setLayerList
}) => {
  const { toast } = useToast();
  
  // Form states
  const [isLayerFormOpen, setIsLayerFormOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<LayerDemografi | null>(null);
  const [deleteLayer, setDeleteLayer] = useState<LayerDemografi | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields untuk layer
  const layerFields: FormField[] = [
    { name: 'nama', label: 'Nama Layer', type: 'text', required: true, placeholder: 'Masukkan nama layer' },
    { name: 'warna', label: 'Kode Warna (Hex)', type: 'text', required: true, placeholder: '#3B82F6' },
    { 
      name: 'properti', 
      label: 'Properti Data', 
      type: 'select', 
      required: true,
      options: [
        { value: 'populasi', label: 'Kepadatan Populasi' },
        { value: 'pendidikan', label: 'Tingkat Pendidikan' },
        { value: 'ekonomi', label: 'Status Ekonomi' },
        { value: 'kesehatan', label: 'Fasilitas Kesehatan' },
        { value: 'infrastruktur', label: 'Infrastruktur' },
        { value: 'pertanian', label: 'Area Pertanian' }
      ]
    },
    { name: 'rentangNilai', label: 'Rentang Nilai', type: 'text', required: true, placeholder: 'Contoh: 0-1000 jiwa/km²' }
  ];

  // Validation function
  const validateHexColor = (color: string): boolean => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };

  // Handler functions untuk layer
  const handleAddLayer = async (data: any) => {
    if (!validateHexColor(data.warna)) {
      toast({
        title: "Error",
        description: "Format warna tidak valid. Gunakan format hex seperti #3B82F6",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newLayer: LayerDemografi = {
        id: Math.max(0, ...layerList.map(l => l.id)) + 1,
        nama: data.nama.trim(),
        warna: data.warna.toUpperCase(),
        properti: data.properti,
        rentangNilai: data.rentangNilai.trim(),
        visible: true
      };
      
      setLayerList(prev => [...prev, newLayer]);
      toast({
        title: "Berhasil",
        description: `Layer "${newLayer.nama}" telah ditambahkan`
      });
      setIsLayerFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan layer",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLayer = async (data: any) => {
    if (!editingLayer) return;
    
    if (!validateHexColor(data.warna)) {
      toast({
        title: "Error",
        description: "Format warna tidak valid. Gunakan format hex seperti #3B82F6",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedLayer: LayerDemografi = {
        ...editingLayer,
        nama: data.nama.trim(),
        warna: data.warna.toUpperCase(),
        properti: data.properti,
        rentangNilai: data.rentangNilai.trim()
      };
      
      setLayerList(prev => prev.map(l => l.id === editingLayer.id ? updatedLayer : l));
      setEditingLayer(null);
      toast({
        title: "Berhasil",
        description: `Layer "${updatedLayer.nama}" telah diperbarui`
      });
      setIsLayerFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui layer",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLayer = async () => {
    if (!deleteLayer) return;
    setIsLoading(true);
    try {
      setLayerList(prev => prev.filter(l => l.id !== deleteLayer.id));
      toast({
        title: "Berhasil",
        description: `Layer "${deleteLayer.nama}" telah dihapus`
      });
      setDeleteLayer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus layer",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLayerVisibility = (id: number) => {
    setLayerList(prev => prev.map(l => 
      l.id === id ? { ...l, visible: !l.visible } : l
    ));
    const layer = layerList.find(l => l.id === id);
    if (layer) {
      toast({
        title: "Layer diperbarui",
        description: `Layer "${layer.nama}" ${!layer.visible ? 'ditampilkan' : 'disembunyikan'}`
      });
    }
  };

  const getPropertyLabel = (properti: string) => {
    const labels = {
      'populasi': 'Kepadatan Populasi',
      'pendidikan': 'Tingkat Pendidikan',
      'ekonomi': 'Status Ekonomi',
      'kesehatan': 'Fasilitas Kesehatan',
      'infrastruktur': 'Infrastruktur',
      'pertanian': 'Area Pertanian'
    };
    return labels[properti as keyof typeof labels] || properti;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Manajemen Layer Demografi
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola layer data demografi untuk visualisasi peta tematik
            </p>
          </div>
          <Button onClick={() => setIsLayerFormOpen(true)} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Layer
          </Button>
        </CardHeader>
        <CardContent>
          {layerList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada layer demografi yang ditambahkan</p>
              <p className="text-sm">Klik tombol "Tambah Layer" untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-4">
              {layerList.map((layer) => (
                <div key={layer.id} className={`border rounded-lg p-4 transition-opacity ${!layer.visible ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border-2 border-white shadow-sm"
                            style={{ backgroundColor: layer.warna }}
                          />
                          <Palette className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">{layer.nama}</h3>
                        <Badge variant={layer.visible ? "default" : "secondary"}>
                          {layer.visible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Properti:</span>
                          <p className="mt-1">{getPropertyLabel(layer.properti)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Rentang Nilai:</span>
                          <p className="mt-1">{layer.rentangNilai}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Kode Warna:</span>
                          <code className="mt-1 block bg-muted px-2 py-1 rounded text-xs">
                            {layer.warna}
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleLayerVisibility(layer.id)}
                        disabled={isLoading}
                      >
                        {layer.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingLayer(layer);
                          setIsLayerFormOpen(true);
                        }}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteLayer(layer)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CrudForm
        isOpen={isLayerFormOpen}
        onClose={() => {
          setIsLayerFormOpen(false);
          setEditingLayer(null);
        }}
        onSubmit={editingLayer ? handleEditLayer : handleAddLayer}
        fields={layerFields}
        title={editingLayer ? "Edit Layer Demografi" : "Tambah Layer Demografi Baru"}
        description={editingLayer ? "Perbarui informasi layer demografi" : "Buat layer baru untuk visualisasi data demografi pada peta"}
        initialData={editingLayer}
        mode={editingLayer ? "edit" : "create"}
        wide={true}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteLayer} onOpenChange={() => setDeleteLayer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Layer Demografi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus layer "{deleteLayer?.nama}"? 
              Layer ini akan dihapus dari peta dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLayer} 
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
