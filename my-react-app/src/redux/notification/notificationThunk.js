import { createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../../services/notificationService"

export const notifyWhenAvailable = createAsyncThunk(
  "notification/notifyWhenAvailable",
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      return await notificationService.notifyWhenAvailable(
        productId,
        token
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      return thunkAPI.rejectWithValue(message);
    }
  }
);