import { createBrowserRouter, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home";
import { Logout } from "@/pages/Logout";
import Profile from "@/pages/Profile";
import { Project } from "@/pages/Project";
import { Projects } from "@/pages/Projects";
import { Tickets } from "@/pages/Tickets";

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
        path: "project",
        children: [
          {
            path: ":ProjectId",
            index: true,
            element: <Project />,
          },
        ],
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
  {
    //Its only a page for development, to test some stuff
    path: "/test",
    element: <Test />,
  },
]);
