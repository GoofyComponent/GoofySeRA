import { createBrowserRouter } from "react-router-dom";

import App from "../pages/App";
import { Login } from "../pages/Login";
import { RecentProjects } from "@/components/app/home/RecentProjects";
import { Test } from "../pages/Test";
import { Projects } from "@/pages/Projects";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <App />,

    children: [
      {
        index: true,
        element: <RecentProjects />,
      },
      {
        path: "tickets",
        element: <Test />,
      },
      {
        path: "projects",
        element: <Projects />,
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
    path: "*",
    element: <div>404</div>,
  },
]);
