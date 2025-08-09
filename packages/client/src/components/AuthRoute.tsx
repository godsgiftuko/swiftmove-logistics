import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { JSX } from "react";

interface GuestRouteProps {
  children: JSX.Element;
}

export default function AuthRoute({ children }: GuestRouteProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
