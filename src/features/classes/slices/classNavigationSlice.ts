import { createSlice } from "@reduxjs/toolkit";

interface INavigation {
  selected: string;
  ageGroup: string;
}

const initialState: INavigation = {
  selected: "vodene",
  ageGroup: "adult",
};

const classNavigationSlice = createSlice({
  name: "classNavigation",
  initialState,
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setAgeGroup: (state, action) => {
      state.ageGroup = action.payload;
    },
    clear: () => initialState,
  },
});

export const { setSelected, setAgeGroup, clear } = classNavigationSlice.actions;

export default classNavigationSlice.reducer;

export const getClassNavigation = (state: { classNavigation: INavigation }) =>
  state.classNavigation;
