import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const articlesApi = createApi({
  reducerPath: 'arcticlesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.user?.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['articles', 'articles', 'user'],
  endpoints: (build) => ({
    getArticles: build.query({
      query: (offset = '0') => `articles?limit=5&offset=${offset}`,
      providesTags: ['articles'],
    }),
    getArticle: build.query({
      query: (slug) => `articles/${slug}`,
      providesTags: ['article'],
    }),
    getProfileUser: build.query({
      query: () => 'user',
      providesTags: ['user'],
    }),
    registerProfile: build.mutation({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body: {
          user: {
            email: body.email,
            password: body.password,
            username: body.username,
          },
        },
      }),
      providesTags: ['user'],
    }),
    signInProfile: build.mutation({
      query: (body) => ({
        url: 'users/login',
        method: 'POST',
        body: {
          user: {
            email: body.email,
            password: body.password,
          },
        },
      }),
      providesTags: ['user'],
    }),
    profileEdit: build.mutation({
      query: (body) => ({
        url: 'user',
        method: 'PUT',
        body: {
          user: body,
        },
        providesTags: ['user'],
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useRegisterProfileMutation,
  useSignInProfileMutation,
  useGetProfileUserQuery,
  useProfileEditMutation,
} = articlesApi;
