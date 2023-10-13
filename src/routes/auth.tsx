import { RouteObject } from "react-router-dom";
import Login from "@/pages/auth/login";

const AuthRoutes: RouteObject[] = [
  {
    path: '/auth/login',
    element: <Login />,
  }
];

export default AuthRoutes;
