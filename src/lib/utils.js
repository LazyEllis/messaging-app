import { isToday, isYesterday, format } from "date-fns";

export const getChannelName = (user, channel) =>
  channel.type === "DM"
    ? channel.recipients.find((recipient) => recipient.id !== user.id).name
    : channel.name;

export const formatTimestamp = (timestamp) => {
  if (isToday(timestamp)) {
    return format(timestamp, "p");
  } else if (isYesterday(timestamp)) {
    return `Yesterday at ${format(timestamp, "p")}`;
  } else {
    return `${format(timestamp, "d/M/y p")}`;
  }
};

export const classNames = (...classes) => classes.filter(Boolean).join(" ");
