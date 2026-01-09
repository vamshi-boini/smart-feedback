// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // not logged in
  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // role not allowed for this route
  if (allowedRoles && !allowedRoles.includes(role)) {
    // if user is logged in but wrong role, send to their main page
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "user") return <Navigate to="/user" replace />;
    return <Navigate to="/login" replace />;
  }

  // ok: render the nested route element
  return <Outlet />;
}
