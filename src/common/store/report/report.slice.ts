import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import ReportThunk from "@store/report/report.thunk.ts";
import {LinkUtil} from "@utils/link.util.ts";


interface ReportState {
	orderInDay:Record<string, number> | {};
	orderGroupByStatus:Array<any> | [];
	orderComfirmBySale:Array<any> | [];
	shipGroupByStatus:Array<any> | [];
	analysisOrder:Array<any> | [];
	productReport:Array<any> | [];
	reportOrderByProvince:Array<any> | [];
	reportOrderGroupBySize:Array<any> | [];
	reportCampaign:Array<any> | [];
	getListAndSKU:Array<any> | [];
	reportCustomer:Record<string, Record<string, number>>,
	reportCustomerGender:Array<Record<string, number>>,
	reportCustomerDetail:Array<any>,
	reportCustomerByProvince:Record<string, Array<number>>
	loadding:boolean,
	loadings:{
		dowloadExcelOrder:boolean,
		dowloadExcelShip:boolean,
		dowloadExcelRepo:boolean,
		dowloadExcelCamp:boolean,
		analysisOrder:number,
		analysisOCamp:number,
		analysisOrderLoading:boolean,
		reportCustomer:boolean,
		reportCustomerGender:boolean,
		reportCustomerDetail:boolean,
		reportCustomerByProvince:boolean,
	}
}

const defaultInitialState:ReportState = {
	orderInDay: {},
	orderGroupByStatus: [],
	orderComfirmBySale: [],
	shipGroupByStatus: [],
	analysisOrder: [],
	reportCustomer: {},
	productReport: [],
	reportOrderByProvince: [],
	reportOrderGroupBySize: [],
	reportCampaign: [],
	reportCustomerGender: [],
	reportCustomerDetail: [],
	reportCustomerByProvince: {},
	getListAndSKU: [],
	loadding: false,
	loadings: {
		dowloadExcelOrder: false,
		dowloadExcelShip: false,
		dowloadExcelRepo: false,
		dowloadExcelCamp: false,
		analysisOrderLoading: false,
		analysisOCamp: -1,
		analysisOrder : -1,
		reportCustomer: false,
		reportCustomerGender: false,
		reportCustomerDetail: false,
		reportCustomerByProvince: false,
		
	}
};

