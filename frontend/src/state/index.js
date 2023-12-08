import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  alternatives: []
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setAlternatives: (state,action)=>{
      state.alternatives=action.payload.alternatives;
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setAllergens: (state, action) => {

      if (state.user) {
        state.user.allergens = action.payload.allergens;
      } else {
        console.error("user allergens non-existent :(");
      }
    }
  },
});

export const { setMode, setLogin, setLogout, setAllergens, setAlternatives} =
  authSlice.actions;
export default authSlice.reducer;