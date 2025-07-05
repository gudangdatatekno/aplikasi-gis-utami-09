
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Produk } from "./types"

interface ProductColumnsProps {
  onEdit: (produk: Produk) => void
  onDelete: (produk: Produk) => void
  onViewDetail: (produk: Produk) => void
}

export const createProductColumns = ({ 
  onEdit, 
  onDelete, 
  onViewDetail 
}: ProductColumnsProps): ColumnDef<Produk>[] => {
  const getKualitasColor = (kualitas: string) => {
    switch (kualitas) {
      case "Premium": return "bg-purple-100 text-purple-800";
      case "A": return "bg-green-100 text-green-800";
      case "B": return "bg-yellow-100 text-yellow-800";
      case "C": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  return [
    {
      accessorKey: "nama",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Produk
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "petani",
      header: "Petani",
    },
    {
      accessorKey: "harga",
      header: "Harga",
      cell: ({ row }) => {
        const harga = row.getValue("harga") as number
        const satuan = row.original.satuan
        return <div className="text-green-600 font-semibold">Rp {harga.toLocaleString()}/{satuan}</div>
      },
    },
    {
      accessorKey: "stok",
      header: "Stok",
      cell: ({ row }) => {
        const stok = row.getValue("stok") as number
        const satuan = row.original.satuan
        return <div>{stok} {satuan}</div>
      },
    },
    {
      accessorKey: "kualitas",
      header: "Kualitas",
      cell: ({ row }) => {
        const kualitas = row.getValue("kualitas") as string
        return (
          <Badge className={getKualitasColor(kualitas)}>
            {kualitas}
          </Badge>
        )
      },
    },
    {
      accessorKey: "lokasi",
      header: "Lokasi",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const produk = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewDetail(produk)}>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(produk)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(produk)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
