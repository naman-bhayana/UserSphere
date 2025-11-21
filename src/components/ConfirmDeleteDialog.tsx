import * as Dialog from '@radix-ui/react-dialog'

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteDialog({
  open,
  onOpenChange,
  userName,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md z-50 focus:outline-none border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                Delete User
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 dark:text-gray-400 mt-1">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{userName}</span>? This action cannot be undone.
              </Dialog.Description>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transition-all duration-200 font-medium"
              aria-label="Confirm delete user"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

