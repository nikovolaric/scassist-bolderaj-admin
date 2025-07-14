import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ICashRegister {
  date: string;
  user: string;
  userName: string;
}

const initialState: ICashRegister = {
  date: new Date().toLocaleDateString("sv-SE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }),
  user: "",
  userName: "",
};

const cashRegisterSlice = createSlice({
  name: "cashRegister",
  initialState,
  reducers: {
    changeDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    changeUser(state, action: PayloadAction<{ id: string; fullName: string }>) {
      const { id, fullName } = action.payload;
      if (state.user === id) {
        state.user = "";
        state.userName = "";
      } else {
        state.user = id;
        state.userName = fullName;
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
