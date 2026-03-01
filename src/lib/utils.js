export const getChannelName = (user, channel) =>
  channel.type === "DM"
    ? channel.recipients.find((recipient) => recipient.id !== user.id).name
    : channel.name;
