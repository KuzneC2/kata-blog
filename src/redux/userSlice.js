import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
  },
  reducers: {
    signInUser(state, action) {
      state.user = { ...action.payload };
    },
    logOutUser(state) {
      state.user = {};
    },
    loginStart(state) {
      state.user = { ...JSON.parse(localStorage.getItem('user-info')) };
    },
  },
});

export const { signInUser, logOutUser, loginStart } = userSlice.actions;

export default userSlice.reducer;
