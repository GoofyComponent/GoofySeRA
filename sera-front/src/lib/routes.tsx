import { createBrowserRouter, Navigate } from "react-router-dom";

import Profile from "@/pages/Profile";

import App from "../pages/App";
import { Login } from "../pages/Login";
import { Test } from "../pages/Test";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <App />,
    children: [
      {
        index: true,
        element: <p> FDP </p>,
      },
      {
        path: "tickets",
        element: <Test />,
      },
      {
        path: "projects",
        element: <Test />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
]);
