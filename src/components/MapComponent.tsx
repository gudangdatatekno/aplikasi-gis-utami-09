
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapStyles.css';
import { Card } from "@/components/ui/card";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  // Data sawah dengan koordinat GeoJSON dan informasi musim tanam
  const sawahGeoData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: 1,
          name: "Sawah Pak Budi",
          petani: "Budi Santoso",
          luas: 2.5,
          hasil: 8.2,
          varietas: "IR64",
          musim: "Gadu", // Gadu (Musim Kering)
          status: "Panen",
          alamat: "Desa Sukamaju"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [112.7510, -7.2570],
            [112.7520, -7.2570],
            [112.7520, -7.2580],
            [112.7510, -7.2580],
            [112.7510, -7.2570]
          ]]
        }
      },
      {
        type: "Feature",
        properties: {
          id: 2,
          name: "Sawah Bu Sari",
          petani: "Sari Wati",
          luas: 1.8,
          hasil: 6.5,
          varietas: "Ciherang",
          musim: "Rendengan", // Rendengan (Musim Hujan)
          status: "Tanam",
          alamat: "Desa Makmur"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [112.7525, -7.2575],
            [112.7535, -7.2575],
            [112.7535, -7.2585],
            [112.7525, -7.2585],
            [112.7525, -7.2575]
          ]]
        }
      },
      {
        type: "Feature",
        properties: {
          id: 3,
          name: "Sawah Pak Joko",
          petani: "Joko Widodo",
          luas: 3.2,
          hasil: 10.1,
          varietas: "Inpari 32",
          musim: "Gadu",
          status: "Vegetatif",
          alamat: "Desa Sejahtera"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [112.7505, -7.2560],
            [112.7515, -7.2560],
            [112.7515, -7.2570],
            [112.7505, -7.2570],
            [112.7505, -7.2560]
          ]]
        }
      },
      {
        type: "Feature",
        properties: {
          id: 4,
          name: "Sawah Bu Rina",
          petani: "Rina Sari",
          luas: 2.1,
          hasil: 7.8,
          varietas: "IR64",
          musim: "Rendengan",
          status: "Panen",
          alamat: "Desa Subur"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [112.7530, -7.2590],
            [112.7540, -7.2590],
            [112.7540, -7.2600],
            [112.7530, -7.2600],
            [112.7530, -7.2590]
          ]]
        }
      }
    ]
  };

  // Fungsi untuk menentukan warna berdasarkan musim tanam
  const getSeasonColor = (musim: string) => {
    switch (musim) {
      case 'Gadu':
        return '#f59e0b'; // Kuning untuk musim kering
      case 'Rendengan':
        return '#22c55e'; // Hijau untuk musim hujan
      default:
        return '#6b7280'; // Abu-abu default
    }
  };

  // Fungsi untuk menentukan warna border berdasarkan status
  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'Panen':
        return '#dc2626'; // Merah untuk panen
      case 'Tanam':
        return '#2563eb'; // Biru untuk tanam
      case 'Vegetatif':
        return '#16a34a'; // Hijau untuk vegetatif
      default:
        return '#374151'; // Abu-abu default
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Inisialisasi peta dengan OpenStreetMap
    map.current = L.map(mapContainer.current).setView([-7.2575, 112.7521], 15);

    // Tambahkan tile layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Tambahkan layer GeoJSON sawah
    const sawahLayer = L.geoJSON(sawahGeoData as any, {
      style: (feature) => {
        if (!feature?.properties) return {};
        return {
          fillColor: getSeasonColor(feature.properties.musim),
          weight: 3,
          opacity: 1,
          color: getStatusBorderColor(feature.properties.status),
          fillOpacity: 0.7
        };
      },
      onEachFeature: (feature, layer) => {
        // Tambahkan popup untuk setiap sawah
        const props = feature.properties;
        const popupContent = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-green-700 text-lg mb-2">${props.name}</h3>
            <div class="space-y-1 text-sm">
              <p><span class="font-semibold">Petani:</span> ${props.petani}</p>
              <p><span class="font-semibold">Alamat:</span> ${props.alamat}</p>
              <p><span class="font-semibold">Luas:</span> ${props.luas} Ha</p>
              <p><span class="font-semibold">Varietas:</span> ${props.varietas}</p>
              <p><span class="font-semibold">Musim:</span> <span class="px-2 py-1 rounded text-xs" style="background-color: ${getSeasonColor(props.musim)}20; color: ${getSeasonColor(props.musim)}">${props.musim}</span></p>
              <p><span class="font-semibold">Status:</span> <span class="px-2 py-1 rounded text-xs" style="background-color: ${getStatusBorderColor(props.status)}20; color: ${getStatusBorderColor(props.status)}">${props.status}</span></p>
              <p><span class="font-semibold">Hasil:</span> ${props.hasil} Ton/Ha</p>
            </div>
          </div>
        `;

        layer.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        // Tambahkan hover effect
        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              weight: 5,
              fillOpacity: 0.9
            });
          },
          mouseout: (e) => {
            sawahLayer.resetStyle(e.target);
          }
        });
      }
    }).addTo(map.current);

    // Sesuaikan zoom untuk menampilkan semua sawah
    map.current.fitBounds(sawahLayer.getBounds(), { padding: [20, 20] });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-3">Legenda Peta Sawah</h4>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium mb-2">Musim Tanam:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Gadu (Musim Kering)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
                <span>Rendengan (Musim Hujan)</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2">Status Tanaman (Border):</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 rounded" style={{ borderColor: '#dc2626' }}></div>
                <span>Panen</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 rounded" style={{ borderColor: '#2563eb' }}></div>
                <span>Tanam</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 rounded" style={{ borderColor: '#16a34a' }}></div>
                <span>Vegetatif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Informasi Wilayah</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-600">Total Sawah</p>
            <p className="font-semibold">{sawahGeoData.features.length} Lokasi</p>
          </div>
          <div>
            <p className="text-gray-600">Total Luas</p>
            <p className="font-semibold">
              {sawahGeoData.features.reduce((sum, f) => sum + f.properties.luas, 0)} Ha
            </p>
          </div>
          <div>
            <p className="text-gray-600">Musim Gadu</p>
            <p className="font-semibold text-yellow-600">
              {sawahGeoData.features.filter(f => f.properties.musim === 'Gadu').length} Sawah
            </p>
          </div>
          <div>
            <p className="text-gray-600">Musim Rendengan</p>
            <p className="font-semibold text-green-600">
              {sawahGeoData.features.filter(f => f.properties.musim === 'Rendengan').length} Sawah
            </p>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t text-xs text-gray-500">
          <p>💡 Klik pada area sawah untuk melihat detail informasi</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
