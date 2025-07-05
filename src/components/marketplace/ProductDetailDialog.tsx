
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, User } from "lucide-react"
import { Produk } from "./types"

interface ProductDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Produk | null
}

export const ProductDetailDialog = ({ isOpen, onClose, product }: ProductDetailDialogProps) => {
  const getKualitasColor = (kualitas: string) => {
    switch (kualitas) {
      case "Premium": return "bg-purple-100 text-purple-800";
      case "A": return "bg-green-100 text-green-800";
      case "B": return "bg-yellow-100 text-yellow-800";
      case "C": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Produk - {product.nama}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Petani</p>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                {product.petani}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Kualitas</p>
              <Badge className={getKualitasColor(product.kualitas)}>
                {product.kualitas}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Harga</p>
              <p className="text-green-600 font-semibold">Rp {product.harga.toLocaleString()}/{product.satuan}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Stok</p>
              <p className="text-sm text-gray-600">{product.stok} {product.satuan}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Lokasi</p>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {product.lokasi}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Deskripsi</p>
            <p className="text-sm text-gray-600">{product.deskripsi}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span className="text-sm">Kontak: {product.kontak}</span>
          </div>
          <Button className="w-full">
            Hubungi Petani
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
