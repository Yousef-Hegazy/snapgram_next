import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Loader from '@/components/ui/Loader'
import { Trash2, X } from 'lucide-react'

interface DeletePostDialogProps {
  children: React.ReactNode
  onDelete: () => void
  isPending: boolean
}

export function DeletePostDialog({
  children,
  onDelete,
  isPending,
}: DeletePostDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-dark-4 border-dark-2">
        <DialogHeader>
          <DialogTitle className="text-light-1">Delete Post</DialogTitle>
          <DialogDescription className="text-light-2">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-dark-2 border-dark-3 text-light-1 hover:bg-dark-3 hover:text-light-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isPending ? (
              <Loader />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
