import { FoodItem } from "@/types/foodItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface item extends FoodItem {
  quantity: number;
}

const initialState: item[] = !!localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart") as string) : [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Adds new item entry or increments item quantity based on the item's existence
    addItem: (state, action: PayloadAction<FoodItem>) => {
      const id: number = action.payload.id;
      const existingItem = state.find((item) => item.id === id);
      existingItem
        ? existingItem.quantity++
        : state.push({ ...action.payload, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(state));
    },

    // Removes an item entry or decrements item quantity based on the item's quantity
    removeItem: (state, action): void | item[] => {
      const id: number = action.payload;
      const existingItem = state.find((item) => item.id === id);
      if (existingItem)
      {
        if(existingItem.quantity > 1) existingItem.quantity--
        else state = (state.filter((item) => (item !== existingItem)))
        localStorage.setItem("cart", JSON.stringify(state));
        return state
      }
    },

    clearCart: () => {
      localStorage.removeItem("cart");
      return [];
    }
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
