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

export const createDM = (channelData) =>
  request("/channels/dms", {
    method: "POST",
    body: JSON.stringify(channelData),
  });
