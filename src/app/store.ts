import { configureStore } from "@reduxjs/toolkit";
import cashRegisterReducer from "../features/cashRegister/slice/cashRegisterSlice";
import checkAttendanceReducer from "../features/classes/slices/checkAttendanceSlice";

export const store = configureStore({
  reducer: {
    cashRegister: cashRegisterReducer,
    checkAttendance: checkAttendanceReducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
