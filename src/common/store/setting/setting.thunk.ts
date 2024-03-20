import {createAsyncThunk} from "@reduxjs/toolkit";
import ConfigService from "@/services/config/config.service.ts";
import {Config} from "@/@types/config/config.type.ts";
import ConfigCampService from "@/services/config/configCamp.service.ts";
import {ConfigCamp} from "@/@types/config/configCamp.type.ts";
import {setConfigCampQuery} from "@store/setting/setting.slice.ts";
import {RootState} from "@store/store.ts";
import ConfigUnitService from "@/services/config/configUnit.service.ts";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";

const SettingThunk={
	config:{
		get:createAsyncThunk("setting/config/get",async (_,thunkAPI)=>{
			return ConfigService.get().catch(thunkAPI.rejectWithValue);
		}),
		update:createAsyncThunk("setting/config/update",async (data:Config,thunkAPI)=>{
			return ConfigService.update(data).catch(thunkAPI.rejectWithValue);
		}),
	},
	configCamp:{
		getPage:createAsyncThunk("setting/configCamp/getPage",async (query:Query|undefined,thunkAPI)=>{
			if(!query){
				const state = thunkAPI.getState() as RootState;
				query = state.setting.configCamp.query;
			}
			thunkAPI.dispatch(setConfigCampQuery(query as Query));
			return ConfigCampService.getPage(query as Query).catch(thunkAPI.rejectWithValue);
		}),
		create:createAsyncThunk("setting/configCamp/create",async (data:Partial<ConfigCamp>,thunkAPI)=>{
			return ConfigCampService.create(data)
				.then((res:ConfigCamp)=>{
					thunkAPI.dispatch(SettingThunk.configCamp.getPage(undefined));
					return res;
				})
				.catch(thunkAPI.rejectWithValue);
		}),
		update:createAsyncThunk("setting/configCamp/update",async (data:Partial<ConfigCamp>,thunkAPI)=>{
			return ConfigCampService
				.update(data)
				.then((res:ConfigCamp)=>{
					thunkAPI.dispatch(SettingThunk.configCamp.getPage(undefined));
					return res;
				})
				.catch(thunkAPI.rejectWithValue);
		}),
		delete:createAsyncThunk("setting/configCamp/delete",async (data:Partial<ConfigCamp>,thunkAPI)=>{
			return ConfigCampService.delete(data)
				.then((res:ConfigCamp)=>{
					thunkAPI.dispatch(SettingThunk.configCamp.getPage(undefined));
					return res;
				})
				.catch(thunkAPI.rejectWithValue);
		}),
	},
	configUnit:{
		getPage:createAsyncThunk("setting/configUnit/getPage",async (query:Query|undefined,thunkAPI)=>{
			if(!query){
				const state = thunkAPI.getState() as RootState;
				query = state.setting.configUnit.query;
			}
			thunkAPI.dispatch(setConfigCampQuery(query as Query));
			return ConfigUnitService.getPage(query as Query).catch(thunkAPI.rejectWithValue);
		}),
		create:createAsyncThunk("setting/configUnit/create",async (data:Partial<ConfigCamp>,thunkAPI)=>{
			return ConfigUnitService.create(data)
				.then((res:ConfigUnit)=>{
					thunkAPI.dispatch(SettingThunk.configUnit.getPage(undefined));
					return res;
				})
				.catch(thunkAPI.rejectWithValue);
		}),
		update:createAsyncThunk("setting/configUnit/update",async (data:Partial<ConfigCamp>,thunkAPI)=>{
			return ConfigUnitService
				.update(data)
				.then((res:ConfigUnit)=>{
					thunkAPI.dispatch(SettingThunk.configUnit.getPage(undefined));
					return res;
				})
				.catch(thunkAPI.rejectWithValue);
		}),
		delete:createAsyncThunk("setting/configUnit/delete",async (data:Partial<ConfigCamp>,thunkAPI)=>{
			return ConfigUnitService.delete(data)
				.then((res:ConfigUnit)=>{
					thunkAPI.dispatch(SettingThunk.configUnit.getPage(undefined));
					return res;
				})
				.catch(thunkAPI.rejectWithValue);
		}),
		getList:createAsyncThunk("setting/configUnit/getList",async (_,thunkAPI)=>{
			return ConfigUnitService.getList().catch(thunkAPI.rejectWithValue);
		}),
	}
}

export default SettingThunk;