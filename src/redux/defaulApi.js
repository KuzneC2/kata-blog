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
  tagTypes: ['Articles', 'Article', 'User'],
  endpoints: (build) => ({
    getArticles: build.query({
      query: (offset = '0') => `articles?limit=5&offset=${offset}`,
      providesTags: ['Articles'],
    }),
    getArticle: build.query({
      query: (slug) => `articles/${slug}`,
      providesTags: ['Article', 'Articles'],
     
    }),
    getProfileUser: build.query({
      query: () => 'user',
      providesTags: ['User'],
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
      providesTags: ['User'],
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
      providesTags: ['User', 'Article', 'Articles'],
    }),
    profileEdit: build.mutation({
      query: (body) => ({
        url: 'user',
        method: 'PUT',
        body: {
          user: body,
        },
        providesTags: ['User'],
      }),
    }),
    articleAdd: build.mutation({
      query: (body) => ({
        url: 'articles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Articles'],
    }),
    articleDelete: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles']
    }),
    articleEdit: build.mutation({
      query: (body) => ({
        url: `articles/${body.slug}`,
        method: 'PUT',
        body: body.body,
      }),
      invalidatesTags: ['Articles', 'Article'],
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
  useArticleAddMutation,
  useArticleDeleteMutation,
  useArticleEditMutation,
} = articlesApi;
