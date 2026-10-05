import { createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationService from "../../services/notificationService";

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (productId, thunkAPI) => {
    try {
      const response = await notificationService.createNotification(productId);

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to subscribe."
      );
    }
  }
);