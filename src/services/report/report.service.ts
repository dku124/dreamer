import AxiosClient from "@providers/AxiosClient.ts";

const END_POINT = "/report";
const ReportService = {
	orderInDay:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Record<string, number>>(`${END_POINT}/orderByDay`,{params:param});
	},
	groupOrderByStatus:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, number>>>(`${END_POINT}/groupOrderByStatus`,{params:param});
	},
	totalOrderComfirmBySale:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/totalOrderComfirmBySale`,{params:param});
	},
	totalOrderShip:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/totalOrderShip`,{params:param});
	},
	analysisOrder:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/analysisOrder`,{params:param});
	},
	productReport:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/productReport`,{params:param});
	},
	reportOrderByProvince:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/reportOrderByProvince`,{params:param});
	},
	reportOrderGroupBySize:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/reportOrderGroupBySize/${param.id}`);
	},
	reportCampaign:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/reportCampaign`,{params:param});
	},
	reportCustomer:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Record<string, Record<string, number>>>(`${END_POINT}/reportCustomer`,{params:param});
	},
	reportCustomerDetail:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Array<Record<string, any>>>(`${END_POINT}/reportCustomerDetail`,{params:param});
	},
	reportCustomerGender:async () => {
		return await AxiosClient.get<any,Array<Record<string, number>>>(`${END_POINT}/reportCustomerByGender`);
	},
	reportCustomerByProvince:async (param:Record<string, any>) => {
		return await AxiosClient.get<any,Record<string, Array<number>>>(`${END_POINT}/reportCustomerByProvince`,{params:param});
	}
}
export default ReportService;