import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false

const drawerSlice = createSlice({
    name:"drawer",
    initialState,
    reducers: {
        interactWithDrawer: (state) => !state,
        openDrawer: () => true,
        closeDrawer: () => false
    }
})

export const { openDrawer, closeDrawer, interactWithDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;