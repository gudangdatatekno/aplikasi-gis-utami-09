
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
import { Petani } from "./types"

interface PetaniColumnsProps {
  onEdit: (petani: Petani) => void
  onDelete: (petani: Petani) => void
}

export const createPetaniColumns = ({ onEdit, onDelete }: PetaniColumnsProps): ColumnDef<Petani>[] => [
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "umur",
    header: "Umur",
    cell: ({ row }) => <div>{row.getValue("umur")} tahun</div>,
  },
  {
    accessorKey: "alamat",
    header: "Alamat",
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("alamat")}</div>,
  },
  {
    accessorKey: "jumlahSawah",
    header: "Jumlah Sawah",
    cell: ({ row }) => <div>{row.getValue("jumlahSawah")} lokasi</div>,
  },
  {
    accessorKey: "totalLuas",
    header: "Total Luas",
    cell: ({ row }) => <div>{row.getValue("totalLuas")} Ha</div>,
  },
  {
    accessorKey: "totalHasil",
    header: "Total Hasil",
    cell: ({ row }) => <div>{row.getValue("totalHasil")} Ton</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "Aktif" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const petani = row.original

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
            <DropdownMenuItem onClick={() => onEdit(petani)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(petani)}
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
