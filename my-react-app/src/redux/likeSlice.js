import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  addLike,
  getLikes,
  removeLike,
} from "../services/likeService";

export const fetchLikes = createAsyncThunk(
  "likes/fetch",
  async () => {
    return await getLikes();
  }
);

export const addProductLike = createAsyncThunk(
  "likes/add",
  async (productId) => {
    await addLike(productId);

    return productId;
  }
);

export const removeProductLike = createAsyncThunk(
  "likes/remove",
  async (productId) => {
    await removeLike(productId);

    return productId;
  }
);

const likeSlice = createSlice({
  name: "likes",

  initialState: {
    items: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data?.products || [];
      })

      .addCase(addProductLike.fulfilled, (state, action) => {

        state.items.push({
          _id: action.payload,
        });

      })

      .addCase(removeProductLike.fulfilled, (state, action) => {

        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );

      });
  },
});

export default likeSlice.reducer;