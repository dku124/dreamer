import {createAsyncThunk} from "@reduxjs/toolkit";
import ReportService from "@/services/report/report.service.ts";
import CategoryService from "@/services/repo/category.service.ts";
import ExcelService from "@/services/report/excel.service.ts";

const ReportThunk = {
	orderByday:createAsyncThunk("report/orderByDay", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.orderInDay(param).catch(thunkAPI.rejectWithValue)
	}),
	groupOrderByStatus:createAsyncThunk("report/groupOrderByStatus", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.groupOrderByStatus(param).catch(thunkAPI.rejectWithValue)
	}),
	totalOrderComfirmBySale:createAsyncThunk("report/totalOrderComfirmBySale", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.totalOrderComfirmBySale(param).catch(thunkAPI.rejectWithValue)
	}),
	totalOrderShip:createAsyncThunk("report/totalOrderShip", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.totalOrderShip(param).catch(thunkAPI.rejectWithValue)
	}),
	analysisOrder:createAsyncThunk("report/analysisOrder", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.analysisOrder(param).catch(thunkAPI.rejectWithValue)
	}),
	productReport:createAsyncThunk("report/productReport", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.productReport(param).catch(thunkAPI.rejectWithValue)
	}),
	reportOrderByProvince:createAsyncThunk("report/reportOrderByProvince", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.reportOrderByProvince(param).catch(thunkAPI.rejectWithValue)
	}),
	reportOrderGroupBySize:createAsyncThunk("report/reportOrderGroupBySize", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.reportOrderGroupBySize(param).catch(thunkAPI.rejectWithValue)
	}),
	reportCampaign:createAsyncThunk("report/reportCampaign", async (param:Record<string, any>,thunkAPI) => {
		return await ReportService.reportCampaign(param).catch(thunkAPI.rejectWithValue)
	}),
	getListAndSKU:createAsyncThunk("category/getListAndSKU",async (_,thunkAPI)=>{
		return CategoryService.getListAndSKU().catch(thunkAPI.rejectWithValue)
	}),
	dowloadExcelOrder:createAsyncThunk("report/dowloadExcelOrder",async (param:Record<string, any>,thunkAPI)=>{
		return await ExcelService.order(param).catch(thunkAPI.rejectWithValue)
	}),
	dowloadExcelShip:createAsyncThunk("report/dowloadExcelShip",async (param:Record<string, any>,thunkAPI)=>{
		return await ExcelService.ship(param).catch(thunkAPI.rejectWithValue)
	}),
	dowloadExcelRepo:createAsyncThunk("report/dowloadExcelRepo",async (_,thunkAPI)=>{
		return await ExcelService.repo().catch(thunkAPI.rejectWithValue)
	}),
	dowloadExcelCamp:createAsyncThunk("report/dowloadExcelCamp",async (param:Record<string, any>,thunkAPI)=>{
		return await ExcelService.camp(param).catch(thunkAPI.rejectWithValue)
	}),
	reportCustomer:createAsyncThunk("report/reportCustomer",async (param:Record<string, any>,thunkAPI)=>{
		return await ReportService.reportCustomer(param).catch(thunkAPI.rejectWithValue)
	}),
	reportCustomerDetail:createAsyncThunk("report/reportCustomerDetail",async (param:Record<string, any>,thunkAPI)=>{
		return await ReportService.reportCustomerDetail(param).catch(thunkAPI.rejectWithValue)
	}),
	reportCustomerGender:createAsyncThunk("report/reportCustomerGender",async (_,thunkAPI)=>{
		return await ReportService.reportCustomerGender().catch(thunkAPI.rejectWithValue)
	}),
	reportCustomerByProvince:createAsyncThunk("report/reportCustomerByProvince",async (param:Record<string, any>,thunkAPI)=>{
		return await ReportService.reportCustomerByProvince(param).catch(thunkAPI.rejectWithValue)
	}),
}

export default ReportThunk;