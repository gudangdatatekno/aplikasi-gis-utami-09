
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapStyles.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { pengaturanStorageService } from '@/services/pengaturanStorageService';
import { Koordinat, LayerDemografi, LegendaItem } from './pengaturan/pengaturan-types';
import { MapPin, Layers, Eye, EyeOff } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Default coordinates for Desa Sumberagung
const DESA_SUMBERAGUNG = {
  lat: -7.0521,
  lng: 110.7987,
  zoom: 14
};

export const ThematicMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layerGroups = useRef<{ [key: string]: L.LayerGroup }>({});
  
  const [koordinatList, setKoordinatList] = useState<Koordinat[]>([]);
  const [layerList, setLayerList] = useState<LayerDemografi[]>([]);
  const [legendaList, setLegendaList] = useState<LegendaItem[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<{ [key: string]: boolean }>({});

  // Load data from storage
  useEffect(() => {
    const loadData = () => {
      const koordinat = pengaturanStorageService.getAllKoordinat();
      const layers = pengaturanStorageService.getAllLayer();
      const legenda = pengaturanStorageService.getAllLegenda();
      
      setKoordinatList(koordinat);
      setLayerList(layers);
      setLegendaList(legenda);
      
      // Initialize layer visibility
      const initialVisibility: { [key: string]: boolean } = {};
      layers.forEach(layer => {
        initialVisibility[layer.id.toString()] = layer.visible;
      });
      setVisibleLayers(initialVisibility);
    };

    loadData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create map centered on Desa Sumberagung
    map.current = L.map(mapContainer.current).setView([DESA_SUMBERAGUNG.lat, DESA_SUMBERAGUNG.lng], DESA_SUMBERAGUNG.zoom);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add village boundary (approximate)
    const villageBoundary = L.polygon([
      [-7.0480, 110.7950],
      [-7.0480, 110.8024],
      [-7.0562, 110.8024],
      [-7.0562, 110.7950]
    ], {
      color: '#2563eb',
      weight: 3,
      opacity: 0.8,
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      dashArray: '10, 5'
    }).addTo(map.current);

    villageBoundary.bindPopup(`
      <div class="p-3">
        <h3 class="font-bold text-blue-700 mb-2">Batas Wilayah Desa Sumberagung</h3>
        <p class="text-sm"><span class="font-semibold">Kecamatan:</span> Godong</p>
        <p class="text-sm"><span class="font-semibold">Kabupaten:</span> Grobogan</p>
        <p class="text-sm"><span class="font-semibold">Koordinat Pusat:</span> 7.0521° S, 110.7987° E</p>
      </div>
    `);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map markers when koordinat data changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing coordinate markers
    if (layerGroups.current['koordinat']) {
      map.current.removeLayer(layerGroups.current['koordinat']);
    }

    // Create new layer group for coordinates
    const koordinatLayerGroup = L.layerGroup();
    layerGroups.current['koordinat'] = koordinatLayerGroup;

    // Add markers for each coordinate
    koordinatList.forEach(koordinat => {
      const icon = L.divIcon({
        html: getMarkerIcon(koordinat.tipe),
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([koordinat.latitude, koordinat.longitude], { icon })
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-green-700 text-lg mb-2">${koordinat.nama}</h3>
            <div class="space-y-1 text-sm">
              <p><span class="font-semibold">Tipe:</span> <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">${koordinat.tipe}</span></p>
              <p><span class="font-semibold">Koordinat:</span> ${koordinat.latitude.toFixed(6)}, ${koordinat.longitude.toFixed(6)}</p>
              ${koordinat.deskripsi ? `<p class="text-muted-foreground mt-2 p-2 bg-gray-50 rounded">${koordinat.deskripsi}</p>` : ''}
            </div>
          </div>
        `);

      koordinatLayerGroup.addLayer(marker);
    });

    // Add to map if visible
    if (visibleLayers['koordinat'] !== false) {
      koordinatLayerGroup.addTo(map.current);
    }
  }, [koordinatList, visibleLayers]);

  // Add demographic layers
  useEffect(() => {
    if (!map.current) return;

    layerList.forEach(layer => {
      const layerId = layer.id.toString();
      
      // Remove existing layer
      if (layerGroups.current[layerId]) {
        map.current!.removeLayer(layerGroups.current[layerId]);
      }

      // Create new layer group
      const layerGroup = L.layerGroup();
      layerGroups.current[layerId] = layerGroup;

      // Add sample demographic areas based on layer type
      if (layer.properti === 'populasi') {
        addPopulationAreas(layerGroup, layer.warna);
      } else if (layer.properti === 'pertanian') {
        addAgricultureAreas(layerGroup, layer.warna);
      } else if (layer.properti === 'pendidikan') {
        addEducationAreas(layerGroup, layer.warna);
      } else if (layer.properti === 'pekerjaan') {
        addOccupationAreas(layerGroup, layer.warna);
      }

      // Add to map if visible
      if (visibleLayers[layerId]) {
        layerGroup.addTo(map.current!);
      }
    });
  }, [layerList, visibleLayers]);

  // Helper functions
  const getMarkerIcon = (tipe: string) => {
    const icons = {
      'Fasilitas Umum': '🏛️',
      'Ekonomi': '🏪',
      'Pertanian': '🌾',
      'Pemukiman': '🏘️',
      'Infrastruktur': '🏗️',
      'Pariwisata': '🏞️',
      'Pendidikan': '🏫',
      'Kesehatan': '🏥'
    };
    return `<div style="font-size: 16px; text-align: center; line-height: 30px;">${icons[tipe as keyof typeof icons] || '📍'}</div>`;
  };

  const addPopulationAreas = (layerGroup: L.LayerGroup, color: string) => {
    const areas = [
      { 
        coords: [
          [-7.0500, 110.7960] as L.LatLngTuple, 
          [-7.0500, 110.7980] as L.LatLngTuple, 
          [-7.0520, 110.7980] as L.LatLngTuple, 
          [-7.0520, 110.7960] as L.LatLngTuple
        ], 
        density: 'Tinggi (350-400 jiwa/km²)' 
      },
      { 
        coords: [
          [-7.0520, 110.7980] as L.LatLngTuple, 
          [-7.0520, 110.8000] as L.LatLngTuple, 
          [-7.0540, 110.8000] as L.LatLngTuple, 
          [-7.0540, 110.7980] as L.LatLngTuple
        ], 
        density: 'Sedang (250-350 jiwa/km²)' 
      },
      { 
        coords: [
          [-7.0540, 110.7960] as L.LatLngTuple, 
          [-7.0540, 110.7980] as L.LatLngTuple, 
          [-7.0560, 110.7980] as L.LatLngTuple, 
          [-7.0560, 110.7960] as L.LatLngTuple
        ], 
        density: 'Rendah (150-250 jiwa/km²)' 
      }
    ];

    areas.forEach(area => {
      L.polygon(area.coords, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.3
      }).bindPopup(`<div class="p-2"><strong>Kepadatan Penduduk:</strong><br/>${area.density}</div>`)
        .addTo(layerGroup);
    });
  };

  const addAgricultureAreas = (layerGroup: L.LayerGroup, color: string) => {
    const areas = [
      { 
        coords: [
          [-7.0490, 110.7970] as L.LatLngTuple, 
          [-7.0490, 110.7990] as L.LatLngTuple, 
          [-7.0510, 110.7990] as L.LatLngTuple, 
          [-7.0510, 110.7970] as L.LatLngTuple
        ], 
        type: 'Sawah Irigasi Teknis' 
      },
      { 
        coords: [
          [-7.0530, 110.7990] as L.LatLngTuple, 
          [-7.0530, 110.8010] as L.LatLngTuple, 
          [-7.0550, 110.8010] as L.LatLngTuple, 
          [-7.0550, 110.7990] as L.LatLngTuple
        ], 
        type: 'Sawah Tadah Hujan' 
      },
      { 
        coords: [
          [-7.0510, 110.8000] as L.LatLngTuple, 
          [-7.0510, 110.8020] as L.LatLngTuple, 
          [-7.0530, 110.8020] as L.LatLngTuple, 
          [-7.0530, 110.8000] as L.LatLngTuple
        ], 
        type: 'Sawah Semi Teknis' 
      }
    ];

    areas.forEach(area => {
      L.polygon(area.coords, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.4
      }).bindPopup(`<div class="p-2"><strong>Jenis Pertanian:</strong><br/>${area.type}</div>`)
        .addTo(layerGroup);
    });
  };

  const addEducationAreas = (layerGroup: L.LayerGroup, color: string) => {
    const areas = [
      { 
        coords: [
          [-7.0505, 110.7985] as L.LatLngTuple, 
          [-7.0505, 110.7995] as L.LatLngTuple, 
          [-7.0515, 110.7995] as L.LatLngTuple, 
          [-7.0515, 110.7985] as L.LatLngTuple
        ], 
        level: 'Zona SD-SMP (70% populasi)' 
      },
      { 
        coords: [
          [-7.0515, 110.7995] as L.LatLngTuple, 
          [-7.0515, 110.8005] as L.LatLngTuple, 
          [-7.0525, 110.8005] as L.LatLngTuple, 
          [-7.0525, 110.7995] as L.LatLngTuple
        ], 
        level: 'Zona SMA (20% populasi)' 
      },
      { 
        coords: [
          [-7.0525, 110.7975] as L.LatLngTuple, 
          [-7.0525, 110.7985] as L.LatLngTuple, 
          [-7.0535, 110.7985] as L.LatLngTuple, 
          [-7.0535, 110.7975] as L.LatLngTuple
        ], 
        level: 'Zona Perguruan Tinggi (10% populasi)' 
      }
    ];

    areas.forEach(area => {
      L.polygon(area.coords, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.35
      }).bindPopup(`<div class="p-2"><strong>Tingkat Pendidikan:</strong><br/>${area.level}</div>`)
        .addTo(layerGroup);
    });
  };

  const addOccupationAreas = (layerGroup: L.LayerGroup, color: string) => {
    const areas = [
      { 
        coords: [
          [-7.0495, 110.7975] as L.LatLngTuple, 
          [-7.0495, 110.7985] as L.LatLngTuple, 
          [-7.0505, 110.7985] as L.LatLngTuple, 
          [-7.0505, 110.7975] as L.LatLngTuple
        ], 
        job: 'Zona Petani (60% populasi)' 
      },
      { 
        coords: [
          [-7.0515, 110.7985] as L.LatLngTuple, 
          [-7.0515, 110.7995] as L.LatLngTuple, 
          [-7.0525, 110.7995] as L.LatLngTuple, 
          [-7.0525, 110.7985] as L.LatLngTuple
        ], 
        job: 'Zona Pedagang (25% populasi)' 
      },
      { 
        coords: [
          [-7.0535, 110.7995] as L.LatLngTuple, 
          [-7.0535, 110.8005] as L.LatLngTuple, 
          [-7.0545, 110.8005] as L.LatLngTuple, 
          [-7.0545, 110.7995] as L.LatLngTuple
        ], 
        job: 'Zona Pegawai/Lainnya (15% populasi)' 
      }
    ];

    areas.forEach(area => {
      L.polygon(area.coords, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.4
      }).bindPopup(`<div class="p-2"><strong>Mata Pencaharian:</strong><br/>${area.job}</div>`)
        .addTo(layerGroup);
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    setVisibleLayers(prev => {
      const newVisibility = { ...prev, [layerId]: !prev[layerId] };
      
      // Update map layers
      if (layerGroups.current[layerId]) {
        if (newVisibility[layerId]) {
          layerGroups.current[layerId].addTo(map.current!);
        } else {
          map.current!.removeLayer(layerGroups.current[layerId]);
        }
      }
      
      return newVisibility;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peta Tematik Desa Sumberagung</h1>
          <p className="text-muted-foreground mt-1">
            Kec. Godong, Kab. Grobogan • Koordinat: 7.0521° S, 110.7987° E
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Peta Interaktif
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div ref={mapContainer} className="h-[600px] w-full rounded-lg" />
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2 z-[1000]">
                  <Card className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Koordinat</span>
                        <Switch
                          checked={visibleLayers['koordinat'] !== false}
                          onCheckedChange={() => toggleLayerVisibility('koordinat')}
                        />
                      </div>
                      {layerList.map(layer => (
                        <div key={layer.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded" 
                              style={{ backgroundColor: layer.warna }}
                            />
                            <span className="text-sm">{layer.nama}</span>
                          </div>
                          <Switch
                            checked={visibleLayers[layer.id.toString()] || false}
                            onCheckedChange={() => toggleLayerVisibility(layer.id.toString())}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend and Info */}
        <div className="space-y-4">
          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Legenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {legendaList.map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: item.warna }}
                  />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.kategori}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Statistik Wilayah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Titik</p>
                  <p className="font-semibold">{koordinatList.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Layer Aktif</p>
                  <p className="font-semibold">
                    {Object.values(visibleLayers).filter(Boolean).length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fasilitas Umum</p>
                  <p className="font-semibold">
                    {koordinatList.filter(k => k.tipe === 'Fasilitas Umum').length}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Area Pertanian</p>
                  <p className="font-semibold">
                    {koordinatList.filter(k => k.tipe === 'Pertanian').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
