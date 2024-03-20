import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import CategoryThunk from "@store/category/category.thunk.ts";
import {Category} from "@/@types/repo/category.type.ts";

interface CategoryState {
	query:Query|undefined,
	data:Page<Category>|undefined
	list:Category[]
	select:Category|undefined,
	loadings: {
		getPage: boolean;
		getDetail: boolean;
		create: boolean;
		update: boolean;
		delete: boolean;
	}
}

const defaultInitialState:CategoryState = {
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

const categorySlice = createSlice({
	name: 'category',
	initialState: defaultInitialState,
	reducers: {
		setSelectCategory: (state:CategoryState, action: PayloadAction<Category>) => {
			state.select = action.payload;
		},
		setQueryCategory:(state:CategoryState, action: PayloadAction<Query>)=>
		{
			state.query = action.payload
		}
	},
	extraReducers(builder)
	{
		builder
			.addCase(CategoryThunk.getPage.pending, (state, action) => {
				state.loadings.getPage = true;
			})
			.addCase(CategoryThunk.getPage.fulfilled, (state, action) => {
				state.data = action.payload;
				state.loadings.getPage = false;
			})
			.addCase(CategoryThunk.getPage.rejected, (state, action) => {
				state.loadings.getPage = false;
			})
			.addCase(CategoryThunk.list.fulfilled, (state, action) => {
				state.list = action.payload;
			})
			.addCase(CategoryThunk.getDetail.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(CategoryThunk.create.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(CategoryThunk.update.fulfilled, (state, action) => {
				state.select = action.payload;
			})
			.addCase(CategoryThunk.delete.fulfilled, (state, action) => {
				state.select = action.payload;
			})
	},
});

export const { setSelectCategory,setQueryCategory } = categorySlice.actions;
export const categorySelector = (state: RootState) => state.category;
export default categorySlice.reducer;
