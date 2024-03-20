import AxiosClient from "@providers/AxiosClient.ts";
import {Customer} from "@/@types/repo/customer.type";
import {Order} from "@/@types/order/order.type";

const END_POINT = "/customer";
const CustomerService = {

    getPage:(query:Query|undefined)=>{
        return AxiosClient.get<Customer,Page<Customer>>(END_POINT,{
            params:query
        })
    },
    getDetail:(data:Partial<Customer>)=>{
        return AxiosClient.get<Customer,Order[]>(`${END_POINT}/${data._id}`)
    },
    update:(data:Partial<Customer>)=>{
        return AxiosClient.put<Customer,Customer>(`${END_POINT}/${data._id}`,{
			...data.addOnInfo,
		})
    },
    delete:(data:Partial<Customer>)=>{
        return AxiosClient.delete<Customer,Customer>(`${END_POINT}/${data._id}`)
    },
	uploadImg:(id:string,file:any)=>{
		const formData = new FormData();
		formData.append("img", file);
		return AxiosClient.put<Customer,Customer>(`${END_POINT}/upload/${id}`,formData,{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
	},
    printBill:(data:{id: string, format : string})=>{
        return AxiosClient.get<any,string>(`order/bill/${data.id}`,);
    },
    printOrder:(data:{id: string, format : string})=>{
        return AxiosClient.get<any,Blob>(`order/printOrder/${data.id}`, {responseType: 'blob',});
    }
	
}
export default CustomerService;