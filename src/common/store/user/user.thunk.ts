import {createAsyncThunk} from "@reduxjs/toolkit";
import {User, UserRole} from "@/@types/user.type.ts";
import {RootState} from "@store/store.ts";
import AdminService from "@/services/admin.service.ts";
import {setQueryUser} from "@store/user/user.slice.ts";

const userThunk={
	getPage:createAsyncThunk("user/getPage",async (data: Query|undefined,thunkAPI)=>{
		const state = (thunkAPI.getState() as RootState);
		const query = state.user.query;
		if (!data)
		{
			data = query as unknown as Query;
		}
		else
		{
			thunkAPI.dispatch(setQueryUser(data as unknown as User))
		}
		return AdminService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	createUser:createAsyncThunk("user/createUser",async (data:Partial<User>,thunkAPI)=>{
		return  AdminService.createUser(data)
			.then(
				(res:User)=>{
					thunkAPI.dispatch(userThunk.getPage(undefined));
					return res;
				})
			.catch(thunkAPI.rejectWithValue)
		
	}),
	updateUser:createAsyncThunk("user/updateUser",async (data:Partial<User>,thunkAPI)=>{
		return AdminService.updateUser(data)
			.then((res:User)=>{
				thunkAPI.dispatch(userThunk.getPage(undefined));
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	updateStatus:createAsyncThunk("user/updateStatus",async (data:Partial<User>,thunkAPI)=>{
		return AdminService.updateStatus(data)
			.then((res:User)=>{
				thunkAPI.dispatch(userThunk.getPage(undefined));
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	updatePassword:createAsyncThunk("user/updatePassword",async (data:Partial<User>,thunkAPI)=>{
		return AdminService.updatePassword(data)
			.then((res:User)=>{
				thunkAPI.dispatch(userThunk.getPage(undefined));
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	getUserByRole:createAsyncThunk("user/getUserByRole",async (roles:UserRole[],thunkAPI)=>{
		return AdminService.getUserByRole(roles)
			.catch(thunkAPI.rejectWithValue)
	})
}
export default userThunk