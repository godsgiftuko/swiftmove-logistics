import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { JSX } from "react";
import { UserRole } from "../../../shared/interfaces";

interface RequireRoleProps {
  allowedRoles: Array<UserRole>;
  children: JSX.Element;
}

export const RequireRole = ({ allowedRoles, children }: RequireRoleProps) => {
    const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but wrong role
    return <Navigate to="/" replace />;
  }

  return children;
};
