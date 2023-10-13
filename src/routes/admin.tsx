import { RouteObject } from "react-router-dom"
import MainLayout from "@/pages/admin/layout/main-layout"
import QuestionList from "@/pages/admin/question/list"
import CategoryList from "@/pages/admin/category/list"
import TagList from "@/pages/admin/tag/list"
import RoleList from "@/pages/admin/role/list"

const AdminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <MainLayout />,
    children: [
      {
        path: '/admin/question',
        element: <QuestionList />
      },
      {
        path: '/admin/category',
        element: <CategoryList />
      },
      {
        path: '/admin/tag',
        element: <TagList />
      },
      {
        path: '/admin/role',
        element: <RoleList />
      }
    ]
  }
];

export default AdminRoutes;
