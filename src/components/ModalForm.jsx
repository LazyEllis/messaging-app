import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import ErrorAlert from "./ErrorAlert";
import LoadingIcon from "./LoadingIcon";

const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  error,
  isPending,
  title,
  children,
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
          className="relative w-full transform rounded-lg bg-[#242429] text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <form onSubmit={onSubmit} className="divide-y divide-[#2f2f34]">
            <div>
              <div className="bg-[#242429] px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-semibold text-white">
                    {title}
                  </DialogTitle>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="px-4 sm:px-6">
                  <div className="space-y-6 pt-6 pb-5">
                    {error && <ErrorAlert error={error} />}
                    {children}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#242429] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button className="bg-blurple-500 hover:bg-blurple-600 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto">
                {isPending && <LoadingIcon />}{" "}
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);

export default ModalForm;
