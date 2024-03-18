import { apiSlice } from "../api/apiSlice.js";
import { CATEGORY_URL } from "../features/constants.js";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ id, updatedCategory }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
    }),

    fetchCategories: builder.query({
      query: () => `${CATEGORY_URL}/all-categories`,
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;