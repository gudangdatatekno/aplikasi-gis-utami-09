
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Layers, Palette, Map } from "lucide-react";
import { CoordinateManagement } from "./pengaturan/CoordinateManagement";
import { LayerManagement } from "./pengaturan/LayerManagement";
import { LegendManagement } from "./pengaturan/LegendManagement";
import { ThematicMap } from "./ThematicMap";
import { Koordinat, LayerDemografi, LegendaItem } from "./pengaturan/pengaturan-types";
import { pengaturanStorageService } from "../services/pengaturanStorageService";

export const Pengaturan = () => {
  // State untuk koordinat
  const [koordinatList, setKoordinatList] = useState<Koordinat[]>([]);

  // State untuk layer demografi
  const [layerList, setLayerList] = useState<LayerDemografi[]>([]);

  // State untuk legenda
  const [legendaList, setLegendaList] = useState<LegendaItem[]>([]);

  // Load data from storage on component mount
  useEffect(() => {
    const loadData = () => {
      setKoordinatList(pengaturanStorageService.getAllKoordinat());
      setLayerList(pengaturanStorageService.getAllLayer());
      setLegendaList(pengaturanStorageService.getAllLegenda());
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Peta Tematik</h1>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Lokasi:</span> Desa Sumberagung, Kec. Godong, Kab. Grobogan
        </div>
      </div>

      <Tabs defaultValue="peta-tematik" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="peta-tematik" className="flex items-center space-x-2">
            <Map className="h-4 w-4" />
            <span>Peta Tematik</span>
          </TabsTrigger>
          <TabsTrigger value="koordinat" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Koordinat</span>
          </TabsTrigger>
          <TabsTrigger value="layer" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Layer Demografi</span>
          </TabsTrigger>
          <TabsTrigger value="legenda" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Legenda</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="peta-tematik" className="space-y-4">
          <ThematicMap />
        </TabsContent>

        <TabsContent value="koordinat" className="space-y-4">
          <CoordinateManagement 
            koordinatList={koordinatList}
            setKoordinatList={setKoordinatList}
          />
        </TabsContent>

        <TabsContent value="layer" className="space-y-4">
          <LayerManagement 
            layerList={layerList}
            setLayerList={setLayerList}
          />
        </TabsContent>

        <TabsContent value="legenda" className="space-y-4">
          <LegendManagement 
            legendaList={legendaList}
            setLegendaList={setLegendaList}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
