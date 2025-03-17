import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedUserName: null,
    selectedUserName: null,
    conversation: [],
    allUsers: [],
  },
  reducers: {
    setLoggedUserName: (state, action) => {
      state.loggedUserName = action.payload;
    },
    setSelectedUserName: (state, action) => {
      state.selectedUserName = action.payload;
    },
    setConversation: (state, action) => {
      state.conversation = action.payload;
    },
    reset: (state) => {
      state.loggedUserName = null;
      state.selectedUserName = null;
      state.conversation = [];
    },
    resetBack: (state) => {
      state.conversation = [];
      state.selectedUserName = null;
    },
    setAllusers: (state, actions) => {
      state.allUsers = actions.payload;
    },
    setMessage: (state, action) => {
      if (state.conversation?.messages) {
        state.conversation.messages.push(action.payload);
      }
    },
  },
});
export const {
  setMessage,
  setAllusers,
  resetBack,
  setLoggedUserName,
  setSelectedUserName,
  setConversation,
  reset,
} = userSlice.actions;
export default userSlice.reducer;
