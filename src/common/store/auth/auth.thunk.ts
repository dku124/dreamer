import {User} from "@/@types/user.type";
import UserService from "@/services/user.service";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const AuthThunk = {
	login:createAsyncThunk("user/login", async (data: Pick<User,'username'|'password'>,thunkAPI) => {
		return UserService.login(data).catch(thunkAPI.rejectWithValue);
	}),
	me:createAsyncThunk("user/me", async (_,thunkAPI) => {
		return UserService.me().catch(thunkAPI.rejectWithValue);
	})
}