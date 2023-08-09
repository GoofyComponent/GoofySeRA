import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "@/pages/App";
import { Capture } from "@/pages/Capture";
import { Error404 } from "@/pages/Error404";
import { Home } from "@/pages/Home";
import { Knowledge } from "@/pages/Knowledge";
import { Login } from "@/pages/Login";
import { Logout } from "@/pages/Logout";
import { Planning } from "@/pages/Planning";
import Profile from "@/pages/Profile";
import { Project } from "@/pages/Project";
import { Projects } from "@/pages/Projects";
import { Rooms } from "@/pages/Rooms";
import { Subtitle } from "@/pages/Subtitle";
import { Test } from "@/pages/Test";
import { Tickets } from "@/pages/Tickets";
import { Transcription } from "@/pages/Transcription";
import { Users } from "@/pages/Users";
import { VideoReview } from "@/pages/VideoReview";

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
                element: <Navigate to="/404" replace />,
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
                element: <Navigate to="/404" replace />,
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
                path: "profile",
                element: <Users />,
              },
              {
                path: "*",
                element: <Navigate to="/404" replace />,
              },
            ],
          },
        ],
      },
      {
        path: "knowledge",
        element: <Knowledge />,
        children: [
          {
            path: ":dataId",
            element: <Knowledge />,
            /* children: [
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
                element: <Navigate to="/404" replace />,
              },
            ], */
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
        path: "edito/knowledge-base",
        element: <Knowledge />,
      },
      {
        path: "projects/:ProjectId/prepare",
        element: <Planning />,
      },
      {
        path: "projects/:ProjectId/capture",
        element: <Capture />,
      },
      {
        path: "projects/:ProjectId/transcript",
        element: <Transcription />,
      },
      {
        path: "projects/:ProjectId/subs",
        element: <Subtitle />,
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
        element: <Navigate to="/404" replace />,
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
