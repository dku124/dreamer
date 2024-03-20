import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Camp} from "@/@types/camp/camp.type.ts";
import CampThunk from "@store/camp/camp.thunk.ts";
import {Ad} from "@/@types/camp/ad.type.ts";

interface CampState<T extends BaseEntity> {
	query:Query|undefined,
	data : Page<Camp>|undefined,
	select:Camp|undefined
	detail:T[]|undefined,
	adSelect:Ad|undefined,
	loading:boolean
	loadings:{
		page:boolean,
		detail:boolean
	}
}

const defaultInitialState:CampState<Camp> = {
	query:undefined,
	data:undefined,
	select:undefined,
	detail: undefined,
	adSelect:undefined,
	loading:false,
	loadings:{
		page:false,
		detail:false
	}
};

const campSlice = createSlice({
	name: 'camp',
	initialState: defaultInitialState,
	reducers: {
		setCampQuery: (state, action: PayloadAction<Query>) => {
			state.query = action.payload;
		},
		setCampSelect:(state, action: PayloadAction<Camp>)=>
		{
			state.select = action.payload
		},
		setAdSelect:(state, action: PayloadAction<Ad>)=>
		{
			state.adSelect = action.payload
		}
	},
	extraReducers(builder)
	{
		builder
			.addCase(CampThunk.getPage.pending, (state, action) => {
				state.loading = true;
				state.loadings.page = true;
			})
			.addCase(CampThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loading = false;
				state.loadings.page = false;
			})
			.addCase(CampThunk.getPage.rejected, (state, action) => {
				state.loading = false;
				state.loadings.page = false;
			})
			.addCase(CampThunk.CreateAd.rejected, (state, action) => {
				state.select = action.payload as Camp
			})
			.addCase(CampThunk.CreateCamp.rejected, (state, action) => {
				state.adSelect = action.payload as Ad
			})
	},
});
export const { setCampQuery,setCampSelect,setAdSelect } = campSlice.actions;
export const campSelector = (state: RootState) => state.camp;
export default campSlice.reducer;
