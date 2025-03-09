import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import conversationReducer from "../features/conversationSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    conversation: conversationReducer,
  },
});
