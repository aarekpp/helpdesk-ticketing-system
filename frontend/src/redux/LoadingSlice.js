import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: true,
    fontLoaded: false,
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setFontLoaded: (state) => {
      state.fontLoaded = true;
    },
  },
});

export const { startLoading, stopLoading, setFontLoaded } =
  loadingSlice.actions;
export default loadingSlice.reducer;
