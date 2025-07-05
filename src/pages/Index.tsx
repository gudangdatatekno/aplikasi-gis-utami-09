
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import MapComponent from "@/components/MapComponent";
import { DataPetani } from "@/components/DataPetani";
import { DataSawah } from "@/components/DataSawah";
import { Marketplace } from "@/components/Marketplace";
import { ManajemenPupuk } from "@/components/ManajemenPupuk";
import { Statistik } from "@/components/Statistik";
import { Pengaturan } from "@/components/Pengaturan";
import { useStorageInitialization } from "@/hooks/useStorageInitialization";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isInitialized, isLoading, error } = useStorageInitialization();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `Gagal menginisialisasi penyimpanan data: ${error}`,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data aplikasi...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600">Terjadi kesalahan saat memuat aplikasi</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    if (!isInitialized) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-600">Menginisialisasi aplikasi...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'peta':
        return <MapComponent />;
      case 'petani':
        return <DataPetani />;
      case 'sawah':
        return <DataSawah />;
      case 'marketplace':
        return <Marketplace />;
      case 'pupuk':
        return <ManajemenPupuk />;
      case 'statistik':
        return <Statistik />;
      case 'pengaturan':
        return <Pengaturan />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
