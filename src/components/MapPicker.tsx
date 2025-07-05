
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapStyles.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onCoordinateSelect: (lat: number, lng: number) => void;
  height?: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  latitude = -7.2575,
  longitude = 112.7521,
  onCoordinateSelect,
  height = "400px"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentCoords, setCurrentCoords] = useState({ lat: latitude, lng: longitude });

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([latitude, longitude], 13);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add initial marker
    const marker = L.marker([latitude, longitude], {
      draggable: true
    }).addTo(map);
    markerRef.current = marker;

    // Handle map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      
      // Update coordinates
      setCurrentCoords({ lat, lng });
      onCoordinateSelect(lat, lng);
    });

    // Handle marker drag
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      setCurrentCoords({ lat: position.lat, lng: position.lng });
      onCoordinateSelect(position.lat, position.lng);
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude]);
      setCurrentCoords({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      <div 
        ref={mapRef} 
        style={{ height }}
        className="w-full border rounded-lg shadow-sm"
      />
      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
        <strong>Koordinat Terpilih:</strong> {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
        <br />
        <em>Klik pada peta atau seret marker untuk memilih koordinat</em>
      </div>
    </div>
  );
};
