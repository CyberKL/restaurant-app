import { Outlet, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  return props.isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
}
