import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      state.status = "success";
      state.error = null;
    },
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.users = [];
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setUsers, setError, logoutUser } = userSlice.actions;
export default userSlice.reducer;
