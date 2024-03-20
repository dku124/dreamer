import {Timeline} from "@/@types/order/timeline.type";
import AxiosClient from "@providers/AxiosClient.ts";


const END_POINT = "/shipping";
const OrderService = {
	caculatorShipping:(type:string,data:Record<string, any>)=>{
		return AxiosClient.post<any,any>(`${END_POINT}/caculator/ship?shippingType=${type}`,data)
	},
	printOrder:(id:string,shippingType:string)=>{
		return AxiosClient.get<any,any>(`${END_POINT}/print/${id}`,{
			params:{
				shippingType
			}
		})
	},
	printOrders:(ids:string[],shippingType:string)=>{
		return AxiosClient.post<any,any>(`${END_POINT}/print/printPdfMerge`,{
			ids
		},{
			params:{
				shippingType
			}
		})
	},
	getTimeline(id : string){
		return AxiosClient.get<any,Timeline[]>(`${END_POINT}/timeline/${id}`)
	}
}
export default OrderService;