const reportSlice = createSlice({
	name: 'config',
	initialState: defaultInitialState,
	reducers: {
		resetAnalysisOrder: (state) => {
			state.loadings.analysisOrder = -1
		},
		resetAnalysisCamp: (state) => {
			state.loadings.analysisOCamp = -1
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(ReportThunk.orderByday.fulfilled, (state, action) => {
				state.orderInDay = action.payload;
			})
			.addCase(ReportThunk.groupOrderByStatus.fulfilled, (state, action) => {
				state.orderGroupByStatus = action.payload;
			})
			.addCase(ReportThunk.totalOrderComfirmBySale.fulfilled, (state, action) => {
				state.orderComfirmBySale = action.payload;
			})
			.addCase(ReportThunk.totalOrderShip.fulfilled, (state, action) => {
				state.shipGroupByStatus = action.payload;
			})
			.addCase(ReportThunk.analysisOrder.pending, (state, action) => {
				if (state.loadings.analysisOrder === -1) {
					state.loadings.analysisOrder = 0
				}
				state.loadings.analysisOrderLoading= true
			})
			.addCase(ReportThunk.analysisOrder.fulfilled, (state, action) => {
				state.analysisOrder = action.payload;
				state.loadings.analysisOrder = 1
				state.loadings.analysisOrderLoading= false
			})
			.addCase(ReportThunk.analysisOrder.rejected, (state, action) => {
				state.loadings.analysisOrder = 1
				state.loadings.analysisOrderLoading= false
			})
			.addCase(ReportThunk.productReport.fulfilled, (state, action) => {
				state.productReport = action.payload;
			})
			.addCase(ReportThunk.reportOrderByProvince.fulfilled, (state, action) => {
				state.reportOrderByProvince = action.payload;
			})
			.addCase(ReportThunk.reportOrderGroupBySize.fulfilled, (state, action) => {
				state.reportOrderGroupBySize = action.payload;
				state.loadding = false
			})
			.addCase(ReportThunk.reportOrderGroupBySize.pending, (state, action) => {
				state.loadding = true
			})
			.addCase(ReportThunk.reportCampaign.fulfilled, (state, action) => {
				state.reportCampaign = action.payload;
				state.loadding = false
			})
			.addCase(ReportThunk.getListAndSKU.fulfilled, (state, action) => {
				state.getListAndSKU = action.payload;
			})
			.addCase(ReportThunk.dowloadExcelOrder.pending, (state, action) => {
				state.loadings.dowloadExcelOrder = true
			})
			.addCase(ReportThunk.dowloadExcelOrder.fulfilled, (state, action) => {
				state.loadings.dowloadExcelOrder = false
				LinkUtil.dowloadByBlob(action.payload, "BaoCaoDonHang.xlsx")
			})
			.addCase(ReportThunk.dowloadExcelShip.pending, (state, action) => {
				state.loadings.dowloadExcelShip = true
			})
			.addCase(ReportThunk.dowloadExcelShip.fulfilled, (state, action) => {
				state.loadings.dowloadExcelShip = false
				LinkUtil.dowloadByBlob(action.payload, "BaoCaoVanChuyen.xlsx")
			})
			.addCase(ReportThunk.dowloadExcelRepo.pending, (state, action) => {
				state.loadings.dowloadExcelRepo = true
			})
			.addCase(ReportThunk.dowloadExcelRepo.fulfilled, (state, action) => {
				state.loadings.dowloadExcelRepo = false
				LinkUtil.dowloadByBlob(action.payload, "BaoCaoKho.xlsx")
			})
			.addCase(ReportThunk.dowloadExcelCamp.pending, (state, action) => {
				state.loadings.dowloadExcelCamp = true
			})
			.addCase(ReportThunk.dowloadExcelCamp.fulfilled, (state, action) => {
				state.loadings.dowloadExcelCamp = false
				LinkUtil.dowloadByBlob(action.payload, "BaoCaoCamp.xlsx")
			})
			.addCase(ReportThunk.reportCustomer.pending, (state, action) => {
				state.loadings.reportCustomer = true
			})
			.addCase(ReportThunk.reportCustomer.fulfilled, (state, action) => {
				state.reportCustomer = action.payload;
				state.loadings.reportCustomer = false
			})
			.addCase(ReportThunk.reportCustomer.rejected, (state, action) => {
				state.loadings.reportCustomer = false
			})
			
			.addCase(ReportThunk.reportCustomerGender.pending, (state, action) => {
				state.loadings.reportCustomerGender = true
			})
			.addCase(ReportThunk.reportCustomerGender.rejected, (state, action) => {
				state.loadings.reportCustomerGender = false
			})
			.addCase(ReportThunk.reportCustomerGender.fulfilled, (state, action) => {
				state.reportCustomerGender = action.payload;
				state.loadings.reportCustomerGender = false
			})
			.addCase(ReportThunk.reportCustomerDetail.pending, (state, action) => {
				state.loadings.reportCustomerDetail = true
			})
			.addCase(ReportThunk.reportCustomerDetail.rejected, (state, action) => {
				state.loadings.reportCustomerDetail = false
			})
			.addCase(ReportThunk.reportCustomerDetail.fulfilled, (state, action) => {
				state.loadings.reportCustomerDetail = false
				state.reportCustomerDetail = action.payload;
			})
			.addCase(ReportThunk.reportCustomerByProvince.pending, (state, action) => {
				state.loadings.reportCustomerByProvince = true
			})
			.addCase(ReportThunk.reportCustomerByProvince.rejected, (state, action) => {
				state.loadings.reportCustomerByProvince = false
			})
			.addCase(ReportThunk.reportCustomerByProvince.fulfilled, (state, action) => {
				state.loadings.reportCustomerByProvince = false
				state.reportCustomerByProvince = action.payload;
			})
		
	}
});

export const { resetAnalysisOrder,resetAnalysisCamp } = reportSlice.actions;
export const reportSelector = (state: RootState) => state.report;
export default reportSlice.reducer;
