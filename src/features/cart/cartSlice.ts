import { createSlice } from "@reduxjs/toolkit";

interface item {
  id: number;
  quantity: number;
}

const initialState: item[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Adds new item entry or increments item quantity based on the item's existence
    addItem: (state, action) => {
      const id: number = action.payload;
      const existingItem = state.find((item) => item.id === id);
      existingItem
        ? existingItem.quantity++
        : state.push({ id: id, quantity: 1 });
    },

    // Removes an item entry or decrements item quantity based on the item's quantity
    removeItem: (state, action): void | item[] => {
      const id: number = action.payload;
      const existingItem = state.find((item) => item.id === id);
      if (existingItem)
      {
        if(existingItem.quantity > 1) existingItem.quantity--
        else return (state.filter((item) => {item.id !== existingItem?.id}))
      }
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
