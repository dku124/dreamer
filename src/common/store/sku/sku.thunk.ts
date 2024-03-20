import SkuService from "@/services/repo/sku.service.ts";
import {setLoading, setLoadingByProduct, setSkuQuery} from "@store/sku/sku.slice.ts";
import {RootState} from "@store/store.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {OfEntity} from "@/@types/custom.type.ts";
import {SKU} from "@/@types/repo/sku.type.ts";
import {Product} from "@/@types/repo/product.type.ts";

const skuThunk = {
	getPage: createAsyncThunk("sku/getPage", async (data:Query|undefined, thunkAPI) => {
		const state = (thunkAPI.getState() as RootState);
		const query = state.supplier.query;
		if (!data)
		{
			data = query as unknown as Query;
		}
		else
		{
			thunkAPI.dispatch(setSkuQuery(data as unknown as Query))
		}
		return SkuService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	getDetail: createAsyncThunk("sku/getDetail", async (data:OfEntity<SKU>, thunkAPI) => {
		return SkuService.getDetail(data)
			.then((res) => {
				thunkAPI.dispatch(skuThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	update: createAsyncThunk("sku/update", async (data:OfEntity<SKU>, thunkAPI) => {
		return SkuService.update(data)
			.then((res) => {
				thunkAPI.dispatch(skuThunk.list({ _id :data.product} as unknown as Product))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	delete: createAsyncThunk("sku/delete", async (data:OfEntity<SKU>, thunkAPI) => {
		return SkuService.delete(data)
			.then((res) => {
				
				thunkAPI.dispatch(skuThunk.list({ _id :data.product._id} as unknown as Product))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	create: createAsyncThunk("sku/create", async (data:OfEntity<SKU>, thunkAPI) => {
		return SkuService.create(data)
			.then((res) => {
				thunkAPI.dispatch(skuThunk.list({ _id :data.product} as unknown as Product))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	list: createAsyncThunk("sku/list", async (product:Product, thunkAPI) => {
		return SkuService.getList(product).catch(thunkAPI.rejectWithValue)
	}),
	listByCategory: createAsyncThunk("sku/listByCategory", async (category:string, thunkAPI) => {
		thunkAPI.dispatch(setLoading({
			category,
			loading:true
		}))
		
		return SkuService.getListByCategory(category)
			.then((res) => {
				return {
					category,
					data:res
				}
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	listByProduct: createAsyncThunk("sku/listByProduct", async (product:string, thunkAPI) => {
		thunkAPI.dispatch(setLoadingByProduct({
			product,
			loading:true
		}))
		
		return SkuService.getListByProduct(product)
			.then((res: any) => {
				return {
					product,
					data:res
				}
			})
			.catch(thunkAPI.rejectWithValue)
	}),
}
export default skuThunk