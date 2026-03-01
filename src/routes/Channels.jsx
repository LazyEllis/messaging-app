import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PlusIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useProfile } from "../hooks/useProfile";
import { listChannels } from "../lib/api";
import { getChannelName } from "../lib/utils";

const Channels = () => {
  const {
    data: channels,
    isPending,
    error,
  } = useQuery({ queryFn: listChannels, queryKey: ["channels"] });

  const { data: user, isPending: isProfilePending } = useProfile();

  if (isPending || isProfilePending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-medium">Channels</h1>
        <button className="ml-4 text-gray-400 hover:text-white">
          <span className="sr-only">Create Channel</span>
          <PlusIcon className="size-6" />
        </button>
      </div>
      {channels.length > 0 ? (
        <ul className="divide-y divide-white/5">
          {channels.map((channel) => (
            <li className="flex justify-between gap-x-6 py-5" key={channel.id}>
              <div className="flex min-w-0 items-center gap-x-4">
                {channel.type === "DM" ? (
                  <UserCircleIcon className="size-12 flex-none" />
                ) : (
                  <UserGroupIcon className="size-12 flex-none" />
                )}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm/6 font-semibold text-white">
                    <Link
                      to={`/channels/${channel.id}`}
                      className="hover:underline"
                    >
                      {getChannelName(user, channel)}
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="relative block text-gray-400 hover:text-white">
                    <span className="absolute -inset-2.5"></span>
                    <span className="sr-only">Open channel options</span>
                    <EllipsisVerticalIcon className="size-5" />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-gray-800 py-2 outline-1 -outline-offset-1 outline-white/10 transition transition-discrete data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {channel.type === "GROUP" && (
                      <MenuItem>
                        <button className="block w-full px-3 py-1 text-left text-sm/6 text-white hover:bg-white/5 hover:outline-none">
                          Edit
                        </button>
                      </MenuItem>
                    )}
                    <MenuItem>
                      <button className="block w-full px-3 py-1 text-left text-sm/6 text-white hover:bg-white/5 hover:outline-none">
                        Delete
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="pt-32 text-center">
          <ExclamationCircleIcon className="mx-auto size-12 text-gray-500" />
          <h2 className="mt-2 text-sm font-semibold text-white">No Channels</h2>
          <p className="mt-1 text-sm text-gray-400">
            Get started by creating a new channel.
          </p>
          <div className="mt-6">
            <button className="bg-blurple-500 hover:bg-blurple-600 focus-visible:outline-brand inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2">
              <PlusIcon className="mr-1.5 -ml-0.5 size-5" /> Create Channel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Channels;
