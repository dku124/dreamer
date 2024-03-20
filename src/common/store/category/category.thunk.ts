import CategoryService from "@/services/repo/category.service.ts";
import {setQueryCategory} from "@store/category/category.slice.ts";
import {RootState} from "@store/store.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {Category} from "@/@types/repo/category.type.ts";

const CategoryThunk={
	getPage:createAsyncThunk("category/getPage",async (data: Query|undefined,thunkAPI)=>{
		const state = (thunkAPI.getState() as RootState);
		const query = state.category.query;
		if (!data)
		{
			data = query as unknown as Query;
		}
		else
		{
			thunkAPI.dispatch(setQueryCategory(data as unknown as Query))
		}
		return CategoryService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	getDetail:createAsyncThunk("category/getDetail",async (data:Partial<Category>,thunkAPI)=>{
		return CategoryService.getDetail(data)
			.then((res)=>{
				thunkAPI.dispatch(CategoryThunk.getPage(undefined))
				return res
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	update:createAsyncThunk("category/update",async (data:Partial<Category>,thunkAPI)=>{
		return CategoryService.update(data)
			.then((res)=>{
				thunkAPI.dispatch(CategoryThunk.getPage(undefined))
				return res
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	delete:createAsyncThunk("category/delete",async (data:Partial<Category>,thunkAPI)=>{
		return CategoryService.delete(data)
			.then((res)=>{
				thunkAPI.dispatch(CategoryThunk.getPage(undefined))
				return res
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	create:createAsyncThunk("category/create",async (data:Partial<Category>,thunkAPI)=>{
		return CategoryService.create(data)
			.then((res)=>{
				thunkAPI.dispatch(CategoryThunk.getPage(undefined))
				return res
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	list:createAsyncThunk("category/list",async (_,thunkAPI)=>{
		return CategoryService.list().catch(thunkAPI.rejectWithValue)
	}),
	
}
export default CategoryThunk