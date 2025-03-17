import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://chatapp-bf0r.onrender.com/",
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (credentials) => ({
        url: "signup",
        method: "POST",
        body: credentials,
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
    allUser: builder.query({
      query: () => ({
        url: "allUser",
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    }),
    conversation: builder.mutation({
      query: (users) => ({
        url: "/conversation",
        method: "POST",
        body: users,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
    }),
    messageUpdation: builder.mutation({
      query: (body) => ({
        url: "/message",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useAllUserQuery,
  useConversationMutation,
  useMessageUpdationMutation,
} = userApi;
export default userApi;
