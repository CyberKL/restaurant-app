import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cartSlice"
import authReducer from "@/features/auth/authSlice"
import drawerReducer from "@/features/drawer/drawerSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    drawer: drawerReducer,
  },
  devTools: true
});


// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']