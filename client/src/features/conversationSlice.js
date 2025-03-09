import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  loggedUser: null,
  selectedUser: null,
  messages: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setConversationId: (state, action) => {
      state.id = action.payload;
    },
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    resetConversation: () => initialState,
    resetCurrentConversation: (state) => {
      state.id = null;
      state.messages = [];
      state.selectedUser = null;
    },
  },
});

export const { setMessages, addMessage, setConversationId, setLoggedUser, setSelectedUser, resetConversation, resetCurrentConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
