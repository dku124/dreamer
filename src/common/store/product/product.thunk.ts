import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@store/store.ts";
import {setProductQuery} from "@store/product/product.slice.ts";
import ProductService from "@/services/repo/product.service.ts";
import {OfEntity} from "@/@types/custom.type.ts";
import {Product} from "@/@types/repo/product.type.ts";

const ProductThunk = {
	getPage: createAsyncThunk("product/getPage", async (data:Query|undefined, thunkAPI) => {
		const state = (thunkAPI.getState() as RootState);
		const query = state.product.query;
		if (!data)
		{
			data = query as unknown as Query;
		}
		else
		{
			thunkAPI.dispatch(setProductQuery(data as unknown as Query))
		}
		return ProductService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	getDetail: createAsyncThunk("product/getDetail", async (data:OfEntity<Product>, thunkAPI) => {
		return ProductService.getDetail(data)
			.then((res) => {
				thunkAPI.dispatch(ProductThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	update: createAsyncThunk("product/update", async (data:OfEntity<Product>, thunkAPI) => {
		return ProductService.update(data)
			.then((res) => {
				thunkAPI.dispatch(ProductThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	delete: createAsyncThunk("product/delete", async (data:OfEntity<Product>, thunkAPI) => {
		return ProductService.delete(data)
			.then((res) => {
				thunkAPI.dispatch(ProductThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	create: createAsyncThunk("product/create", async (data:Partial<OfEntity<Product>>, thunkAPI) => {
		return ProductService.create(data)
			.then((res) => {
				thunkAPI.dispatch(ProductThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	list: createAsyncThunk("product/list", async (_, thunkAPI) => {
		return ProductService.list().catch(thunkAPI.rejectWithValue)
	}),
	uploadImage: createAsyncThunk("product/uploadImage", async ({data,product}:{
		data:FormData,
		product:Product
	}, thunkAPI) => {
		return ProductService.uploadImage(data,product._id)
			.then((res) => {
				thunkAPI.dispatch(ProductThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	getList: createAsyncThunk("product/getList", async (query:string, thunkAPI) => {
		return ProductService.getList(query).catch(thunkAPI.rejectWithValue)
	}),
}

export default ProductThunk