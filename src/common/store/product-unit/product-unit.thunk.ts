import {setQueryProductUnit} from "@store/product-unit/product-unit.slice.ts";
import ProductUnitService from "@/services/repo/product-unit.service.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@store/store.ts";
import {ProductUnit} from "@/@types/repo/product-unit.type.ts";

const ProductUnitThunk = {
	getPage: createAsyncThunk("productUnit/getPage", async (data: Query | undefined, thunkAPI) => {
		const state = thunkAPI.getState() as RootState;
		const query = state.productUnit.query;
		if (!data) {
			data = query as unknown as Query;
		} else {
			thunkAPI.dispatch(setQueryProductUnit(data as unknown as Query));
		}
		return ProductUnitService.getPage(data).catch(thunkAPI.rejectWithValue);
	}),
	create: createAsyncThunk("productUnit/createProductUnit", async (data: Partial<ProductUnit>, thunkAPI) => {
		return ProductUnitService.create(data)
			.then((res) => {
				thunkAPI.dispatch(ProductUnitThunk.getPage(undefined));
				return res;
			})
			.catch(thunkAPI.rejectWithValue);
	}),
	update: createAsyncThunk("productUnit/updateProductUnit", async (data: Partial<ProductUnit>, thunkAPI) => {
		return ProductUnitService.update(data)
			.then((res) => {
				thunkAPI.dispatch(ProductUnitThunk.getPage(undefined));
				return res;
			})
			.catch(thunkAPI.rejectWithValue);
	}),
	delete: createAsyncThunk("productUnit/deleteProductUnit", async (data: Partial<ProductUnit>, thunkAPI) => {
		return ProductUnitService.delete(data)
			.then((res) => {
				thunkAPI.dispatch(ProductUnitThunk.getPage(undefined));
				return res;
			})
			.catch(thunkAPI.rejectWithValue);
	}),
	list: createAsyncThunk("productUnit/list", async (_, thunkAPI) => {
		return ProductUnitService.list().catch(thunkAPI.rejectWithValue);
	}),
	
}

export default ProductUnitThunk
