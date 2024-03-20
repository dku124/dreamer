import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {UserRole} from "@/@types/user.type.ts";
import {Noti} from "@/@types/noti/noti.type.ts";
import NotiThunk from "@store/noti/noti.thunk.ts";


interface NotiState {
	data:Record<string,Array<Noti>>;
	numUnread:Record<string, number>;
	totalUnread:number;
	select?:Noti;
	list?:Noti[];
	loadings:{
		getById:boolean;
	}
}

const defaultInitialState:NotiState = {
	data: {
		
	},
	numUnread: {
		
	},
	totalUnread: 0,
	select:undefined,
	list:[],
	loadings:{
		getById:false,
	}
};

const notiSlice = createSlice({
	name: 'config',
	initialState: defaultInitialState,
	reducers: {
		setNumUnread: (state, action: PayloadAction<Record<UserRole, number>>) => {
			Object.keys(action.payload).forEach((e:string) => {
				const key = e as UserRole;
				state.numUnread[key] = action.payload[key];
			});
			state.totalUnread = Object.values(state.numUnread).reduce((a,b) => a+b,0);
		},
		setInitData: (state, action: PayloadAction<Record<UserRole,Noti[]>>) => {
			state.data = action.payload;
		},
		readRole: (state, action: PayloadAction<UserRole>) => {
			state.numUnread[action.payload] = 0;
			state.totalUnread = Object.values(state.numUnread).reduce((a,b) => a+b,0);
		},
		loadMore: (state, action: PayloadAction<Record<UserRole,Noti[]>>) => {
			Object.keys(action.payload).forEach((e:string) => {
				const key = e as UserRole;
				state.data[key] = [...state.data[key],...action.payload[key]];
			});
		},
		pushNoti: (state, action: PayloadAction<Noti>) => {
			const {role} = action.payload;
			state.data[role].unshift(action.payload);
			state.numUnread[role] += 1;
			state.totalUnread += 1;
		},
		selectNoti: (state, action: PayloadAction<Noti>) => {
			state.select = action.payload;
		},
		clearNoti: (state) => {
			state.select = undefined;
		}
	},
	extraReducers:(builder) => {
		
		builder
			.addCase(NotiThunk.getById.pending, (state) => {
				state.list = [];
				state.loadings.getById = true;
			})
			.addCase(NotiThunk.getById.fulfilled, (state, action) => {
				state.list = action.payload;	
				state.loadings.getById = false;
			})
			.addCase(NotiThunk.getById.rejected, (state) => {
				state.loadings.getById = false;
				state.list = [];
			})
	}
});
 
export const { setInitData,loadMore,pushNoti,setNumUnread,readRole,selectNoti,clearNoti } = notiSlice.actions;
export const notiSelector = (state: RootState) => state.noti;
export default notiSlice.reducer;
