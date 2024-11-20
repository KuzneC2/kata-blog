import { configureStore } from '@reduxjs/toolkit';
import { articlesApi } from './defaulApi';
import userReduser  from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReduser,  
    [articlesApi.reducerPath]: articlesApi.reducer,
  },
  middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(articlesApi.middleware),
});
