import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {User} from '@/@types/user.type';
import UserThunk from "@store/user/user.thunk.ts";

interface UserState {
	query:Query|undefined,
	data:Page<User>|undefined
	list:User[]
	select:User|undefined,
	getByRole:User[],
	loadings: {
		getPage: boolean,
		getDetail: boolean,
		create: boolean,
		update: boolean,
		delete: boolean,
		list: boolean,
	}
}


const defaultInitialState:UserState = {
	query:undefined,
	data:undefined,
	list:[],
	select:undefined,
	getByRole:[],
	loadings: {
		getPage: false,
		getDetail: false,
		create: false,
		update: false,
		delete: false,
		list: false,
	}
};

const userSlice = createSlice({
	name: 'user',
	initialState: defaultInitialState,
	reducers: {
		setSelectUser: (state:UserState, action: PayloadAction<User>) => {
			state.select = action.payload;
		},
		setQueryUser:(state:UserState, action: PayloadAction<Query>)=>
		{
			state.query = action.payload
		}
	},
	extraReducers(builder) 
	{
		builder
			.addCase(UserThunk.getPage.pending, (state, action) => {
				state.loadings.getPage = true;
			})
			.addCase(UserThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(UserThunk.getPage.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(UserThunk.createUser.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(UserThunk.updateUser.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(UserThunk.updateStatus.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(UserThunk.getUserByRole.pending, (state, action) => {
				state.loadings.list = true;
			})
			.addCase(UserThunk.getUserByRole.rejected, (state, action) => {
				state.loadings.list = false;
			})
			.addCase(UserThunk.getUserByRole.fulfilled, (state, action) => {
				state.list = action.payload;
				state.loadings.list = false;
			})
	},
});

export const { setSelectUser,setQueryUser } = userSlice.actions;
export const userSelector = (state: RootState) => state.user;
export default userSlice.reducer;
