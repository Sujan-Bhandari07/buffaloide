import { createSlice,type PayloadAction } from '@reduxjs/toolkit';


interface UserState {
  name:string,
  email:string,
  avatar:string,
  isauth:boolean
}

const initialState: UserState = {
  name:"",
  email:"",
  avatar:"",
  isauth:false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const{name,email,avatar,isauth}=action.payload
      state.avatar=avatar
      state.email=email
      state.name=name
      state.isauth=isauth
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
