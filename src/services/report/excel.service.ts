import {DateUtil} from "@utils/date.util.tsx";
import AxiosClient from "@providers/AxiosClient.ts";

const END_POINT = "/excell";
const ExcelService = {
	order:async (param:Record<string, any> = {
		from: new Date().toISOString(),
		to: new Date().toISOString()
	}) => {
		return  AxiosClient.get<any,any>(`${END_POINT}/order?from=${param.from}&to=${param.to}`,{
			responseType: 'blob',
		})
	},
	ship:async (param:Record<string, any> = {
		from: DateUtil.format(new Date(),'dd/MM/yyyy'),
		to: DateUtil.format(new Date(),'dd/MM/yyyy')
	}) => {
		return  AxiosClient.get<any,any>(`${END_POINT}/ship?from=${param.from}&to=${param.to}`,{
			responseType: 'blob',
		})
	},
	repo:async () => {
		return  AxiosClient.get<any,any>(`${END_POINT}/repo`,{
			responseType: 'blob',
		})
	},
	camp:async (param:Record<string, any> = {
		from: DateUtil.format(new Date(),'dd/MM/yyyy'),
		to: DateUtil.format(new Date(),'dd/MM/yyyy')
	}) => {
		return  AxiosClient.get<any,any>(`${END_POINT}/camp`,{
			responseType: 'blob',
			params:param
		})
	}
}
export default ExcelService;