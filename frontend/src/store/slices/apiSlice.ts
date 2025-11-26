import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, HttpMethod } from "../../constants/index";

export const apiSlices = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
     validateStatus: (response) => {
      // ONLY treat 2xx as success
      return response.status >= 200 && response.status < 300;
    },
    
  }),
  tagTypes: ['Category', 'Product'],  // Added tag type for Category for cache management
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (postData) => ({
        url: "/categories",
        method: HttpMethod.POST,
        body: postData,
      }),
      invalidatesTags: ["Category"], // Invalidate Category tag on creation
      
    }),

    getCategories: builder.query({
      query: () => ({
        url: "/categories",
        method: HttpMethod.GET,
      }),
      providesTags: ["Category"], // Provide Category tag for caching

    }),

    editCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: HttpMethod.PUT,
        body: body,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: HttpMethod.DELETE,
      }),
      invalidatesTags: ["Category"],
    }),

    // ================================ Products Endpoints ================================= //

    createProduct: builder.mutation({
      query: (postData) => ({
        url: "/products",
        method: HttpMethod.POST,
        body: postData,
      }),
      invalidatesTags: ["Product"], 
      
    }),

    getProducts: builder.query({
      query: () => ({
        url: "/products",
        method: HttpMethod.GET,
      }),
      providesTags: ["Product"], 

    }),

    editProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: HttpMethod.PUT,
        body: body,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: HttpMethod.DELETE,
      }),
      invalidatesTags: ["Product"],
    }),

    
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useCreateProductMutation,
  useGetProductsQuery,
  useEditProductMutation,
  useDeleteProductMutation,
} = apiSlices;
