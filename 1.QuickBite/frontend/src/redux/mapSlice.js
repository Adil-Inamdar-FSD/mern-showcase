import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "user",
  initialState: {
  location: {
    lat: 18.5204,
    lon: 73.8567,
  },
  address: null,
},
  reducers: {
    setLocation: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress, setLocation } = mapSlice.actions;
export default mapSlice.reducer;
