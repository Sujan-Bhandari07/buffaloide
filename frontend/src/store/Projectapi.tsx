import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface BackendProject {
  _id: string;
  name: string;
  description?: string;
  isstar: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  payload?: T;
}


export const projectApi = createApi({
  reducerPath: 'projectApi',
  tagTypes: ['Projects'],
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL ,credentials:'include'}),
  
  endpoints: (builder) => ({
    createproject: builder.mutation({
      query: (data) => ({
        url: "api/v1/project/createproject",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Projects'],


    }),

deleteproject: builder.mutation({
      query: (data) => ({
        url: "api/v1/project/deleteproject",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Projects'],


    }),


    gettree: builder.query({
      query: (data) => ({
        url: `api/v1/project/gettree/${data}`,
        method: "GET",

      }),


    }),


 getallproject: builder.query<ApiResponse<BackendProject[]>, void>({
      query: () => ({
        url: `api/v1/project/getallproject`,
        method: "GET",

      }),
      providesTags: ['Projects'],


    }),


    createfolder: builder.mutation({
      query: (data) => ({
        url: "api/v1/project/createfolder",
        method: "POST",
        body: data,
      }),


    }),


    createfile: builder.mutation({
      query: (data) => ({
        url: "api/v1/project/createfile",
        method: "POST",
        body: data,
      }),


    }),

    deletefolder: builder.mutation({
      query: (data) => ({
        url: "api/v1/project/deletefolder",
        method: "POST",
        body: data,
      }),


    }),

    togglestar: builder.mutation({
      query: (data) => ({
        url: "api/v1/project/togglestar",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Projects'],


    }),



    //
  }),
})

export const { useCreateprojectMutation,useDeleteprojectMutation,useCreatefileMutation,useCreatefolderMutation,useDeletefolderMutation,useGettreeQuery,useTogglestarMutation,useGetallprojectQuery} = projectApi

export default projectApi
