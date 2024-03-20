import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {AlertUtil} from "@utils/alert.util.ts";
import {ConfigProvider, theme} from "antd";


interface ConfigState {
	darkMode: boolean;
	isCollapsed: boolean;
	select:string;
	breadcrumb: {
		key:string;
		label:string;
	}[];
}

const defaultInitialState:ConfigState = {
    darkMode: false,
    isCollapsed: false,
    select:"",
	breadcrumb: [],
};

const configSlice = createSlice({
    name: 'config',
    initialState: defaultInitialState,
    reducers: {
        setDarkMode: (state, action: PayloadAction<boolean>) => {
           ConfigProvider.config({
			   theme:{
				   algorithm:action.payload?theme.darkAlgorithm:theme.defaultAlgorithm
			   }
		   })
            state.darkMode = action.payload;
        },
        setCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isCollapsed = action.payload;
        },
        setTitle:(state,action:PayloadAction<string>) => {
            state.select = action.payload
        },
		setBreadcrumb:(state,action:PayloadAction<{
			key:string;
			label:string;
		}[]
		>) => {
			state.breadcrumb = action.payload
		}
    },
    extraReducers(builder) {
        builder.addMatcher((action:any)=>{
			return action.type.endsWith("/rejected");
		}, (_state, action) => {
			//MessageUtil.CatchError(action.payload);
			AlertUtil.CatchError(action.payload);
		})
    },
});

export const { setDarkMode,setCollapsed,setBreadcrumb,setTitle } = configSlice.actions;
export const configSelector = (state: RootState) => state.config;
export default configSlice.reducer;
