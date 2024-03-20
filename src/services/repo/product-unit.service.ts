import AxiosClient from "@providers/AxiosClient.ts";
import {ProductUnit} from "@/@types/repo/product-unit.type.ts";

const END_POINT = "/product-unit";
const ProductUnitService = {
	getPage:(query:Query|undefined)=>{
		return AxiosClient.get<ProductUnit,Page<ProductUnit>>(END_POINT,{
			params:query
		})
	},
	getDetail:(data:Partial<ProductUnit>)=>{
		return AxiosClient.get<ProductUnit,ProductUnit>(`${END_POINT}/${data._id}`)
	},
	update:(data:Partial<ProductUnit>)=>{
		return AxiosClient.put<ProductUnit,ProductUnit>(`${END_POINT}/${data._id}`,data)
	},
	delete:(data:Partial<ProductUnit>)=>{
		return AxiosClient.delete<ProductUnit,ProductUnit>(`${END_POINT}/${data._id}`)
	},
	create:(data:Partial<ProductUnit>)=>{
		return AxiosClient.post<ProductUnit,ProductUnit>(`${END_POINT}/`,data)
	},
	list:()=>{
		return AxiosClient.get<ProductUnit,ProductUnit[]>(`${END_POINT}/list`)
	},
}
export default ProductUnitService;