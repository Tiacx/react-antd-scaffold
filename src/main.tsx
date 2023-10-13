import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import AuthRoutes from "./routes/auth"
import AdminRoutes from "./routes/admin"
import IndexRoutes from "./routes/index"

const router = createBrowserRouter([
  ...AuthRoutes,
  ...AdminRoutes,
  ...IndexRoutes
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
