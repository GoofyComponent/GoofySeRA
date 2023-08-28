import { createBrowserRouter, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home";
import { Logout } from "@/pages/Logout";
import { Planification } from "@/pages/Planification";
import Profile from "@/pages/Profile";
import { Project } from "@/pages/Project";
import { Projects } from "@/pages/Projects";
import { Rooms } from "@/pages/Rooms";
import { Tickets } from "@/pages/Tickets";

import App from "../pages/App";
import { Login } from "../pages/Login";
import { Test } from "../pages/Test";

const paths = [
  {
    path: "/dashboard",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "rooms",
        element: <Rooms />,
        children: [
          {
            path: ":roomId",
            element: <Tickets />,
            children: [
              {
                path: "infos",
                element: <Tickets />,
              },
              {
                path: "edit",
                element: <Tickets />,
              },
              {
                path: "delete",
                element: <Tickets />,
              },
            ],
          },
        ],
      },
      {
        path: "tickets",
        element: <Tickets />,
        children: [
          {
            path: ":TicketId",
            element: <Tickets />,
            children: [
              {
                path: "validate",
                element: <Tickets />,
              },
              {
                path: "delete",
                element: <Tickets />,
              },
            ],
          },
        ],
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:ProjectId",
        element: <Project />,
      },
      {
        path: "projects/:ProjectId/planification",
        element: <Planification />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
];

if (
  import.meta.env.NODE_ENV === "development" ||
  import.meta.env.VITE_ENV_MODE === "development"
) {
  paths.push({
    //Its only a page for development, to test some stuff
    path: "/test",
    element: <Test />,
  });
}

export const router = createBrowserRouter(paths);
