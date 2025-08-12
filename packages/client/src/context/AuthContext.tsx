import { createContext, useContext, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/authSlice";
import type { RootState, AppDispatch } from "../store/store";
import { EUserRole, IUser } from "../../../shared/interfaces";
import Websocket from "../services/ws";

interface AuthContextProps {
  user: RootState["auth"]["user"];
  isAuthenticated: boolean;
  role: EUserRole | null;
  token: string | null;
  loginUser: (user: IUser, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  const loginUser = (user: AuthContextProps["user"], token: string) => {
    dispatch(login({ user, token }));
    Websocket.connect(user!);
  };

  const logoutUser = () => {
    dispatch(logout());
    Websocket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
