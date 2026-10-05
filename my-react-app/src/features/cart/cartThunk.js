import { createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../services/cartService";

// ==========================
// Fetch Cart
// ==========================
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// ==========================
// Add To Cart
// ==========================
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, thunkAPI) => {
    try {
      await cartService.addToCart(cartData);

      // Refresh cart
      await thunkAPI.dispatch(fetchCart());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// ==========================
// Update Cart Quantity
// ==========================
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ id, quantity }, thunkAPI) => {
    try {
      await cartService.updateCart(id, quantity);

      // Refresh cart
      await thunkAPI.dispatch(fetchCart());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

// ==========================
// Delete Cart Item
// ==========================
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (id, thunkAPI) => {
    try {
      await cartService.deleteCartItem(id);

      // Refresh cart
      await thunkAPI.dispatch(fetchCart());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete item"
      );
    }
  }
);  