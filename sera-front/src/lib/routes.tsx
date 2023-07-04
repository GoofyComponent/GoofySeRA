import { createBrowserRouter } from "react-router-dom";

import App from "../pages/App";
import { Login } from "../pages/Login";
import { Test } from "../pages/Test";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <App />,

    children: [
      {
        path: "tickets",
        element: <Test />,
      },
      {
        path: "projects",
        element: <Test />,
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
