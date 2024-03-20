import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@store/store.ts";
import {OfEntity} from "@/@types/custom.type.ts";
import {Customer} from "@/@types/repo/customer.type";
import CustomerService from "@/services/repo/customer.service";
import {setCustomerQuery} from "./customer.slice";

const CustomerThunk = {
	getPage: createAsyncThunk("customer/getPage", async (data: Query | undefined, thunkAPI) => {
		const state = (thunkAPI.getState() as RootState);
		const query = state.customer.query;
		if (!data) {
			data = query as unknown as Query;
		}
		else {
			thunkAPI.dispatch(setCustomerQuery(data as unknown as Query))
		}
		return CustomerService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	getDetail: createAsyncThunk("customer/getDetail", async (data: OfEntity<Customer>, thunkAPI) => {
		return CustomerService.getDetail(data)
			.then((res) => {
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	update: createAsyncThunk("customer/update", async (data: any, thunkAPI) => {
		return CustomerService.update(data)
			.then((res) => {
				thunkAPI.dispatch(CustomerThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	delete: createAsyncThunk("customer/delete", async (data: OfEntity<Customer>, thunkAPI) => {
		return CustomerService.delete(data)
			.then((res) => {
				thunkAPI.dispatch(CustomerThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	uploadImg: createAsyncThunk("customer/uploadImg", async (data: any, thunkAPI) => {
		return CustomerService.uploadImg(data.id, data.file)
			.then((res) => {
				thunkAPI.dispatch(CustomerThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	printBill: createAsyncThunk('customer/printBill', async (data: { id: string, format: string }, thunkAPI) => {
		return CustomerService.printBill(data).catch(thunkAPI.rejectWithValue);
	}),
	printOrder: createAsyncThunk('customer/printOrder', async (data: { id: string, format: string }, thunkAPI) => {
		return CustomerService.printBill(data).catch(thunkAPI.rejectWithValue);
	})

}

export default CustomerThunk;