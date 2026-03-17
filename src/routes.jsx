import { Navigate } from "react-router";
import Auth from "./routes/Auth";
import Layout from "./routes/Layout";
import Channels from "./routes/Channels";
import Channel from "./routes/Channel";
import Profile from "./routes/Profile";
import Error from "./routes/Error";

const routes = (isAuth) => [
  {
    path: "/",
    errorElement: <Error />,
    element: isAuth ? <Layout /> : <Navigate to="/sign-in" />,
    children: [
      { index: true, element: <Channels /> },
      { path: "/channels/:id", element: <Channel /> },
      { path: "/profile", element: <Profile /> },
    ],
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
