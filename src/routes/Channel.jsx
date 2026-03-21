import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  UserCircleIcon,
  UserGroupIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useProfile } from "../hooks/useProfile";
import { socket } from "../lib/socket";
import {
  deleteMessage,
  getChannel,
  listChannelMessages,
  postMessage,
  updateMessage,
} from "../lib/api";
import { classNames, formatTimestamp, getChannelName } from "../lib/utils";
import DeletionModal from "../components/DeletionModal";

const Channel = () => {
  const [action, setAction] = useState({ id: null, name: "", content: "" });
  const [formData, setFormData] = useState({ content: "", replyToId: "" });

  const { id } = useParams();
  const queryClient = useQueryClient();
  const shouldAutoScroll = useRef(true);
  const chatRef = useRef(null);

  const { data: channel, ...channelQuery } = useQuery({
    queryFn: () => getChannel(id),
    queryKey: ["channels", id],
  });

  const { data: messages, ...messagesQuery } = useQuery({
    queryFn: () => listChannelMessages(id),
    queryKey: ["channels", id, "messages"],
  });

  const { data: user, ...userQuery } = useProfile();

  useEffect(() => {
    const onSentMessage = (data) => {
      queryClient.setQueryData(["channels", id, "messages"], (messages) => [
        ...messages,
        data,
      ]);
      shouldAutoScroll.current = true;
    };

    const onEditedMessage = (data) => {
      queryClient.setQueryData(["channels", id, "messages"], (messages) =>
        messages.map((message) => (data.id === message.id ? data : message)),
      );
    };

    const onDeletedMessage = (messageId) => {
      queryClient.setQueryData(["channels", id, "messages"], (messages) =>
        messages.filter((message) => message.id !== messageId),
      );
    };

    socket.emit("join-channel", id);
    socket.on("sent-message", onSentMessage);
    socket.on("edited-message", onEditedMessage);
    socket.on("deleted-message", onDeletedMessage);

    return () => {
      socket.emit("leave-channel", id);
      socket.off("sent-message", onSentMessage);
      socket.off("edited-message", onEditedMessage);
      socket.off("deleted-message", onDeletedMessage);
    };
  }, [id, queryClient]);

  useEffect(() => {
    const element = chatRef.current;

    if (!element) return;

    if (shouldAutoScroll.current) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
      shouldAutoScroll.current = false;
    }
  }, [messages]);

  const postMutation = useMutation({
    mutationFn: postMessage,
    onSuccess: (data) => {
      queryClient.setQueryData(["channels", id, "messages"], (messages) => [
        ...messages,
        data,
      ]);
      setFormData({ content: "", replyToId: "" });
      shouldAutoScroll.current = true;
      socket.emit("send-message", id, data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMessage,
    onSuccess: (data) => {
      queryClient.setQueryData(["channels", id, "messages"], (messages) =>
        messages.map((message) => (data.id === message.id ? data : message)),
      );
      setAction({ id: null, name: "", content: "" });
      socket.emit("edit-message", id, data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.setQueryData(["channels", id, "messages"], (messages) =>
        messages.filter((message) => message.id !== action.id),
      );
      setAction({ id: null, name: "", content: "" });
      socket.emit("delete-message", id, action.id);
    },
  });

  const handleUpdateToggle = (id) => {
    const { content } = messages.find((message) => message.id === id);
    setAction({ id, name: "UPDATE", content });
  };

  const handleDeleteModalOpen = (id) => {
    setAction({ id, name: "DELETE" });
  };

  const handleClose = () => {
    setAction({ id: null, name: "", content: "" });
  };

  const handleReplyToggle = (id) => {
    setFormData({ ...formData, replyToId: id });
  };

  const handleReplyCancel = () => {
    setFormData({ ...formData, replyToId: "" });
  };

  const handleMessageChange = (e) => {
    action.name === "UPDATE"
      ? setAction({ ...action, [e.target.name]: e.target.value })
      : setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ channelId: id, messageId: action.id });
  };

  const handlePost = (e) => {
    e.preventDefault();
    action.name === "UPDATE"
      ? updateMutation.mutate({
          channelId: id,
          messageId: action.id,
          messageData: { content: action.content },
        })
      : postMutation.mutate({ channelId: id, messageData: formData });
  };

  if (
    channelQuery.isPending ||
    messagesQuery.isPending ||
    userQuery.isPending
  ) {
    return <div>Loading...</div>;
  }

  if (channelQuery.error || messagesQuery.error || userQuery.error) {
    return (
      <div>
        {channelQuery.error.message ||
          messagesQuery.error.message ||
          userQuery.error.message}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-144px)] flex-col overflow-hidden lg:h-[calc(100vh-80px)]">
      <div className="flex items-center gap-2 border-b border-[#2f2f34] pb-5">
        {channel.type === "DM" ? (
          <UserCircleIcon className="size-8 flex-none" />
        ) : (
          <UserGroupIcon className="size-8 flex-none" />
        )}
        <h1 className="font-semibold"> {getChannelName(user, channel)}</h1>
      </div>

      <ol
        className="relative z-10 flex h-full flex-col overflow-x-hidden overflow-y-auto"
        ref={chatRef}
      >
        {messages.map((message) => (
          <li
            key={message.id}
            className={classNames(
              formData.replyToId === message.id || action.id === message.id
                ? "bg-blurple-500/15"
                : "",
              "mb-4 px-3 first:mt-auto",
            )}
          >
            <div className="flex justify-between gap-2">
              <div className="truncate">
                {message.replyTo && (
                  <div className="mb-1 flex items-center gap-2 text-sm text-white">
                    <div className="h-1 w-6 shrink-0 cursor-pointer rounded-ss-md border-t-2 border-l-2 border-gray-400 hover:border-white"></div>
                    <div className="font-medium text-gray-400">
                      @{message.replyTo.author.name}
                    </div>
                    <div className="truncate">{message.replyTo.content}</div>
                  </div>
                )}
                <div>
                  <span className="font-medium">{message.author.name}</span>
                  <time
                    dateTime={message.createdAt}
                    className="ml-2 text-sm text-gray-400"
                  >
                    {formatTimestamp(message.createdAt)}{" "}
                    {message.updatedAt && "(Edited)"}
                  </time>
                </div>
              </div>
              <Menu as="div" className="relative flex-none">
                <MenuButton className="relative block text-gray-400 hover:text-white">
                  <span className="sr-only">Open channel options</span>
                  <EllipsisHorizontalIcon className="size-5" />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 flex origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition transition-discrete data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <button
                      onClick={() => handleReplyToggle(message.id)}
                      className="block w-full px-3 py-2 text-left text-sm/6 text-white hover:bg-white/5 hover:outline-none"
                    >
                      Reply
                    </button>
                  </MenuItem>
                  {message.author.id === user.id && (
                    <MenuItem>
                      <button
                        onClick={() => handleUpdateToggle(message.id)}
                        className="block w-full px-3 py-2 text-left text-sm/6 text-white hover:bg-white/5 hover:outline-none"
                      >
                        Edit
                      </button>
                    </MenuItem>
                  )}
                  {(message.author.id === user.id ||
                    channel.owner?.id === user.id) && (
                    <MenuItem>
                      <button
                        onClick={() => handleDeleteModalOpen(message.id)}
                        className="block w-full px-3 py-2 text-left text-sm/6 text-white hover:bg-white/5 hover:outline-none"
                      >
                        Delete
                      </button>
                    </MenuItem>
                  )}
                </MenuItems>
              </Menu>
            </div>
            <div>
              <p className="whitespace-pre-line">{message.content}</p>
            </div>
          </li>
        ))}
      </ol>

      <form
        onSubmit={handlePost}
        className="grid grid-cols-[1fr_44px] items-center gap-x-2"
      >
        {(formData.replyToId || action.name === "UPDATE") && (
          <>
            <div className="flex justify-between rounded-t-md bg-[#28282d] px-3.5 py-2.5 text-sm">
              <div>
                {formData.replyToId ? (
                  <>
                    Replying to{" "}
                    <span className="font-medium">
                      {
                        messages.find(
                          (message) => message.id === formData.replyToId,
                        ).author.name
                      }
                    </span>
                  </>
                ) : (
                  "Editing message"
                )}
              </div>
              <button
                type="button"
                onClick={formData.replyToId ? handleReplyCancel : handleClose}
              >
                <span className="sr-only">Cancel Reply</span>
                <XCircleIcon className="size-5 text-[#acadb3]" />
              </button>
            </div>
            <div></div>
          </>
        )}
        <div className="flex-1">
          <label htmlFor="message" className="sr-only">
            {action.name === "UPDATE"
              ? "Edit Message"
              : `Message ${getChannelName(user, channel)}`}
          </label>
          <textarea
            id="message"
            name="content"
            rows={1}
            required
            placeholder={
              action.name === "UPDATE"
                ? "Edit Message"
                : `Message ${getChannelName(user, channel)}`
            }
            value={action.name === "UPDATE" ? action.content : formData.content}
            onChange={handleMessageChange}
            className="focus:outline-blurple-500 block h-14 w-full rounded-md bg-[#222327] px-3.5 py-4 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2"
          />
        </div>
        <button
          type="submit"
          disabled={postMutation.isPending || updateMutation.isPending}
          className={classNames(
            (action.name !== "UPDATE" && formData.content) || action.content
              ? "bg-blurple-500"
              : "",
            "hover:bg-blurple-600 disabled:bg-blurple-400 cursor-pointer rounded-full bg-[#222327] p-3",
          )}
        >
          <PaperAirplaneIcon className="size-5" />
          <span className="sr-only">Send Message</span>
        </button>
      </form>

      <DeletionModal
        entity="Message"
        type="message"
        isOpen={action.name === "DELETE"}
        onClose={handleClose}
        onDelete={handleDelete}
        error={deleteMutation.error}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};

export default Channel;
