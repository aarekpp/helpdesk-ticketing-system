import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import loadingReducer from "./LoadingSlice";
import userReducer from "./UserSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    user: userReducer,
  },
});
