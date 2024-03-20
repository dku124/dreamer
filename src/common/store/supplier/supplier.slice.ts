import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Supplier} from "@/@types/repo/supplier.type.ts";
import SupplierThunk from "@store/supplier/supplier.thunk.ts";

interface SupplierState {
	query:Query|undefined,
	data:Page<Supplier>|undefined
	list:Supplier[]
	select:Supplier|undefined,
	loadings: {
		getPage: boolean;
		getDetail: boolean;
		create: boolean;
		update: boolean;
		delete: boolean;
	
	}
}


const defaultInitialState:SupplierState = {
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

const supplierSlice = createSlice({
	name: 'supplier',
	initialState: defaultInitialState,
	reducers: {
		setSelectSupplier: (state:SupplierState, action: PayloadAction<Supplier>) => {
			state.select = action.payload;
		},
		setQuerySupplier:(state:SupplierState, action: PayloadAction<Supplier>)=>
		{
			state.query = action.payload
		}
	},
	extraReducers(builder) 
	{
		builder
			.addCase(SupplierThunk.getPage.pending, (state, action) => {
				state.loadings.getPage = true;
			})
			.addCase(SupplierThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(SupplierThunk.getPage.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(SupplierThunk.list.fulfilled, (state, action) => {
				state.list = action.payload;
			})
			.addCase(SupplierThunk.getDetail.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(SupplierThunk.create.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(SupplierThunk.update.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(SupplierThunk.delete.fulfilled, (state, action) => {
				state.select = action.payload;
			})
	},
});

export const { setSelectSupplier,setQuerySupplier } = supplierSlice.actions;
export const supplierSelector = (state: RootState) => state.supplier;
export default supplierSlice.reducer;
