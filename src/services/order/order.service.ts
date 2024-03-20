import AxiosClient from "@providers/AxiosClient.ts";
import {Order} from "@/@types/order/order.type.ts";

const END_POINT = "/order";
const OrderService = {
	getPage:(query:Query|undefined)=>{
		return AxiosClient.get<Order,Page<Order>>(END_POINT,{
			params:query
		})
	},
	getDetail:(data:Partial<Order>)=>{
		return AxiosClient.get<Order,Order>(`${END_POINT}/${data._id}`)
	},
	update:(data:Partial<Order>)=>{
		return AxiosClient.put<Order,Order>(`${END_POINT}/${data._id}`,data)
	},
	updateStatus:(data:Partial<Order>)=>{
		return AxiosClient.put<Order,Order>(`${END_POINT}/updateStatus/${data._id}`,data)
	},
	delete:(data:Partial<Order>)=>{
		return AxiosClient.delete<Order,Order>(`${END_POINT}/${data._id}`)
	},
	create:(data:Partial<Order>)=>{
		return AxiosClient.post<Order,Order>(`${END_POINT}/`,data)
	},
	getOrderRaw:()=>{
		return AxiosClient.get<Order,Order[]>(`${END_POINT}/get/list`)
	},
	splitOrderForSale:(ids:Array<string>)=>{
		return AxiosClient.put<Order,Order>(`${END_POINT}/split/Order`,{
			ids
		})
	},
	createOrderShip(id:string){
		return AxiosClient.put<Order,Order>(`${END_POINT}/ship/create/${id}`)
	},
	cancelOrderShip(id:string){
		return AxiosClient.delete<Order,Order>(`${END_POINT}/ship/cancel/${id}`)
	},
	ReturnedOderShip(id:string,data:object){
		return AxiosClient.put<Order,Order>(`${END_POINT}/ship/returned/${id}`,data)
	},
	UpdateInforShip(id:string,shipTo:object){
		return AxiosClient.put<Order,Order>(`${END_POINT}/ship/updateInforShip/${id}`,{
			...shipTo
		})
	},
	ReturnOrderToSale(id:string){
		return AxiosClient.put<Order,Order>(`${END_POINT}/returnOrderToSale/${id}`)
	},
	updateNoteOrder(id:string,note:string){
		return AxiosClient.put<Order,Order>(`${END_POINT}/note/${id}`,{
			note
		})
	},
	asyncShip(data : object){
		return AxiosClient.put<Order,Order>(`${END_POINT}/ship/async`,data)
	}
}
export default OrderService;