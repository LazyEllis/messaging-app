import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import LoadingIcon from "../components/LoadingIcon";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { logout } = useAuth();
  const { data: user, error } = useProfile();

  useEffect(() => {
    if (error?.message === "Unauthorized") {
      logout();
    }
  }, [error?.message, logout]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="relative z-50 backdrop:bg-black lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-[#1a1a1e]/50 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex focus:outline-none">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="relative flex grow flex-col gap-y-5 bg-[#121214] px-6 pb-2 ring ring-white/10 before:pointer-events-none before:absolute before:inset-0 before:bg-black/10">
              <div className="relative flex h-15 shrink-0 items-center font-semibold">
                Messaging App
              </div>
              <nav className="relative flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul className="-mx-1 space-y-1">
                      <li>
                        <Link
                          to="/"
                          className="flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                          Channels
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="mb-3.5 flex items-center">
                      {user ? (
                        <>
                          <div className="shrink-0">
                            <UserCircleIcon className="size-10 rounded-full outline -outline-offset-1 outline-white/10" />
                          </div>
                          <div className="ml-3">
                            <div className="text-base/5 font-medium text-white">
                              {user?.name}
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                              {user?.email}
                            </div>
                          </div>
                        </>
                      ) : (
                        <LoadingIcon />
                      )}
                    </div>
                    <ul className="-mx-1 mt-1 space-y-1">
                      <li>
                        <Link
                          to="/profile"
                          className="flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                          Your Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="flex w-full cursor-pointer gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <aside className="hidden bg-[#1a1a1e] lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-2xs lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 bg-[#121214] px-6">
          <div className="relative flex h-15 shrink-0 items-center font-semibold">
            Messaging App
          </div>
          <nav className="relative flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-1 space-y-1">
                  <li>
                    <Link
                      to="/"
                      className="flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Channels
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <div className="mb-3.5 flex items-center">
                  {user ? (
                    <>
                      <div className="shrink-0">
                        <UserCircleIcon className="size-10 rounded-full outline -outline-offset-1 outline-white/10" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base/5 font-medium text-white">
                          {user?.name}
                        </div>
                        <div className="text-sm font-medium text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                    </>
                  ) : (
                    <LoadingIcon />
                  )}
                </div>
                <ul className="-mx-1 mt-1 space-y-1">
                  <li>
                    <Link
                      to="/profile"
                      className="flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Your Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="flex w-full cursor-pointer gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center gap-x-6 bg-[#121214] px-4 py-4 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-white/10 after:bg-black/10 sm:px-6 lg:hidden">
        <button
          onClick={handleOpen}
          className="-m-2.5 p-2.5 text-gray-400 hover:text-white"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="size-6" />
        </button>
        <div className="flex-1 text-sm/6 font-semibold text-white">
          Messaging App
        </div>
        <Menu as="div" className="relative ml-3">
          <MenuButton className="relative flex max-w-xs items-center rounded-full text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon className="size-8 rounded-full outline -outline-offset-1 outline-white/10" />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
          >
            <MenuItem>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
              >
                Your profile
              </Link>
            </MenuItem>
            <MenuItem>
              <button
                onClick={logout}
                className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
              >
                Sign Out
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </header>
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
