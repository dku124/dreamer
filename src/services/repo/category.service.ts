import AxiosClient from "@providers/AxiosClient.ts";
import {Category} from "@/@types/repo/category.type.ts";

const END_POINT = "/category";
const CategoryService = {
	getPage:(query:Query|undefined)=>{
		return AxiosClient.get<Category,Page<Category>>(END_POINT,{
			params:query
		})
	},
	getDetail:(data:Partial<Category>)=>{
		return AxiosClient.get<Category,Category>(`${END_POINT}/${data._id}`)
	},
	update:(data:Partial<Category>)=>{
		return AxiosClient.put<Category,Category>(`${END_POINT}/${data._id}`,data)
	},
	delete:(data:Partial<Category>)=>{
		return AxiosClient.delete<Category,Category>(`${END_POINT}/${data._id}`)
	},
	create:(data:Partial<Category>)=>{
		return AxiosClient.post<Category,Category>(`${END_POINT}/`,data)
	},
	list:()=>{
		return AxiosClient.get<Category,Category[]>(`${END_POINT}/get/list`)
	},
	getListAndSKU:()=>{
		return AxiosClient.get<Category,Category[]>(`${END_POINT}/get/categoryandSKU`)
	}
}
export default CategoryService;