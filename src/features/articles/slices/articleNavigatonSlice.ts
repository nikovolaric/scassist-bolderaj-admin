import { createSlice } from "@reduxjs/toolkit";

interface INavigation {
  label: string;
  ageGroup: string;
}

const initialState: INavigation = {
  label: "V",
  ageGroup: "adult",
};

const articleNavigationSlice = createSlice({
  name: "articleNavigation",
  initialState,
  reducers: {
    setLabel: (state, action) => {
      state.label = action.payload;
    },
    setAgeGroup: (state, action) => {
      state.ageGroup = action.payload;
    },
    clear: () => initialState,
  },
});

export const { setLabel, setAgeGroup, clear } = articleNavigationSlice.actions;

export default articleNavigationSlice.reducer;

export const getArticleNavigation = (state: {
  articleNavigation: INavigation;
}) => state.articleNavigation;
