import { createSlice } from "@reduxjs/toolkit";

interface Auth {
  isAuthenticated: boolean;
  token: string | null;
  displayName: string | null,
}

const initialState: Auth = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  token: localStorage.getItem("authToken") || null,
  displayName: localStorage.getItem("displayName") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, displayName } = JSON.parse(action.payload);
      localStorage.setItem("authToken", token);
      localStorage.setItem("displayName", displayName)
      return {
        ...state,
        isAuthenticated: true,
        token: token,
        displayName: displayName,
      };
    },

    logout: (state) => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("displayName")
        return {
            ...state,
            isAuthenticated: false,
            token: null,
            displayName: null,
          };
    }
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
