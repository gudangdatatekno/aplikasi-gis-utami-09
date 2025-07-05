
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Edit, Trash2 } from "lucide-react"
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
import { Sawah } from "./types"

interface SawahColumnsProps {
  onEdit: (sawah: Sawah) => void
  onDelete: (sawah: Sawah) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Panen": return "bg-green-100 text-green-800";
    case "Tanam": return "bg-blue-100 text-blue-800";
    case "Vegetatif": return "bg-yellow-100 text-yellow-800";
    case "Generatif": return "bg-purple-100 text-purple-800";
    case "Persiapan": return "bg-orange-100 text-orange-800";
    case "Bera": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export const createSawahColumns = ({ onEdit, onDelete }: SawahColumnsProps): ColumnDef<Sawah>[] => [
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Sawah
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("nama")}</div>,
  },
  {
    accessorKey: "petani",
    header: "Petani",
  },
  {
    accessorKey: "luas",
    header: "Luas",
    cell: ({ row }) => <div>{row.getValue("luas")} Ha</div>,
  },
  {
    accessorKey: "jenisVarietas",
    header: "Varietas",
  },
  {
    accessorKey: "musimTanam",
    header: "Musim Tanam",
  },
  {
    accessorKey: "hasilPanen",
    header: "Hasil Panen",
    cell: ({ row }) => {
      const hasil = row.getValue("hasilPanen") as number
      const colorClass = hasil > 8 ? "text-green-600" : hasil > 6 ? "text-yellow-600" : "text-red-600"
      return <div className={colorClass}>{hasil} Ton/Ha</div>
    },
  },
  {
    accessorKey: "statusTanam",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("statusTanam") as string
      return (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const sawah = row.original

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
            <DropdownMenuItem onClick={() => onEdit(sawah)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(sawah)}
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
