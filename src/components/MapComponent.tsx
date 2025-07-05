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

// Consistent coordinates for Desa Sumberagung
const DESA_SUMBERAGUNG = {
  lat: -7.0521,
  lng: 110.7987
};

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  // Updated sawah data with coordinates relative to Desa Sumberagung
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
          alamat: "Desa Sumberagung, RT 01"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [110.7970, -7.0500],
            [110.7980, -7.0500],
            [110.7980, -7.0510],
            [110.7970, -7.0510],
            [110.7970, -7.0500]
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
          alamat: "Desa Sumberagung, RT 02"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [110.7985, -7.0515],
            [110.7995, -7.0515],
            [110.7995, -7.0525],
            [110.7985, -7.0525],
            [110.7985, -7.0515]
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
          alamat: "Desa Sumberagung, RT 03"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [110.7995, -7.0520],
            [110.8005, -7.0520],
            [110.8005, -7.0530],
            [110.7995, -7.0530],
            [110.7995, -7.0520]
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
          alamat: "Desa Sumberagung, RT 04"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [110.8000, -7.0540],
            [110.8010, -7.0540],
            [110.8010, -7.0550],
            [110.8000, -7.0550],
            [110.8000, -7.0540]
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

    // Initialize map centered on Desa Sumberagung
    map.current = L.map(mapContainer.current).setView([DESA_SUMBERAGUNG.lat, DESA_SUMBERAGUNG.lng], 14);

    // Add tile layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add village center marker
    L.marker([DESA_SUMBERAGUNG.lat, DESA_SUMBERAGUNG.lng])
      .addTo(map.current)
      .bindPopup(`
        <div class="p-3">
          <h3 class="font-bold text-blue-700 text-lg mb-2">Desa Sumberagung</h3>
          <p class="text-sm"><span class="font-semibold">Kecamatan:</span> Godong</p>
          <p class="text-sm"><span class="font-semibold">Kabupaten:</span> Grobogan</p>
          <p class="text-sm"><span class="font-semibold">Koordinat:</span> 7.0521° S, 110.7987° E</p>
        </div>
      `);

    // Add GeoJSON sawah layer
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

    // Fit bounds to show all sawah areas
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
      
      {/* Updated Legend with Desa Sumberagung info */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-3">Peta Sawah Desa Sumberagung</h4>
        <p className="text-xs text-muted-foreground mb-3">Kec. Godong, Kab. Grobogan</p>
        
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

      {/* Updated Info Panel */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Informasi Wilayah Desa Sumberagung</h4>
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
          <p>📍 Pusat Desa: 7.0521° S, 110.7987° E</p>
          <p>💡 Klik pada area sawah untuk melihat detail informasi</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
