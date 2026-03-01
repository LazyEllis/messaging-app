import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ErrorAlert from "./ErrorAlert";
import LoadingIcon from "./LoadingIcon";

const DeletionModal = ({
  entity,
  type,
  isOpen,
  onClose,
  onDelete,
  error,
  isPending,
}) => (
  <Dialog open={isOpen} onClose={onClose} className="relative z-50">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-[#070708]/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    />

    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-[#242429] text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div className="bg-[#242429] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                <ExclamationTriangleIcon
                  aria-hidden="true"
                  className="size-6 text-red-400"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-white"
                >
                  Delete {entity}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Are you sure you want to delete this {type}? This action
                    cannot be undone.
                  </p>
                </div>
                {error && <ErrorAlert error={error} className="mt-4" />}
              </div>
            </div>
          </div>
          <div className="bg-[#242429] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-400 sm:ml-3 sm:w-auto"
            >
              {isPending && <LoadingIcon />}{" "}
              {isPending ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="text-gray-white hover:bg-white/2- mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold shadow-xs inset-ring inset-ring-white/5 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

export default DeletionModal;
