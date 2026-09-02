import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: null,
    isFirstLogin: false,
    userId: null,
  },
  reducers: {
    setLoginState: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.role = action.payload.role;
      state.isFirstLogin = action.payload.isFirstLogin;
      state.userId = action.payload.userId;
    },
    setFirstLoginState: (state, action) => {
      state.isFirstLogin = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.isFirstLogin = false;
      state.userId = null;
    },
  },
});

export const { setLoginState, setFirstLoginState, logout } = authSlice.actions;
export default authSlice.reducer;
