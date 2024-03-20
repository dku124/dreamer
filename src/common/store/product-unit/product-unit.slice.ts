import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {ProductUnit} from "@/@types/repo/product-unit.type.ts";
import ProductUnitThunk from "@store/product-unit/product-unit.thunk.ts";

interface ProductUnitState {
	query:Query|undefined,
	data:Page<ProductUnit>|undefined
	list:ProductUnit[]
	select:ProductUnit|undefined,
	loadings: {
		getPage: boolean;
		getDetail: boolean;
		create: boolean;
		update: boolean;
		delete: boolean;
	}
}


const defaultInitialState:ProductUnitState = {
	query:undefined,
	data:undefined,
	list:[],
	select:undefined,
	loadings: {
		getPage: false,
		getDetail: false,
		create: false,
		update: false,
		delete: false,
	}
};

const productUnitSlice = createSlice({
	name: 'productUnit',
	initialState: defaultInitialState,
	reducers: {
		setSelectProductUnit: (state, action: PayloadAction<ProductUnit>) => {
			state.select = action.payload;
		},
		setQueryProductUnit:(state, action: PayloadAction<Query>)=>
		{
			state.query = action.payload
		}
	},
	extraReducers(builder)
	{
		builder
			.addCase(ProductUnitThunk.getPage.pending, (state, action) => {
				state.loadings.getPage = true;
				
			})
			.addCase(ProductUnitThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(ProductUnitThunk.getPage.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(ProductUnitThunk.create.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(ProductUnitThunk.update.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(ProductUnitThunk.delete.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(ProductUnitThunk.list.fulfilled, (state, action) => {
				state.list = action.payload;
			})
	},
});

export const { setSelectProductUnit,setQueryProductUnit } = productUnitSlice.actions;
export const productUnitSelector = (state: RootState) => state.productUnit;
export default productUnitSlice.reducer;
