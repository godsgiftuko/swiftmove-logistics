/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EUserRole, IUser } from "../../../shared/interfaces";

interface AuthState {
  user: null | IUser;
  token: string | null;
  isAuthenticated: boolean;
  role: null | EUserRole;
  isAdmin: null | boolean;
  isDriver: null | boolean;
  isManager: null | boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
  isAdmin: null,
  isDriver: null,
  isManager: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: AuthState["user"]; token: string }>) => {
      state.user = action.payload.user as any;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.user!.role as EUserRole;
      state.isAdmin = action.payload.user!.role === EUserRole.admin;
      state.isDriver = action.payload.user!.role === EUserRole.driver;
      state.isManager = action.payload.user!.role === EUserRole.manager;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.isAdmin = null;
      state.isDriver = null;
      state.isManager = null;
      localStorage.clear(); 
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
