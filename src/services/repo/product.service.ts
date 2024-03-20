import baseService from "@/common/base/service.base.ts";
import {Product} from "@/@types/repo/product.type.ts";
import AxiosClient from "@providers/AxiosClient.ts";

const END_POINT = "/product";
const ProductService = baseService<Product>(END_POINT)

ProductService.uploadImage = (data:FormData,id:string)=>{
	return AxiosClient.put<Product,Product>(`${END_POINT}/upload/${id}`,data,{
		headers:{
			'Content-Type': 'multipart/form-data'
		}
	})
}
ProductService.getList = (query:string)=>{
	return AxiosClient.get<Product,Product[]>(`${END_POINT}/get/list`,{
		params:{
			query
		}
	})
}
export default ProductService as typeof ProductService & { 
	uploadImage:(data:FormData,id:string)=>Promise<any> 
	getList:(query:string)=>Promise<Product[]>
};