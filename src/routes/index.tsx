import MainLayout from "@/pages/index/layout/main-layout";
import { RouteObject } from "react-router-dom"

const IndexRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
  }
];

export default IndexRoutes;
