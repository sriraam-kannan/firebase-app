import { createBrowserRouter } from "react-router-dom";

/** Layouts */
import UnAuthorizedLayout from "./layouts/UnAuthorizedLayout";
import AuthorizedLayout from "./layouts/AuthorizedLayout";

/** UnAuthorized Pages */
import Login from "./pages/Login";

/** Authorized Pages */
import Dashboard from "./pages/Dashboard";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthorizedLayout />, //change to protected layout
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <UnAuthorizedLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
]);
