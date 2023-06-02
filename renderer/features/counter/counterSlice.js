import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state, action) => {
      state.value = 0;
    },
  },
});

export const { incrementByAmount, reset } = counterSlice.actions;

export default counterSlice.reducer;
