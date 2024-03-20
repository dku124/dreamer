import AxiosClient from "@providers/AxiosClient.ts";
import {Supplier} from "@/@types/repo/supplier.type.ts";

const END_POINT = "/supplier";
const SupplierService = {
	getPage:(query:Query|undefined)=>{
		return AxiosClient.get<Supplier,Page<Supplier>>(END_POINT,{
			params:query
		})
	},
	getDetail:(data:Partial<Supplier>)=>{
		return AxiosClient.get<Supplier,Supplier>(`${END_POINT}/${data._id}`)
	},
	update:(data:Partial<Supplier>)=>{
		return AxiosClient.put<Supplier,Supplier>(`${END_POINT}/${data._id}`,data)
	},
	delete:(data:Partial<Supplier>)=>{
		return AxiosClient.delete<Supplier,Supplier>(`${END_POINT}/${data._id}`)
	},
	create:(data:Partial<Supplier>)=>{
		return AxiosClient.post<Supplier,Supplier>(`${END_POINT}/`,data)
	},
	list:()=>{
		return AxiosClient.get<Supplier,Supplier[]>(`${END_POINT}/get/list`)
	},
}
export default SupplierService;