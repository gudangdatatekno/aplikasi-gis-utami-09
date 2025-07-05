
import { LayoutDashboard, MapPin, Users, FileText, ChartBar, ShoppingCart, Package2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'peta', label: 'Peta Tematik', icon: MapPin },
    { id: 'petani', label: 'Data Petani', icon: Users },
    { id: 'sawah', label: 'Data Sawah', icon: MapPin },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'pupuk', label: 'Manajemen Pupuk', icon: Package2 },
    { id: 'statistik', label: 'Statistik', icon: ChartBar },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeTab === item.id
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
