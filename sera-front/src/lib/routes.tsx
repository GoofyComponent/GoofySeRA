import { createBrowserRouter, Navigate } from "react-router-dom";

import Profile from "@/pages/Profile";
import { Tickets } from "@/pages/Tickets";
import { Projects } from "@/pages/Projects";
import { Home } from "@/pages/Home";
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
        element: <Home />,
      },
      {
        path: "tickets",
        element: <Tickets />,
        children: [
          {
            path: ":TicketId",
            element: <Tickets />,
          },
        ],
      },
      {
        path: "projects",
        element: <Projects />,
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
