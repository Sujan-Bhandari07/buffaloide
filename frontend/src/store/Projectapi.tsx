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

export interface ProjectTreeNode {
  _id: string;
  name: string;
  type: "folder" | "file";
  parentid?: string;
  children: ProjectTreeNode[];
}

export interface ProjectTreeResponse {
  success: boolean;
  project: {
    _id: string;
    name: string;
  };
  tree: ProjectTreeNode[];
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


     gettree: builder.query<ProjectTreeResponse, string>({
      query: (data) => ({
        url: `api/v1/project/gettree/${data}`,
        method: "GET",

      }),
      providesTags: ['Projects'],


    }),


 getallproject: builder.query<ApiResponse<BackendProject[]>, void>({
      query: () => ({
        url: `api/v1/project/getallproject`,
        method: "GET",

      }),
      providesTags: ['Projects'],


    }),


    createfolder: builder.mutation<void, { name: string; projectid: string; parentid?: string }>({
      query: (data) => ({
        url: "api/v1/project/createfolder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Projects'],


    }),


    createfile: builder.mutation<void, { name: string; projectid: string; parentid?: string }>({
      query: (data) => ({
        url: "api/v1/project/createfile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Projects'],


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
