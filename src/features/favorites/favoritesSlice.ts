import FoodItem from "@/types/foodItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FoodItem[] = localStorage.getItem("favorites")
  ? JSON.parse(localStorage.getItem("favorites") as string)
  : [];

const favoritesSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    handleFavorites: (state, action: PayloadAction<FoodItem>) => {
      const itemIndex = state.findIndex(item => item.id === action.payload.id);
      if (itemIndex !== -1) {
        // Item exists, so remove it
        state.splice(itemIndex, 1);
      } else {
        // Item doesn't exist, add it
        state.push(action.payload);
      }
      // Save the updated Array to localStorage
      localStorage.setItem("favorites", JSON.stringify(state));
    }
  }
});

export const { handleFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
