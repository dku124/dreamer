import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {SKU} from "@/@types/repo/sku.type.ts";
import SkuThunk from "@store/sku/sku.thunk.ts";

interface SkuState {
	query:Query|undefined,
	data:Page<SKU>|undefined
	list:SKU[]
	listByCategory:Record<string, {
		data:SKU[]
		loading:boolean
	}>
	listByProduct:Record<string, {
		data:SKU[]
		loading:boolean
	}>
	select:SKU|undefined,
	loadings:{
		getPage:boolean,
		
	}
}


const defaultInitialState:SkuState = {
	query:undefined,
	data:undefined,
	list:[],
	select:undefined,
	listByCategory:{},
	listByProduct:{},
	loadings:{
		getPage:false,
	}
};

const skuSlice = createSlice({
	name: 'product',
	initialState: defaultInitialState,
	reducers: {
		setSkuQuery: (state, action: PayloadAction<Query>) => {
			state.query = action.payload;
		},
		setSelectSku:(state, action: PayloadAction<SKU>)=>
		{
			state.select = action.payload
		},
		setLoading:(state, action: PayloadAction<{
			category:string,
			loading:boolean
		}>)=>
		{
			if (!state.listByCategory[action.payload.category])
			{
				state.listByCategory[action.payload.category] = {
					data:[],
					loading:false
				};
			}
			state.listByCategory[action.payload.category].loading = action.payload.loading
		},
		setLoadingByProduct:(state, action: PayloadAction<{
			product:string,
			loading:boolean
		}>)=>
		{
			if (!state.listByProduct[action.payload.product])
			{
				state.listByProduct[action.payload.product] = {
					data:[],
					loading:false
				};
			}
			state.listByProduct[action.payload.product].loading = action.payload.loading
		}
	},
	extraReducers(builder)
	{
		builder
			.addCase(SkuThunk.getPage.pending, (state, action) => {
				state.loadings.getPage = true;
			})
			.addCase(SkuThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(SkuThunk.getPage.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(SkuThunk.create.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(SkuThunk.update.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(SkuThunk.delete.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(SkuThunk.list.pending, (state, action) => {
				state.loadings.getPage = true;
				
			})
			.addCase(SkuThunk.list.fulfilled, (state, action) => {
				state.list = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(SkuThunk.list.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(SkuThunk.listByCategory.fulfilled, (state, action) => {
				state.listByCategory[action.payload.category] = {
					data:action.payload.data,
					loading:false
				};
			})
			.addCase(SkuThunk.listByProduct.fulfilled, (state, action) => {
				state.listByProduct[action.payload.product] = {
					data:action.payload.data,
					loading:false
				};
			})
	},
});

export const { setSkuQuery,setSelectSku,setLoading,setLoadingByProduct } = skuSlice.actions;
export const skuSelector = (state: RootState) => state.sku;
export default skuSlice.reducer;
