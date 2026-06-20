import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: null,
  },
  reducers: {
    setMyShopData: (state, actions) => {
      state.myShopData = actions.payload;
    },
  },
});

export const { setUserData, setCity, setMyShopData } = ownerSlice.actions;
export default ownerSlice.reducer;