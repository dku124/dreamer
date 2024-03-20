import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@store/store.ts";
import SupplierService from "@/services/repo/supplier.service.ts";
import {Supplier} from "@/@types/repo/supplier.type.ts";
import {setQuerySupplier} from "@store/supplier/supplier.slice.ts";

const SupplierThunk = {
	getPage:createAsyncThunk("supplier/getPage",async (data:Query|undefined,thunkAPI)=>{
		const state = (thunkAPI.getState() as RootState);
		const query = state.supplier.query;
		if (!data)
		{
			data = query as unknown as Query;
		}
		else
		{
			thunkAPI.dispatch(setQuerySupplier(data as unknown as Supplier))
		}
		return SupplierService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	getDetail:createAsyncThunk("supplier/getDetail",async (data:Partial<Supplier>,thunkAPI)=>{
		return SupplierService.getDetail(data)
			.then((res)=>{
				thunkAPI.dispatch(SupplierThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	update:createAsyncThunk("supplier/update",async (data:Partial<Supplier>,thunkAPI)=>{
		return SupplierService.update(data)
			.then((res)=>{
				thunkAPI.dispatch(SupplierThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	delete:createAsyncThunk("supplier/delete",async (data:Partial<Supplier>,thunkAPI)=>{
		return SupplierService.delete(data)
			.then((res)=>{
				thunkAPI.dispatch(SupplierThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	create:createAsyncThunk("supplier/create",async (data:Partial<Supplier>,thunkAPI)=>{
		return SupplierService.create(data)
			.then((res)=>{	
				thunkAPI.dispatch(SupplierThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	list:createAsyncThunk("supplier/list",async (_,thunkAPI)=>{
		return SupplierService.list().catch(thunkAPI.rejectWithValue)
	}),
}
export default SupplierThunk