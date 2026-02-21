import { Navigate } from "react-router";
import Auth from "./routes/Auth";
import Layout from "./routes/Layout";

const routes = (isAuth) => [
  {
    path: "/",
    element: isAuth ? <Layout /> : <Navigate to="/sign-in" />,
    index: true,
  },
  {
    path: "/sign-in",
    element: isAuth ? <Navigate to="/" /> : <Auth key="sign-in" />,
  },
  {
    path: "/sign-up",
    element: isAuth ? <Navigate to="/" /> : <Auth isSignUp key="sign-up" />,
  },
];

export default routes;
