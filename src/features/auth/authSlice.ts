import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import FoodItem from "@/types/foodItem";


interface Auth {
  isAuthenticated: boolean;
  token: string | null;
  displayName: string | null,
  favorites: FoodItem[]
}

const initialState: Auth = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  token: localStorage.getItem("authToken") || null,
  displayName: localStorage.getItem("displayName") || null,
  favorites: localStorage.getItem("favorites")
  ? JSON.parse(localStorage.getItem("favorites") as string)
  : []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, displayName, favorites } = JSON.parse(action.payload);
      localStorage.setItem("authToken", token);
      localStorage.setItem("displayName", displayName)
      localStorage.setItem("favorites", favorites);
      return {
        ...state,
        isAuthenticated: true,
        token: token,
        displayName: displayName,
        favorites: favorites,
      };
    },

    logout: (state) => {
        localStorage.clear();
        return {
            ...state,
            isAuthenticated: false,
            token: null,
            displayName: null,
            favorites: [],
          };
    },

    handleFavorites: (state, action: PayloadAction<FoodItem>) => {
      const itemIndex = state.favorites.findIndex(item => item.id === action.payload.id);
      if (itemIndex !== -1) {
        // Item exists, so remove it
        state.favorites.splice(itemIndex, 1);
      } else {
        // Item doesn't exist, add it
        state.favorites.push(action.payload);
      }
      // Save the updated Array to localStorage
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    }
  },
});

export const { login, logout, handleFavorites } = authSlice.actions;
export default authSlice.reducer;
