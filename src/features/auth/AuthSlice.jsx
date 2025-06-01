import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUser} from './AuthAPI';
import { updateUser } from '../user/UserAPI';
import { checkUser } from './AuthAPI';
const initialState = {
  loggedInUser: JSON.parse(localStorage.getItem('user')) || null,
  status: 'idle',
  error:null,
};

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (userData) => {
    const response = await createUser(userData);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const checkUserAsync = createAsyncThunk(
  'user/checkUser',
  async (loginInfo) => {
    const response = await checkUser(loginInfo);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  'user/updateUser',
  async (update) => {
    const response = await updateUser(update);
    //console.log("after response");
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const AuthSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.loggedInUser = null;
      localStorage.removeItem('user'); // ✅ Clear storage on logout
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUser = action.payload;
      })
      .addCase(checkUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(checkUserAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
  },
});

export const { logout } = AuthSlice.actions;
export const selectLoggedInUser = (state)=>state.auth.loggedInUser;
export const selectError = (state)=>state.auth.error;


export default AuthSlice.reducer;
