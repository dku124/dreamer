import {Product, WarrantyUnit} from "@/@types/repo/product.type.ts";
import empty from "@/assets/images/empty.png";
import {EnumUtil} from "@utils/enum.util.ts";
import {OrderTag} from "@/@types/order/order.type.ts";
import {OrderDetail} from "@/@types/order/detail.type.ts";
import {SKU} from "@/@types/repo/sku.type.ts";

export class ProductHelper
{
	static uploadPath(product:Product)
	{
		return `${import.meta.env.VITE_API_HOST}uploads/${product.img.replace("\\","/")}`
	}
	
	static renderImg(product:Product)
	{
		if (!product?.img)
		{
			return 
		}
		return <img src={ProductHelper.uploadPath(product)} alt={product.name} width={100} />
	}
	static renderImg2(product:Product)
	{
		if (!product?.img)
		{
			// @ts-ignore
			return <div></div>
		}
		return <img src={ProductHelper.uploadPath(product)} alt={product.name} width={100} />
	}
	static toWarranty()
	{
		const WarrantyUnitLabel :Record<string, string>= {
			"DAY": "Ngày",
			"WEEK": "Tuần",
			"MONTH": "Tháng",
			"YEAR": "Năm",
		}
		return EnumUtil.toArray<string>(WarrantyUnit).map((warranty) => {
			return {
				value: warranty,
				label: WarrantyUnitLabel[warranty]
			}
		})
	}
	
	static toOptionsTag()
	{
		const labels:Record<string, string> = {
			[OrderTag.IN_STOCK]: "Còn hàng",
			[OrderTag.OUT_OF_STOCK]: "Hết hàng",
			[OrderTag.UNCATEGORIZED]: "Chưa phân loại",
			[""]: "Tất cả",
		}
		return ["",...EnumUtil.toArray<string>(OrderTag)].map((tag) => {
			return {
				value: tag,
				label: labels[tag]
			}
		})
		
	}
	
	
	static toSrc(details:OrderDetail[])
	{
		const str:Array<string> = [];
		details.forEach((e)=>{
			if (e.sku)
			{
				if (!str.includes(e.sku.importAddress))
				{
					str.push(e.sku.importAddress)
				}
			}
		})
		return str.join(", ");
	}
	
	static GetSkuByProduct(product:Product,skus:SKU[])
	{
		return skus.filter((e)=>(e.product as unknown as string) === product._id)
	}
}