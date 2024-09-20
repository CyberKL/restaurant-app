import FoodItem from "@/types/foodItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PriceRange {
  min: number;
  max: number;
}

interface Options {
  isOptions: boolean;
  sort: string;
  cuisines: string[];
  price: PriceRange;
  rating: number;
}
interface foodMenu {
  currentPage: number;
  options: Options;
  activeCategory: string;
  filteredMenuItems: FoodItem[];
  sort: string;
  cuisines: string[];
  selectedCuisines: string[];
  price: PriceRange;
  priceRange: PriceRange;
  rating: number;
}

const initialState: foodMenu = {
  currentPage: 1,
  options: {
    isOptions: false,
    sort: "",
    cuisines: [],
    price: { min: 0, max: 0 },
    rating: 0,
  },
  activeCategory: "all",
  filteredMenuItems: [],
  sort: "",
  cuisines: [],
  selectedCuisines: [],
  price: { min: 0, max: 0 },
  priceRange: { min: 0, max: 0 },
  rating: 0,
};

const foodMenuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        currentPage: action.payload,
      };
    },

    setOptions: (state, action: PayloadAction<Options>) => {
      if (action.payload.cuisines.length === 0 && action.payload.price.min === 0 && action.payload.price.max === 0 && action.payload.rating === 0 && action.payload.sort === "") action.payload.isOptions = false;
      return {
        ...state,
        options: action.payload,
      };
    },

    setActiveCategory: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        activeCategory: action.payload,
      };
    },

    setFilteredMenuItems: (state, action: PayloadAction<FoodItem[]>) => {
      return {
        ...state,
        filteredMenuItems: action.payload,
      };
    },

    setSort: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        sort: action.payload,
      };
    },

    setCuisines: (state, action: PayloadAction<string[]>) => {
      return {
        ...state,
        cuisines: action.payload,
      };
    },

    setSelectedCuisines: (state, action: PayloadAction<string[]>) => {
      return {
        ...state,
        selectedCuisines: action.payload,
      };
    },

    setPrice: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        price: JSON.parse(action.payload),
      };
    },

    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      return {
        ...state,
        priceRange: action.payload,
      };
    },

    setRating: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        rating: action.payload,
      };
    },
    resetFilterSort: (state) => {
      return {
        ...state,
        sort: "",
        selectedCuisines: [],
        price: { min: 0, max: 0 },
        rating: 0,
        options: {
          isOptions: false,
          sort: "",
          cuisines: [],
          price: { min: 0, max: 0 },
          rating: 0,
        },
      };
    },
  },
});

export const {
  setCurrentPage,
  setActiveCategory,
  setOptions,
  setFilteredMenuItems,
  setCuisines,
  setPrice,
  setPriceRange,
  setRating,
  setSelectedCuisines,
  setSort,
  resetFilterSort,
} = foodMenuSlice.actions;
export default foodMenuSlice.reducer;
