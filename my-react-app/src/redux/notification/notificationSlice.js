import { createSlice } from "@reduxjs/toolkit";
import { notifyWhenAvailable } from "./notificationThunk";

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    resetNotification(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(notifyWhenAvailable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(notifyWhenAvailable.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(notifyWhenAvailable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetNotification } = notificationSlice.actions;

export default notificationSlice.reducer;