import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PlusIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useProfile } from "../hooks/useProfile";
import {
  createDM,
  createGroup,
  deleteChannel,
  listChannels,
  listUsers,
  updateChannel,
} from "../lib/api";
import { getChannelName } from "../lib/utils";
import ModalForm from "../components/ModalForm";
import Input from "../components/Input";
import AutocompleteList from "../components/AutocompleteList";
import DeletionModal from "../components/DeletionModal";

const Channels = () => {
  const [action, setAction] = useState({ id: null, name: null });
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", recipients: [] });

  const queryClient = useQueryClient();

  const usersQuery = useQuery({ queryFn: listUsers, queryKey: ["users"] });

  const {
    data: channels,
    isPending,
    error,
  } = useQuery({ queryFn: listChannels, queryKey: ["channels"] });

  const { data: user, isPending: isProfilePending } = useProfile();

  const createMutation = useMutation({
    mutationFn: formData.recipients.length > 1 ? createGroup : createDM,
    onSuccess: (data) => {
      queryClient.setQueryData(["channels"], (channels) => [data, ...channels]);
      setAction({ id: null, name: null });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateChannel,
    onSuccess: (data) => {
      queryClient.setQueryData(["channels"], (channels) =>
        channels.map((channel) => (channel.id === data.id ? data : channel)),
      );
      setAction({ id: null, name: null });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChannel,
    onSuccess: () => {
      queryClient.setQueryData(["channels"], (channels) =>
        channels.filter((channel) => channel.id !== action.id),
      );
      setAction({ id: null, name: null });
    },
  });

  const handleCreateModalOpen = () => {
    setAction({ id: null, name: "CREATE" });
    setFormData({ name: "", recipients: [] });
  };

  const handleUpdateModalOpen = (id) => {
    setAction({ id, name: "UPDATE" });
    const selectedChannel = channels.find((channel) => channel.id === id);
    setFormData({
      ...selectedChannel,
      recipients: selectedChannel.recipients.filter(
        (recipient) => recipient.id !== user.id,
      ),
    });
  };

  const handleDeleteModalOpen = (id) => {
    setAction({ id, name: "DELETE" });
  };

  const handleClose = () => {
    setAction({ id: null, name: null });
  };

  const handleAddRecipient = (value) => {
    setFormData({
      ...formData,
      recipients: [
        ...formData.recipients,
        usersQuery.data.find((user) => user.id === value.id),
      ],
    });
  };

  const handleRemoveRecipient = (id) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter(
        (recipient) => recipient.id !== id,
      ),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(action.id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const recipients = formData.recipients.map((recipient) => ({
      id: recipient.id,
    }));

    if (action.id) {
      return updateMutation.mutate({
        channelId: action.id,
        channelData: { name: formData.name, recipients },
      });
    }

    createMutation.mutate(
      recipients.length > 1
        ? { name: formData.name, recipients }
        : { recipient: recipients[0].id },
    );
  };

  if (isPending || isProfilePending || usersQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (error || usersQuery.error) {
    return <div>{error.message || usersQuery.error.message}</div>;
  }

  const filteredUsers =
    query === ""
      ? usersQuery.data
      : usersQuery.data.filter((user) => {
          return user.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-medium">Channels</h1>
        <button
          onClick={handleCreateModalOpen}
          className="ml-4 text-gray-400 hover:text-white"
        >
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
              {!(channel.type === "GROUP" && user.id !== channel.owner.id) && (
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
                          <button
                            onClick={() => handleUpdateModalOpen(channel.id)}
                            className="block w-full px-3 py-1 text-left text-sm/6 text-white hover:bg-white/5 hover:outline-none"
                          >
                            Edit
                          </button>
                        </MenuItem>
                      )}
                      <MenuItem>
                        <button
                          onClick={() => handleDeleteModalOpen(channel.id)}
                          className="block w-full px-3 py-1 text-left text-sm/6 text-white hover:bg-white/5 hover:outline-none"
                        >
                          Delete
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              )}
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
            <button
              onClick={handleCreateModalOpen}
              className="bg-blurple-500 hover:bg-blurple-600 focus-visible:outline-brand inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <PlusIcon className="mr-1.5 -ml-0.5 size-5" /> Create Channel
            </button>
          </div>
        </div>
      )}

      <ModalForm
        isOpen={action.name === "CREATE" || action.name === "UPDATE"}
        onClose={handleClose}
        onSubmit={handleSubmit}
        error={action.id ? updateMutation.error : createMutation.error}
        isPending={
          action.id ? updateMutation.isPending : createMutation.isPending
        }
        title={
          action.id
            ? "Edit Channel"
            : `New ${formData.recipients.length > 1 ? "Group" : "DM"} Channel`
        }
      >
        {(action.id || formData.recipients.length > 1) && (
          <Input
            id="name"
            label="Group Name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        )}

        <AutocompleteList
          id="recipients"
          label="Recipients"
          value=""
          options={filteredUsers}
          onChange={handleAddRecipient}
          onInputChange={(e) => setQuery(e.target.value)}
          onClose={() => setQuery("")}
        />

        {formData.recipients.length > 0 && (
          <ul className="divide-y divide-white/5">
            {formData.recipients.map((recipient) => (
              <li
                className="flex justify-between gap-x-6 py-2.5"
                key={recipient.id}
              >
                <div className="flex min-w-0 items-center gap-x-4">
                  {recipient.name}
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient(recipient.id)}
                    className="relative block text-gray-400 hover:text-white"
                  >
                    <span className="absolute -inset-2.5"></span>
                    <span className="sr-only">Remove Recipient</span>
                    <XMarkIcon className="size-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ModalForm>

      <DeletionModal
        entity={
          action.id &&
          getChannelName(
            user,
            channels.find((channel) => channel.id === action.id),
          )
        }
        type="channel"
        isOpen={action.name === "DELETE"}
        onClose={handleClose}
        onDelete={handleDelete}
        error={deleteMutation.error}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default Channels;
