
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, MapPin, Package2, TrendingUp, AlertTriangle, Leaf } from "lucide-react";

export const Dashboard = () => {
  // Data untuk cards overview
  const overviewData = {
    totalPetani: 4,
    totalLahan: 9.6,
    totalProduksi: 78.2,
    rataRataProduktivitas: 8.15
  };

  // Data untuk chart produktivitas bulanan
  const produktivitasBulanan = [
    { bulan: 'Jan', produksi: 65.2 },
    { bulan: 'Feb', produksi: 72.1 },
    { bulan: 'Mar', produksi: 78.2 },
    { bulan: 'Apr', produksi: 68.5 },
    { bulan: 'Mei', produksi: 74.8 },
    { bulan: 'Jun', produksi: 82.3 },
  ];

  // Data untuk pie chart status lahan
  const statusLahan = [
    { nama: 'Panen', jumlah: 2, color: '#22c55e' },
    { nama: 'Tanam', jumlah: 1, color: '#3b82f6' },
    { nama: 'Vegetatif', jumlah: 1, color: '#f59e0b' },
  ];

  // Data untuk tabel petani
  const dataPetani = [
    { 
      id: 1, 
      nama: "Budi Santoso", 
      luas: 2.5, 
      varietas: "IR64", 
      status: "Panen", 
      hasil: 8.2,
      alamat: "Desa Sukamaju"
    },
    { 
      id: 2, 
      nama: "Sari Wati", 
      luas: 1.8, 
      varietas: "Ciherang", 
      status: "Tanam", 
      hasil: 6.5,
      alamat: "Desa Makmur"
    },
    { 
      id: 3, 
      nama: "Joko Widodo", 
      luas: 3.2, 
      varietas: "Inpari 32", 
      status: "Vegetatif", 
      hasil: 10.1,
      alamat: "Desa Sejahtera"
    },
    { 
      id: 4, 
      nama: "Rina Sari", 
      luas: 2.1, 
      varietas: "IR64", 
      status: "Panen", 
      hasil: 7.8,
      alamat: "Desa Subur"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Panen':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Panen</Badge>;
      case 'Tanam':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Tanam</Badge>;
      case 'Vegetatif':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Vegetatif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Selamat datang di Sistem Informasi Geografis Pertanian</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>Update terakhir: Hari ini</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Petani</p>
                <p className="text-3xl font-bold">{overviewData.totalPetani}</p>
                <p className="text-blue-100 text-xs mt-1">Petani aktif</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Lahan</p>
                <p className="text-3xl font-bold">{overviewData.totalLahan}</p>
                <p className="text-green-100 text-xs mt-1">Hektar</p>
              </div>
              <MapPin className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Produksi</p>
                <p className="text-3xl font-bold">{overviewData.totalProduksi}</p>
                <p className="text-yellow-100 text-xs mt-1">Ton</p>
              </div>
              <Package2 className="h-12 w-12 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Rata-rata Hasil</p>
                <p className="text-3xl font-bold">{overviewData.rataRataProduktivitas}</p>
                <p className="text-purple-100 text-xs mt-1">Ton/Ha</p>
              </div>
              <Leaf className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Produktivitas Bulanan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={produktivitasBulanan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} Ton`, 'Produksi']} />
                <Line 
                  type="monotone" 
                  dataKey="produksi" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span>Status Lahan Sawah</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusLahan}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="jumlah"
                  label={({ nama, jumlah }) => `${nama}: ${jumlah}`}
                >
                  {statusLahan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Data Petani & Lahan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nama Petani</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Luas Lahan</TableHead>
                  <TableHead>Varietas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hasil (Ton/Ha)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataPetani.map((petani) => (
                  <TableRow key={petani.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{petani.id}</TableCell>
                    <TableCell className="font-semibold text-gray-900">{petani.nama}</TableCell>
                    <TableCell className="text-gray-600">{petani.alamat}</TableCell>
                    <TableCell>
                      <span className="font-medium">{petani.luas}</span>
                      <span className="text-gray-500 text-sm ml-1">Ha</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {petani.varietas}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(petani.status)}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${
                        petani.hasil > 8 ? 'text-green-600' : 
                        petani.hasil > 6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {petani.hasil}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Produktivitas Tinggi</p>
                <p className="text-2xl font-bold text-green-600">2 Lahan</p>
                <p className="text-xs text-gray-500">≥ 8 Ton/Ha</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Produktivitas Sedang</p>
                <p className="text-2xl font-bold text-yellow-600">2 Lahan</p>
                <p className="text-xs text-gray-500">6-8 Ton/Ha</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Varietas Populer</p>
                <p className="text-2xl font-bold text-blue-600">IR64</p>
                <p className="text-xs text-gray-500">2 dari 4 lahan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
