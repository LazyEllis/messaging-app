import Auth from "./routes/Auth";

const routes = [
  {
    path: "/sign-in",
    element: <Auth key="sign-in" />,
  },
  {
    path: "/sign-up",
    element: <Auth isSignUp key="sign-up" />,
  },
];

export default routes;
