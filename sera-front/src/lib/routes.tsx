import { createBrowserRouter, Navigate } from "react-router-dom";

import { Home } from "@/pages/Home";
import { Logout } from "@/pages/Logout";
import { Planification } from "@/pages/Planification";
import Profile from "@/pages/Profile";
import { Project } from "@/pages/Project";
import { Projects } from "@/pages/Projects";
import { Rooms } from "@/pages/Rooms";
import { Tickets } from "@/pages/Tickets";
import { Users } from "@/pages/Users";
import { VideoReview } from "@/pages/VideoReview";
import { Error404 } from "@/pages/Error404";

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
            children: [
              {
                path: "infos",
              },
              {
                path: "edit",
              },
              {
                path: "delete",
              },
              {
                path: "*",
                element: <Error404 />,
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
            children: [
              {
                path: "validate",
              },
              {
                path: "delete",
              },
              {
                path: "*",
                element: <Error404 />,
              },
            ],
          },
        ],
      },
      {
        path: "users",
        element: <Users />,
        children: [
          {
            path: ":UserId",
            element: <Users />,
            children: [
              {
                path: "edit",
                element: <Users />,
              },
              {
                path: "delete",
                element: <Users />,
              },
              {
                path: "*",
                element: <Error404 />,
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
        path: "projects/:ProjectId/editing",
        element: <VideoReview />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "*",
        element: <Error404 />,
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
    path: "/404",
    element: <Error404 />,
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <Error404 />,
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
