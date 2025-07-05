
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartBar } from "lucide-react";

export const Statistik = () => {
  const produktivitasData = [
    { nama: 'Budi Santoso', hasil: 8.2 },
    { nama: 'Sari Wati', hasil: 6.5 },
    { nama: 'Joko Widodo', hasil: 10.1 },
    { nama: 'Rina Sari', hasil: 7.8 },
  ];

  const varietasData = [
    { nama: 'IR64', jumlah: 2, color: '#22c55e' },
    { nama: 'Ciherang', jumlah: 1, color: '#3b82f6' },
    { nama: 'Inpari 32', jumlah: 1, color: '#f59e0b' },
  ];

  const statusTanamData = [
    { status: 'Panen', jumlah: 2, color: '#22c55e' },
    { status: 'Tanam', jumlah: 1, color: '#3b82f6' },
    { status: 'Vegetatif', jumlah: 1, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Statistik & Analisis</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ChartBar className="h-4 w-4" />
          <span>Dashboard Analitik</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Total Petani</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Total Luas</p>
                <p className="text-2xl font-bold">9.6 Ha</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Rata-rata Hasil</p>
                <p className="text-2xl font-bold">8.15 Ton/Ha</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Total Produksi</p>
                <p className="text-2xl font-bold">78.2 Ton</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produktivitas per Petani</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={produktivitasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nama" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hasil" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Varietas Padi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={varietasData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="jumlah"
                  label={({ nama, jumlah }) => `${nama}: ${jumlah}`}
                >
                  {varietasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Masa Tanam</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusTanamData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="jumlah"
                  label={({ status, jumlah }) => `${status}: ${jumlah}`}
                >
                  {statusTanamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kinerja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Produktivitas Tinggi (&gt;8 Ton/Ha)</span>
                <span className="font-bold text-green-600">2 Sawah</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Produktivitas Sedang (6-8 Ton/Ha)</span>
                <span className="font-bold text-yellow-600">2 Sawah</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">Produktivitas Rendah (&lt;6 Ton/Ha)</span>
                <span className="font-bold text-red-600">0 Sawah</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
