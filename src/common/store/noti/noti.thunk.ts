import {createAsyncThunk} from "@reduxjs/toolkit";
import NotiService from "@/services/noti.service.ts";

const NotiThunk = {
	getById:createAsyncThunk("noti/getById", async (id:string,thunkAPI) => {
		return NotiService.getById(id).catch(thunkAPI.rejectWithValue)
	})
}

export default NotiThunk;