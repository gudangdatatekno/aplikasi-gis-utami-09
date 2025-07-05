
import { MapPin, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Petani GIS</h1>
              <p className="text-sm text-gray-500">Selamat datang di Sistem Informasi Geografis Pertanian</p>
              <p className="text-xs text-gray-400">Wilayah Desa Sumberagung, Kecamatan Godong, Kabupaten Grobogan</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">125 Petani Aktif</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">89 Lahan Sawah</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Laporan
          </Button>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};
