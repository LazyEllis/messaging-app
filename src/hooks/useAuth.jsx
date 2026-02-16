import { useSyncExternalStore } from "react";

const subscribe = (listener) => {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
};

const getSnapshot = () => localStorage.getItem("token");

const setToken = (newValue) => {
  newValue
    ? localStorage.setItem("token", newValue)
    : localStorage.removeItem("token");

  window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue }));
};

export const useAuth = () => {
  const token = useSyncExternalStore(subscribe, getSnapshot);

  const login = (token) => setToken(token);

  const logout = () => setToken(null);

  return { isAuth: !!token, login, logout };
};
