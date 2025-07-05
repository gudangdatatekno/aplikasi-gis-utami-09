
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, Palette, Square, MapPin, Minus, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CrudForm, FormField } from "@/components/ui/crud-form";
import { LegendaItem } from "./pengaturan-types";
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

interface LegendManagementProps {
  legendaList: LegendaItem[];
  setLegendaList: React.Dispatch<React.SetStateAction<LegendaItem[]>>;
}

export const LegendManagement: React.FC<LegendManagementProps> = ({
  legendaList,
  setLegendaList
}) => {
  const { toast } = useToast();
  
  // Form states
  const [isLegendaFormOpen, setIsLegendaFormOpen] = useState(false);
  const [editingLegenda, setEditingLegenda] = useState<LegendaItem | null>(null);
  const [deleteLegenda, setDeleteLegenda] = useState<LegendaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields untuk legenda
  const legendaFields: FormField[] = [
    { name: 'label', label: 'Label Legenda', type: 'text', required: true, placeholder: 'Masukkan label legenda' },
    { name: 'warna', label: 'Kode Warna (Hex)', type: 'text', required: true, placeholder: '#22c55e' },
    { 
      name: 'simbol', 
      label: 'Tipe Simbol', 
      type: 'select', 
      required: true,
      options: [
        { value: 'polygon', label: 'Polygon (Area)' },
        { value: 'marker', label: 'Marker (Titik)' },
        { value: 'line', label: 'Line (Garis)' },
        { value: 'circle', label: 'Circle (Lingkaran)' },
        { value: 'square', label: 'Square (Kotak)' }
      ]
    },
    { 
      name: 'kategori', 
      label: 'Kategori', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Pertanian', label: 'Pertanian' },
        { value: 'Infrastruktur', label: 'Infrastruktur' },
        { value: 'Demografi', label: 'Demografi' },
        { value: 'Ekonomi', label: 'Ekonomi' },
        { value: 'Lingkungan', label: 'Lingkungan' },
        { value: 'Sosial', label: 'Sosial' }
      ]
    }
  ];

  // Validation function
  const validateHexColor = (color: string): boolean => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };

  // Handler functions untuk legenda
  const handleAddLegenda = async (data: any) => {
    if (!validateHexColor(data.warna)) {
      toast({
        title: "Error",
        description: "Format warna tidak valid. Gunakan format hex seperti #22c55e",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newLegenda: LegendaItem = {
        id: Math.max(0, ...legendaList.map(l => l.id)) + 1,
        label: data.label.trim(),
        warna: data.warna.toUpperCase(),
        simbol: data.simbol,
        kategori: data.kategori
      };
      
      setLegendaList(prev => [...prev, newLegenda]);
      toast({
        title: "Berhasil",
        description: `Item legenda "${newLegenda.label}" telah ditambahkan`
      });
      setIsLegendaFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan item legenda",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLegenda = async (data: any) => {
    if (!editingLegenda) return;
    
    if (!validateHexColor(data.warna)) {
      toast({
        title: "Error",
        description: "Format warna tidak valid. Gunakan format hex seperti #22c55e",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedLegenda: LegendaItem = {
        ...editingLegenda,
        label: data.label.trim(),
        warna: data.warna.toUpperCase(),
        simbol: data.simbol,
        kategori: data.kategori
      };
      
      setLegendaList(prev => prev.map(l => l.id === editingLegenda.id ? updatedLegenda : l));
      setEditingLegenda(null);
      toast({
        title: "Berhasil",
        description: `Item legenda "${updatedLegenda.label}" telah diperbarui`
      });
      setIsLegendaFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui item legenda",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLegenda = async () => {
    if (!deleteLegenda) return;
    setIsLoading(true);
    try {
      setLegendaList(prev => prev.filter(l => l.id !== deleteLegenda.id));
      toast({
        title: "Berhasil",
        description: `Item legenda "${deleteLegenda.label}" telah dihapus`
      });
      setDeleteLegenda(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus item legenda",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSymbolIcon = (simbol: string) => {
    switch (simbol) {
      case 'polygon': return Square;
      case 'marker': return MapPin;
      case 'line': return Minus;
      case 'circle': return Circle;
      case 'square': return Square;
      default: return Square;
    }
  };

  const getCategoryColor = (kategori: string) => {
    const colors = {
      'Pertanian': 'bg-green-100 text-green-800',
      'Infrastruktur': 'bg-blue-100 text-blue-800',
      'Demografi': 'bg-purple-100 text-purple-800',
      'Ekonomi': 'bg-yellow-100 text-yellow-800',
      'Lingkungan': 'bg-teal-100 text-teal-800',
      'Sosial': 'bg-pink-100 text-pink-800'
    };
    return colors[kategori as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Group legendas by category
  const groupedLegendasByCategory = legendaList.reduce((groups, legenda) => {
    const kategori = legenda.kategori;
    if (!groups[kategori]) {
      groups[kategori] = [];
    }
    groups[kategori].push(legenda);
    return groups;
  }, {} as Record<string, LegendaItem[]>);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Manajemen Legenda Peta
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola item legenda untuk membantu interpretasi peta tematik
            </p>
          </div>
          <Button onClick={() => setIsLegendaFormOpen(true)} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Legenda
          </Button>
        </CardHeader>
        <CardContent>
          {legendaList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada item legenda yang ditambahkan</p>
              <p className="text-sm">Klik tombol "Tambah Legenda" untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedLegendasByCategory).map(([kategori, items]) => (
                <div key={kategori} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{kategori}</h3>
                    <Badge className={getCategoryColor(kategori)}>
                      {items.length} item{items.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((legenda) => {
                      const SymbolIcon = getSymbolIcon(legenda.simbol);
                      return (
                        <div key={legenda.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-6 h-6 rounded border-2 border-white shadow-sm flex items-center justify-center"
                                    style={{ backgroundColor: legenda.warna }}
                                  >
                                    <SymbolIcon className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <h4 className="font-medium">{legenda.label}</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div>
                                  <span className="font-medium">Simbol:</span> {legenda.simbol}
                                </div>
                                <div>
                                  <span className="font-medium">Warna:</span>
                                  <code className="ml-1 bg-muted px-1 py-0.5 rounded text-xs">
                                    {legenda.warna}
                                  </code>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingLegenda(legenda);
                                  setIsLegendaFormOpen(true);
                                }}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteLegenda(legenda)}
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CrudForm
        isOpen={isLegendaFormOpen}
        onClose={() => {
          setIsLegendaFormOpen(false);
          setEditingLegenda(null);
        }}
        onSubmit={editingLegenda ? handleEditLegenda : handleAddLegenda}
        fields={legendaFields}
        title={editingLegenda ? "Edit Item Legenda" : "Tambah Item Legenda Baru"}
        description={editingLegenda ? "Perbarui informasi item legenda" : "Buat item legenda baru untuk membantu interpretasi peta"}
        initialData={editingLegenda}
        mode={editingLegenda ? "edit" : "create"}
        wide={true}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteLegenda} onOpenChange={() => setDeleteLegenda(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Item Legenda</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item legenda "{deleteLegenda?.label}"? 
              Item ini akan dihapus dari legenda peta dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLegenda} 
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
