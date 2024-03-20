import baseService from "@/common/base/service.base.ts";
import {SKU} from "@/@types/repo/sku.type.ts";
import {Product} from "@/@types/repo/product.type.ts";
import AxiosClient from "@providers/AxiosClient.ts";

const END_POINT = "/s-k-u";
const SkuService = baseService<SKU>(END_POINT)
SkuService.getList = (product:Product)=>{
	return AxiosClient.get<SKU[],SKU[]>(`${END_POINT}/${product._id}`)
}
SkuService.getListByCategory = (category:string)=>{
	return AxiosClient.get<SKU[],SKU[]>(`${END_POINT}/get/list/${category}`)
}
SkuService.getListByProduct = (product:string)=>{
	return AxiosClient.get<SKU[],SKU[]>(`${END_POINT}/get/listByProduct/${product}`)
}
export default SkuService as typeof SkuService & {
	getList:(product:Product)=>Promise<SKU[]>
	getListByCategory:(category:string)=>Promise<SKU[]>
};