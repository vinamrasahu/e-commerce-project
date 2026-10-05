import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import likeReducer from "../redux/likeSlice";
import orderReducer from "../features/cart/orderSlice";
import  notificationReducer from  "../features/notification/notificationSlice"
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    likes: likeReducer,
    order: orderReducer,  
    notification: notificationReducer, // ✅ Add this
  },
});