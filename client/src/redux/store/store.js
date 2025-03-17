// store.JWT_SECRET
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import userReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

export default store;
