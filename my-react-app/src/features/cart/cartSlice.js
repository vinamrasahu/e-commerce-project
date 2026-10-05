import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  fetchCart,
  updateCart,
  deleteCart,
} from "./cartThunk";

const initialState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart(state, action) {
      state.items = action.payload;
      state.count = action.payload.length;
    },

    addItem(state, action) {
      state.items.push(action.payload);
      state.count = state.items.length;
    },

    removeItem(state, action) {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
      state.count = state.items.length;
    },

    updateItem(state, action) {
      const { id, quantity } = action.payload;

      const item = state.items.find((i) => i.id === id);

      if (item) {
        item.qty = quantity;
      }
    },

    clearCart(state) {
      state.items = [];
      state.count = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // Fetch Cart
      // ==========================
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.count = action.payload.length;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // Add To Cart
      // ==========================
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // Update Cart
      // ==========================
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateCart.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================
      // Delete Cart
      // ==========================
      .addCase(deleteCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCart.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCart,
  addItem,
  removeItem,
  updateItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;