import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@store/store.ts";
import {setCampQuery} from "@store/camp/camp.slice.ts";
import CampService from "@/services/camp/camp.service.ts";
import {Camp} from "@/@types/camp/camp.type.ts";
import { Ad } from '@/@types/camp/ad.type.ts';

const CampThunk = {
	getPage:createAsyncThunk("camp/getPage",async (data:Query|undefined,thunkAPI)=>{
		const state = (thunkAPI.getState() as RootState);
		const query = state.camp.query;
		if (!data)
		{
			data = query as unknown as Query;
		}
		else
		{
			thunkAPI.dispatch(setCampQuery(data as unknown as Query))
		}
		return CampService.getPage(data).catch(thunkAPI.rejectWithValue)
	}),
	updateCamp:createAsyncThunk("camp/updateCamp",async (camp:Partial<Camp>,thunkAPI)=>{
		return CampService.updateCamp(camp)
			.then((res)=>{
				thunkAPI.dispatch(CampThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	updateAd:createAsyncThunk("camp/updateAd",async ({ad,query}:any,thunkAPI)=>{
		return CampService.updateAd(ad,query)
			.then((res)=>{
				thunkAPI.dispatch(CampThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
	CreateCamp : createAsyncThunk("camp/createCamp",async (camp:Partial<Camp>,thunkAPI)=>{
		return CampService.createCamp(camp)
			.then((res)=>{
				thunkAPI.dispatch(CampThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),

	CreateAd : createAsyncThunk("camp/createAd",async (ad:Partial<Ad>,thunkAPI)=>{
		return CampService.createAd(ad)
			.then((res)=>{
				thunkAPI.dispatch(CampThunk.getPage(undefined))
				return res;
			})
			.catch(thunkAPI.rejectWithValue)
	}),
}

export default CampThunk;