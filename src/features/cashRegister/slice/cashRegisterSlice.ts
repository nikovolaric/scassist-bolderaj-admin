import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ICashRegister {
  date: string;
  user: string;
}

const initialState: ICashRegister = {
  date: new Date().toLocaleDateString("sv-SE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }),
  user: "",
};

const cashRegisterSlice = createSlice({
  name: "cashRegister",
  initialState,
  reducers: {
    changeDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    changeUser(state, action: PayloadAction<string>) {
      if (state.user === action.payload) {
        state.user = "";
      } else {
        state.user = action.payload;
      }
    },
    reset() {
      return initialState;
    },
  },
});

export const { changeDate, changeUser, reset } = cashRegisterSlice.actions;

export default cashRegisterSlice.reducer;

export const getCashRegister = (state: { cashRegister: ICashRegister }) =>
  state.cashRegister;
