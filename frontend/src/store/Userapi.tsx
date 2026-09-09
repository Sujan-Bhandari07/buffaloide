import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'



export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL ,credentials:'include'}),
  
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "api/v1/auth/login",
        method: "POST",
        body: data,
      }),


    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "api/v1/auth/logout",
        method: "POST",
      }),
    }),

    getprofile: builder.query({
      query: () => ({
        url: "api/v1/user/getprofile",
        method: "GET",

      }),


    }),




    //
  }),
})

export const { useLoginMutation,useLogoutMutation,useGetprofileQuery} = userApi

export default userApi
