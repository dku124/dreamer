import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {AuthThunk} from './auth.thunk';
import {User, UserRole} from '@/@types/user.type';

interface AuthState {
	token: string;
	user: User|undefined;
	roles: UserRole[];
}


const defaultInitialState:AuthState = {
    token: "",
	user: undefined,
	roles: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState: defaultInitialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		logout: (state) => {
			state.token = "";
			state.roles = [];
			localStorage.removeItem("token");
		}
    },
    extraReducers(builder) {
        builder.addCase(AuthThunk.login.fulfilled, (state, action) => {
			state.token = action.payload?.token || "";
			localStorage.setItem("token", state.token);
			state.roles = action.payload?.roles || [];
		});
		builder.addCase(AuthThunk.me.fulfilled, (state, action) => {
			state.user = action.payload;
			state.roles = action.payload?.roles || [];
		});
    },
});





export const { setToken,logout } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
