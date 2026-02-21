import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "./contexts/AuthContext";
import routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const router = createBrowserRouter(routes(!!token));

  return (
    <AuthContext value={{ isAuth: !!token, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthContext>
  );
};

export default App;
