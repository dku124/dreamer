import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Mode} from "@/@types/config/config.type.ts";
import {ConfigCamp} from "@/@types/config/configCamp.type.ts";
import {ConfigUnit} from "@/@types/config/configUnit.type.ts";
import SettingThunk from "@store/setting/setting.thunk.ts";
import {AlertUtil} from "@utils/alert.util.ts";


interface SettingState
{
	config: {
		mode: Mode;
		percent: number;
	} | undefined;
	configCamp: {
		data:Page<ConfigCamp>|undefined
		select:ConfigCamp|undefined
		query:Query|undefined
		loading:boolean
	},
	configUnit: {
		data:Page<ConfigUnit>|undefined
		select:ConfigUnit|undefined
		query:Query|undefined
		list:ConfigUnit[]|undefined,
		loading:boolean
	}
}

const defaultInitialState:SettingState = {
	config: undefined,
	configCamp:{
		data:undefined,
		select:undefined,
		query:undefined,
		loading:false
	},
	configUnit:{
		data:undefined,
		select:undefined,
		query:undefined,
		list:undefined,
		loading:false
	}
};

const settingSlice = createSlice({
	name: 'setting',
	initialState: defaultInitialState,
	reducers: {
		setConfigCampQuery: (state:SettingState, action: PayloadAction<Query>) => {
			state.configCamp.query = action.payload;
		},
		setConfigUnitQuery: (state:SettingState, action: PayloadAction<Query>) => {
			state.configUnit.query = action.payload;
		},
		setConfigCampSelect: (state:SettingState, action: PayloadAction<ConfigCamp>) => {
			state.configCamp.select = action.payload;
		},
		setConfigUnitSelect: (state:SettingState, action: PayloadAction<ConfigUnit>) => {
			state.configUnit.select = action.payload;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(SettingThunk.config.get.fulfilled, (state, action) => {
				state.config = action.payload;
			})
			.addCase(SettingThunk.config.update.fulfilled, (state, action) => {
				state.config = action.payload;
				AlertUtil.Success("Cập nhật thành công")
			})
			.addCase(SettingThunk.configCamp.getPage.pending, (state, action) => {
				state.configCamp.loading = true;
			})
			.addCase(SettingThunk.configCamp.getPage.fulfilled, (state, action) => {
				state.configCamp.data = action.payload;
				state.configCamp.loading = false;
			})
			.addCase(SettingThunk.configCamp.getPage.rejected, (state, action) => {
				state.configCamp.loading = false;
			})
			.addCase(SettingThunk.configCamp.create.fulfilled, (state, action) => {
				state.configCamp.select = action.payload;
			})
			.addCase(SettingThunk.configCamp.update.fulfilled, (state, action) => {
				state.configCamp.select = action.payload;
			})
			.addCase(SettingThunk.configCamp.delete.fulfilled, (state, action) => {
				state.configCamp.select = action.payload;
			})
			.addCase(SettingThunk.configUnit.getPage.pending, (state, action) => {
				state.configUnit.loading = true;
			})
			.addCase(SettingThunk.configUnit.getPage.fulfilled, (state, action) => {
				state.configUnit.data = action.payload;
				state.configUnit.loading = false;
			})
			.addCase(SettingThunk.configUnit.getPage.rejected, (state, action) => {
				state.configUnit.loading = false;
			})
			.addCase(SettingThunk.configUnit.create.fulfilled, (state, action) => {
				state.configUnit.select = action.payload;
			})
			.addCase(SettingThunk.configUnit.update.fulfilled, (state, action) => {
				state.configUnit.select = action.payload;
			})
			.addCase(SettingThunk.configUnit.delete.fulfilled, (state, action) => {
				state.configUnit.select = action.payload;
			})
			.addCase(SettingThunk.configUnit.getList.fulfilled, (state, action) => {
				state.configUnit.list = action.payload;
			})
	},
});

export const { setConfigCampQuery,setConfigUnitQuery,setConfigCampSelect,setConfigUnitSelect } = settingSlice.actions;
export const settingSelector = (state: RootState) => state.setting;
export default settingSlice.reducer;
