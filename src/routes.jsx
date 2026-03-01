import { Navigate } from "react-router";
import Auth from "./routes/Auth";
import Layout from "./routes/Layout";
import Channels from "./routes/Channels";

const routes = (isAuth) => [
  {
    path: "/",
    element: isAuth ? <Layout /> : <Navigate to="/sign-in" />,
    children: [{ index: true, element: <Channels /> }],
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
