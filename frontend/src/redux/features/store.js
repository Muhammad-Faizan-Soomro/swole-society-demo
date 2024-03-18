import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice.js";
import shopReducer from "./shop/shopSlice.js";
import cartSliceReducer from "./cart/cartSlice.js";
import authReducer from "../features/auth/authSlice.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
