/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/interfaces";

interface AuthState {
  user: null | IUser;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: AuthState["user"]; token: string }>) => {
      state.user = action.payload.user as any;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear(); 
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
