import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import GoogleLogin from "./Pages/Login";
import Calendar from "./Pages/Calender";
import Auth from "./Pages/Auth";

let routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Calendar /> },
      // { path: "*", element: <NotFound /> },
      {
        path: "login",
        element: <GoogleLogin />,
      },
      {
        path: "google",
        children: [{ path: "auth", element: <Auth /> }],
      },
    ],
  },
]);

export default routes;
