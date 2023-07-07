import { createBrowserRouter } from "react-router-dom";

import App from "../pages/App";
import { Login } from "../pages/Login";
import { RecentProjects } from "@/components/app/home/RecentProjects";
import { RecentTicketTable } from "@/components/app/home/RecentTicketTable";
import { Tickets } from "@/pages/Tickets";
import { Test } from "../pages/Test";
import { Projects } from "@/pages/Projects";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <App />,

    children: [
      {
        index: true,
        element: <RecentTicketTable />,
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
