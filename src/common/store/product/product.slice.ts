import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Product} from "@/@types/repo/product.type.ts";
import ProductThunk from "@store/product/product.thunk.ts";

interface ProductState {
	query:Query|undefined,
	data:Page<Product>|undefined
	list:Product[]
	select:Product|undefined,
	lists:Product[],
	loadings:{
		getPage:boolean,
		getList:boolean,
		create:boolean,
		update:boolean,
		delete:boolean,
	}
}

const defaultInitialState:ProductState = {
	query:undefined,
	data:undefined,
	list:[],
	select:undefined,
	lists:[],
	loadings:{
		getPage:false,
		getList:false,
		create:false,
		update:false,
		delete:false,
	}
};

const productSlice = createSlice({
	name: 'product',
	initialState: defaultInitialState,
	reducers: {
		setProductQuery: (state, action: PayloadAction<Query>) => {
			state.query = action.payload;
		},
		setSelectProduct:(state, action: PayloadAction<Product>)=>
		{
			state.select = action.payload
		}
	},
	extraReducers(builder)
	{
		builder
			.addCase(ProductThunk.getPage.pending, (state, action) => {
				
				state.loadings.getPage = true;
			})
			.addCase(ProductThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(ProductThunk.getPage.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(ProductThunk.create.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(ProductThunk.update.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(ProductThunk.delete.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(ProductThunk.list.fulfilled, (state, action) => {
				state.list = action.payload;
			})
			.addCase(ProductThunk.getList.fulfilled, (state, action) => {
				state.lists = action.payload;
			})
	},
});

export const { setProductQuery,setSelectProduct } = productSlice.actions;
export const productSelector = (state: RootState) => state.product;
export default productSlice.reducer;
