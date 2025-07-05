
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sawah } from "./types"

interface DeleteSawahDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  sawah: Sawah | null
}

export const DeleteSawahDialog = ({ isOpen, onClose, onConfirm, sawah }: DeleteSawahDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Sawah</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data sawah {sawah?.nama}? 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
