import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/** import all auth */
import Username from "./auth/Username";
import Password from "./auth/Password";
import Register from "./auth/Register";
import Profile from "./auth/Profile";
import Recovery from "./auth/Recovery";
import Reset from "./auth/Reset";
import PageNotFound from "./auth/PageNotFound";
import View from "./auth/viewPage";

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

/** root routes */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/recovery",
    element: <Recovery></Recovery>,
  },
  {
    path: "/reset",
    element: <Reset></Reset>,
  },
  {
    path: "/view",
    element: <View></View>,
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

export default function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}
