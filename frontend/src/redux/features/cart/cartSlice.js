import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cart.utils.js";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existItem = state.cartItems.find((x) => x.data._id === item.data._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.data._id === existItem.data._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.data._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;