const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const request = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw data.errors || new Error(data.message);
  }

  return data;
};

export const generateToken = (credentials) =>
  request("/auth/token", { method: "POST", body: JSON.stringify(credentials) });

export const createUser = (userData) =>
  request("/users", { method: "POST", body: JSON.stringify(userData) });

export const getProfile = () => request("/users/@me");

export const listChannels = () => request("/channels");

export const getChannel = (channelId) => request(`/channels/${channelId}`);

export const listUsers = () => request("/users");

export const createDM = (channelData) =>
  request("/channels/dms", {
    method: "POST",
    body: JSON.stringify(channelData),
  });

export const createGroup = (channelData) =>
  request("/channels/groups", {
    method: "POST",
    body: JSON.stringify(channelData),
  });

export const updateChannel = ({ channelId, channelData }) =>
  request(`/channels/${channelId}`, {
    method: "PUT",
    body: JSON.stringify(channelData),
  });

export const deleteChannel = (channelId) =>
  request(`/channels/${channelId}`, { method: "DELETE" });

export const listChannelMessages = (channelId) =>
  request(`/channels/${channelId}/messages`);

export const postMessage = ({ channelId, messageData }) =>
  request(`/channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify(messageData),
  });

export const updateMessage = ({ channelId, messageId, messageData }) =>
  request(`/channels/${channelId}/messages/${messageId}`, {
    method: "PUT",
    body: JSON.stringify(messageData),
  });

export const deleteMessage = ({ channelId, messageId }) =>
  request(`/channels/${channelId}/messages/${messageId}`, { method: "DELETE" });
